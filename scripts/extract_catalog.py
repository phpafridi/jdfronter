"""Build content/catalog.json (categories, products, certificates) from content/pages/*.json.
Usage: python3 -I scripts/extract_catalog.py <next_app_dir>
"""
import glob, json, os, re, sys
from bs4 import BeautifulSoup

APP = sys.argv[1]
PAGES = os.path.join(APP, "content", "pages")
PUB = os.path.join(APP, "public")


def load(route):
    name = "index" if route == "/" else route.strip("/").replace("/", "__")
    p = os.path.join(PAGES, name + ".json")
    return json.load(open(p, encoding="utf-8")) if os.path.exists(p) else None


def clean_text(s):
    return re.sub(r"\s+", " ", s or "").strip()


def nice_name(n):
    return n.replace("''", '"')


def fix_src(src):
    src = (src or "").split("?")[0]
    src = src.replace("/admin.seo.com.cn", "")
    return src if os.path.exists(os.path.join(PUB, src.lstrip("/"))) else None


# ---- category tree from sidebar
home = BeautifulSoup(load("/products")["html"], "html.parser")
cats = []
for li in home.select(".pro_left ul.sf_menu > li"):
    a = li.find("a")
    node = {"slug": a["href"].strip("/"), "name": nice_name(clean_text(a.get_text())), "children": []}
    for sub in li.select("ul.sub-menu > li > a"):
        node["children"].append({"slug": sub["href"].strip("/"), "name": nice_name(clean_text(sub.get_text())), "children": []})
    cats.append(node)

all_cats = {}
def walk(nodes, parent=None):
    for n in nodes:
        n["parent"] = parent
        all_cats[n["slug"]] = n
        walk(n["children"], n["slug"])
walk(cats)

# ---- products
products = {}
for f in glob.glob(os.path.join(PAGES, "*.json")):
    d = json.load(open(f, encoding="utf-8"))
    if "pror_detail" not in d["html"]:
        continue
    s = BeautifulSoup(d["html"], "html.parser")
    pr = s.select_one(".pro_right")
    name = clean_text(pr.select_one("h1").get_text())
    imgs = []
    for im in pr.select(".spec-scroll img"):
        src = fix_src(im.get("bimg") or im.get("src"))
        if src and src not in imgs:
            imgs.append(src)
    if not imgs:
        for main in pr.select(".pror_detail img"):
            src = fix_src(main.get("jqimg") or main.get("src"))
            if src and src not in imgs:
                imgs.append(src)
    summary = clean_text(pr.select_one(".pror_detail .fr p").get_text() if pr.select_one(".pror_detail .fr p") else "")
    summary = re.sub(r"\s*1\. Product Parameter.*$", "", summary)
    box = pr.select_one(".watch_botton .button_box")
    body = BeautifulSoup("", "html.parser")
    for el in list(box.children) if box else []:
        if getattr(el, "name", None) in ("button",) or (getattr(el, "name", None) == "p" and el.find("input")):
            continue
        body.append(el)
    for el in body.find_all(True):
        for attr in ("style", "width", "height", "class", "id", "bordercolor", "cellpadding", "cellspacing", "border", "frame", "title", "align", "valign"):
            if attr in el.attrs:
                del el[attr]
        if el.name == "img":
            src = fix_src(el.get("src"))
            if src:
                el["src"] = src; el["alt"] = el.get("alt") or name; el["loading"] = "lazy"
            else:
                el.decompose()
        elif el.name == "a" and el.get("href", "").startswith(("http", "#")) and "jiadi" in el.get("href", ""):
            el.unwrap()
    for el in body.find_all(["span", "font"]):
        el.unwrap()
    html = re.sub(r"(<p>\s*(<br/>)?\s*</p>\s*)+", "", str(body)).strip()
    slug = d["route"].strip("/")
    products[slug] = {"slug": slug, "name": nice_name(name), "images": imgs, "summary": summary, "html": html, "categories": []}

# ---- category membership from listing pages (incl. page-N)
for slug, c in all_cats.items():
    members = []
    n = 1
    while True:
        d = load("/" + slug + ("" if n == 1 else f"/page-{n}"))
        if not d:
            break
        s = BeautifulSoup(d["html"], "html.parser")
        for a in s.select(".pro_right .list_right h3 a, .pro_right li .pbox a"):
            p = a["href"].strip("/")
            if p in products and not products[p]["images"]:
                im = a.find_parent("li").find("img") if a.find_parent("li") else None
                src = fix_src(im.get("src")) if im else None
                if src:
                    big = fix_src(src.replace("/small/", "/"))
                    products[p]["images"].append(big or src)
            if p in products and p not in members:
                members.append(p)
        n += 1
    c["products"] = members
    for p in members:
        products[p]["categories"].append(slug)
for p in products.values():  # fallback: URL parent
    if not p["categories"]:
        parent = p["slug"].rsplit("/", 1)[0]
        if parent in all_cats:
            p["categories"].append(parent)
            all_cats[parent]["products"].append(p["slug"])
# parent categories include children's products
for c in cats:
    for ch in c["children"]:
        for p in ch["products"]:
            if p not in c["products"]:
                c["products"].append(p)

# ---- category intro text (if any) from category page
for slug, c in all_cats.items():
    d = load("/" + slug)
    c["title"] = d["title"] if d else c["name"]

# ---- certificates
certs = []
s = BeautifulSoup(load("/production-equipment")["html"], "html.parser")
rows = s.select(".pro_right table tr")
for i in range(len(rows) - 1):
    imgs = rows[i].select("td img")
    labels = rows[i + 1].select("td")
    if imgs and not rows[i + 1].find("img"):
        labels = [clean_text(t.get_text()) for t in labels if clean_text(t.get_text())]
        for im, lab in zip(imgs, labels):
            src = fix_src(im.get("src"))
            if src:
                certs.append({"src": src, "label": lab})

def strip(n):
    return {"slug": n["slug"], "name": n["name"], "parent": n["parent"], "products": n["products"],
            "children": [strip(c) for c in n["children"]]}

out = {"categories": [strip(c) for c in cats], "products": products, "certificates": certs}
json.dump(out, open(os.path.join(APP, "content", "catalog.json"), "w", encoding="utf-8"), ensure_ascii=False)
print(len(cats), "top categories,", len(all_cats), "total;", len(products), "products;", len(certs), "certificates")
print("products w/o images:", [p for p, v in products.items() if not v["images"]][:5])
print("products w/o category:", [p for p, v in products.items() if not v["categories"]][:5])
