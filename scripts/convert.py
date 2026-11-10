"""Convert the HTTrack mirror into JSON page data for the Next.js app.
Usage: python3 -I convert.py <mirror_dir> <next_app_dir>
"""
import json, os, posixpath, re, shutil, sys
from bs4 import BeautifulSoup, Comment

SRC, OUT = sys.argv[1], sys.argv[2]
DATA = os.path.join(OUT, "content", "pages")
PUB = os.path.join(OUT, "public")

REMOVED_PREFIXES = ("/news/", "/info/")
REMOVED_EXACT = {"/inquiry", "/newslist-1", "/newslist-2", "/news", "/info"}
DROP_SCRIPT_PAT = re.compile(r"float16806|kcim/visitor|leavemessage|googletagmanager|gtag\(|gtm\.start", re.I)
CDN_PAT = re.compile(r"^(?:\.\./)+((?:css|js|img)0\d\.v15cdn\.com/.*)$")


def route_of(rel):  # 'a/b/index.html' -> '/a/b', 'x.html' -> '/x'
    rel = rel.replace(os.sep, "/")
    if rel == "index.html":
        return "/"
    if rel.endswith("/index.html"):
        return "/" + rel[: -len("/index.html")]
    return "/" + rel[: -len(".html")]


def is_removed(route):
    return route in REMOVED_EXACT or route.startswith(REMOVED_PREFIXES)


def fix_url(url, page_dir):
    if not url:
        return url
    u = url.strip()
    m = CDN_PAT.match(u)
    if m:
        return "https://" + m.group(1)
    if re.match(r"^(https?:|mailto:|tel:|javascript:|#|data:|//)", u, re.I):
        if "linked-reality.com" in u:
            return None
        return u
    parts = re.split(r"([?#])", u, maxsplit=1)
    path, sep, rest = (parts + ["", ""])[:3]
    joined = posixpath.normpath(posixpath.join("/" + page_dir, path)) if path else "/" + page_dir
    if joined.startswith("/.."):
        return u
    if joined.endswith(".html"):
        joined = route_of(joined.lstrip("/"))
    return joined + (sep + rest if sep else "")


def clean(soup):
    # nav / footer entries for removed pages
    for a in soup.find_all("a", href=True):
        href = a["href"]
        if href is None:
            continue
        target = href.split("?")[0].split("#")[0]
        if "linked-reality.com" in href or is_removed(target):
            li = a.find_parent("li")
            if li is not None and len(li.find_all("a")) == 1 and not li.find("img"):
                li.decompose()
            else:
                a["href"] = "/contact-us"
    for li in soup.select('li[id$="VRLink"]'):
        li.decompose()
    for el in soup.select("#wmkcfeedback, link#wmkcproducts"):
        el.decompose()
    # testimonials + homepage news carousel
    for t in soup.select("div.twado"):
        t.decompose()
    for box in soup.select("div.news.like_box"):
        box.decompose()


def convert(rel):
    page_dir = posixpath.dirname(rel.replace(os.sep, "/"))
    with open(os.path.join(SRC, rel), encoding="utf-8", errors="replace") as f:
        soup = BeautifulSoup(f.read(), "lxml")
    for c in soup.find_all(string=lambda s: isinstance(s, Comment)):
        c.extract()

    for tag, attr in (("a", "href"), ("img", "src"), ("link", "href"), ("script", "src"),
                      ("iframe", "src"), ("source", "src"), ("form", "action")):
        for el in soup.find_all(tag):
            if el.get(attr):
                new = fix_url(el[attr], page_dir)
                if new is None:
                    el[attr] = None
                    del el[attr]
                else:
                    el[attr] = new
    for el in soup.find_all(style=True):
        el["style"] = re.sub(r"url\((['\"]?)([^)'\"]+)\1\)",
                             lambda m: "url(%s)" % (fix_url(m.group(2), page_dir) or m.group(2)), el["style"])
    clean(soup)

    head, body = soup.head, soup.body
    title = head.title.get_text(strip=True) if head and head.title else ""
    def meta(n):
        m = head.find("meta", attrs={"name": n}) if head else None
        return m.get("content", "") if m else ""

    styles, inline_styles, scripts = [], [], []
    for el in (head.find_all(["link", "style", "script"]) if head else []):
        if el.name == "link" and "stylesheet" in (el.get("rel") or []):
            styles.append(el["href"])
        elif el.name == "style":
            inline_styles.append(el.get_text())
        elif el.name == "script" and el.get("type") != "application/ld+json":
            src = el.get("src")
            code = el.get_text()
            if DROP_SCRIPT_PAT.search(src or code):
                continue
            scripts.append({"src": src} if src else {"code": code})
    # body: scripts pulled out in order, styles/links kept inline
    for el in body.find_all("script"):
        src = el.get("src")
        code = el.get_text()
        if el.get("type") == "application/ld+json" or DROP_SCRIPT_PAT.search(src or code):
            el.decompose(); continue
        scripts.append({"src": src} if src else {"code": code})
        el.decompose()
    for el in body.find_all("noscript"):
        if "googletagmanager" in str(el):
            el.decompose()

    route = route_of(rel)
    data = {
        "route": route, "title": title, "description": meta("description"),
        "keywords": meta("keywords"), "styles": list(dict.fromkeys(styles)),
        "inlineStyles": inline_styles, "scripts": scripts,
        "html": body.decode_contents().strip(),
    }
    name = "index" if route == "/" else route.strip("/").replace("/", "__")
    with open(os.path.join(DATA, name + ".json"), "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False)
    return route


def main():
    os.makedirs(DATA, exist_ok=True)
    routes, skipped = [], []
    for root, _, files in os.walk(SRC):
        for fn in files:
            rel = os.path.relpath(os.path.join(root, fn), SRC)
            if fn.endswith(".html"):
                r = route_of(rel)
                (skipped if is_removed(r) else routes).append(r)
                if not is_removed(r):
                    convert(rel)
            elif fn != "sitemap.xml":
                dst = os.path.join(PUB, rel)
                os.makedirs(os.path.dirname(dst), exist_ok=True)
                shutil.copy2(os.path.join(root, fn), dst)
    # neutralise floating corner widget + chat scripts at the asset level too
    for p in ("Content/File_Img/16806/float16806.js",):
        fp = os.path.join(PUB, p)
        if os.path.exists(fp):
            os.remove(fp)
    shutil.rmtree(os.path.join(PUB, "Content", "kcim"), ignore_errors=True)
    print(len(routes), "pages kept,", len(skipped), "removed")


main()
