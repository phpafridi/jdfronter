"""JD Frontier customisation pass over content/pages/*.json (run after convert.py).
Usage: python3 -I scripts/customize.py <next_app_dir>
"""
import glob, json, os, re, sys
from bs4 import BeautifulSoup

APP = sys.argv[1]
DATA = os.path.join(APP, "content", "pages")

BRAND = "JD Frontier"
TAGLINE = "Authorised Jiadi Dealer in Pakistan"
PHONE = "051-5553023"
PHONE_TEL = "+92515553023"
ADDRESS = "JD Frontier, City Saddar Road, Rawalpindi, Pakistan"
REMOVED = {"/our-product", "/our-service", "/our-company"}
BASE_KW = ("JD Frontier, authorised dealer in Pakistan, Jiadi pumps Pakistan, submersible pump Pakistan, "
           "water submersible pump Rawalpindi, deep well pump Pakistan, borehole pump Islamabad, "
           "solar submersible pump Pakistan, stainless steel submersible pump, imported pumps from China")

ABOUT_HTML = f"""
<h1 class="title-h1">About {BRAND}</h1>
<div class="single_imgb jdf-about">
  <img src="/Content/upload/2018348866/201809211027257969804.jpg" alt="{BRAND} - Jiadi submersible pumps" class="jdf-about-img">
  <h2>Who We Are</h2>
  <p><strong>{BRAND}</strong> is the <strong>authorised dealer of Jiadi submersible pumps in Pakistan</strong>.
  We import genuine water submersible pumps directly from China and supply them across Pakistan from our
  base on City Saddar Road, Rawalpindi.</p>
  <p>Jiadi has manufactured submersible pumps and motors since 1988 and exports to more than 70 countries.
  Through {BRAND}, Pakistani homes, farms, housing societies and industries get the same factory-original
  pumps — with local stock, local pricing and local support.</p>
  <h2>Why Choose {BRAND}</h2>
  <ul class="jdf-list">
    <li><strong>100% genuine products</strong> — imported directly from the Jiadi factory, no copies or refurbished units.</li>
    <li><strong>Full range in stock</strong> — 2" to 6" deep well pumps, borehole, screw, peripheral, drainage, sewage and solar submersible pumps.</li>
    <li><strong>Built for Pakistan</strong> — pumps suited to deep water tables, voltage fluctuation and solar-powered irrigation.</li>
    <li><strong>Expert guidance</strong> — we help you pick the right head, flow and motor size for your bore so you don't overspend.</li>
    <li><strong>Warranty &amp; after-sales service</strong> — local support and genuine spare parts when you need them.</li>
    <li><strong>Dealer &amp; bulk pricing</strong> — competitive rates for contractors, resellers and project orders.</li>
  </ul>
  <h2>Our Promise</h2>
  <p>Reliable water, every day. Whether it's a household tube well in Rawalpindi or a solar irrigation
  system in the field, we stand behind every pump we sell.</p>
  <p class="jdf-cta">Call us: <a href="tel:{PHONE_TEL}">{PHONE}</a> &nbsp;·&nbsp; Visit: {ADDRESS}</p>
</div>"""

MAP = ('<iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3322.8301717225104!2d73.05211167479327'
       '!3d33.60971064096962!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38df95996f35c1a7%3A0x618be534d1fbafb6'
       '!2sJD%20Frontier%20submersible!5e0!3m2!1sen!2s!4v1794295949735!5m2!1sen!2s" width="600" height="450" '
       'style="border:0;width:100%;" allowfullscreen="" loading="lazy" referrerpolicy="strict-origin-when-cross-origin"></iframe>')

CONTACT_HTML = f"""
<h1 class="title-h1">Contact Us</h1>
<div class="single_imgb jdf-contact">
  <p><strong>{BRAND}</strong> — {TAGLINE}</p>
  <p>ADD: {ADDRESS}</p>
  <p>TEL: <a href="tel:{PHONE_TEL}">{PHONE}</a></p>
  <div class="jdf-map">{MAP}</div>
</div>"""

CONTACT_BOX = f'<p>{BRAND}</p><p>ADD: City Saddar Road, Rawalpindi, Pakistan</p><p>TEL: <a href="tel:{PHONE_TEL}">{PHONE}</a></p>'

HOME_ABOUT = [
    ("Who We Are", "/about-us", f"{BRAND} is the authorised dealer of Jiadi in Pakistan, importing genuine water submersible pumps directly from China."),
    ("Full Product Range", "/products", "2\" to 6\" deep well, borehole, screw, drainage, sewage and solar submersible pumps — all in stock in Rawalpindi."),
    ("Certificate List", "/production-equipment", None),
    ("Local Support", "/contact-us", "Expert pump selection, warranty and after-sales service in Pakistan. Call " + PHONE + "."),
]


def frag(html):
    return BeautifulSoup(html, "html.parser")


def process(path):
    d = json.load(open(path, encoding="utf-8"))
    soup = BeautifulSoup(d["html"], "html.parser")
    route = d["route"]

    # links to removed About sub-pages
    for a in soup.find_all("a", href=True):
        if a["href"] in REMOVED:
            li = a.find_parent("li")
            if li is not None and li.find_parent("ul", class_="submenu"):
                li.decompose()
            else:
                a["href"] = "/about-us"
    # header: drop email + language + mobile-site link, set phone
    for li in soup.select("ul.info-links li"):
        if li.find("a", href=re.compile("^mailto:")):
            li.clear()
            li.append(frag(f'<img src="https://css02.v15cdn.com/m187/green/xin.png" width="24" height="24" alt="Address">City Saddar Road, Rawalpindi'))
        elif "+86" in li.get_text():
            li.clear()
            li.append(frag(f'<img src="https://css02.v15cdn.com/m187/green/dianhua.png" width="24" height="24" alt="Tel"><a href="tel:{PHONE_TEL}">{PHONE}</a>'))
    for el in soup.select("div.lang"):
        el.decompose()
    for a in soup.find_all("a", href=re.compile(r"m\.jiadipumps\.com")):
        a.find_parent("li").decompose()
    for img in soup.find_all("img", alt=re.compile("Taizhou Jiadi")):
        img["alt"] = f"{BRAND} - {TAGLINE}"
    # contact boxes (footer + sidebar)
    for box in soup.select("div.contact_box"):
        box.clear()
        box.append(frag(CONTACT_BOX))
    # footer newsletter (email) column
    for li in soup.select("ul.foot_li > li"):
        if li.find(id="SubmitEmail_I"):
            li.decompose()
    for el in soup.select("div.copy_right"):
        el.string = f"Copyright © {BRAND} — {TAGLINE}. All Rights Reserved."
    for a in soup.find_all("a", href=re.compile("^mailto:")):
        a.unwrap()

    if route == "/":
        # React slider replaces wowslider
        ss = soup.select_one("div.slideshow")
        if ss:
            ss.replace_with(soup.new_string("@@HERO@@"))
        for li, (title, href, text) in zip(soup.select("ul.about_box > li"), HOME_ABOUT):
            h = li.find("h5"); a = h.find("a")
            a["href"] = href; a.string = title
            li.find("img")["alt"] = title
            if text:
                li.find("p").clear(); li.find("p").append(text)
        call = soup.select_one("div.call_our p.hid")
        if call:
            call.clear()
            call.append(frag(f"{TAGLINE.upper()}<br/>CALL <a href=\"tel:{PHONE_TEL}\" style=\"color:inherit\">{PHONE}</a> — CITY SADDAR ROAD, RAWALPINDI"))
        d["scripts"] = [s for s in d["scripts"] if "wowslider" not in (s.get("src") or "")
                        and "rvc1" not in (s.get("code") or "")]
        d["scripts"] = [s if "rvc2" not in (s.get("code") or "") else
                        {"code": "$('#rvc2').rvc({liNum: 4,spaceBetween: 40,plr: 15,time: 400,prv: '.rvc-prv',next: '.rvc-next'})"}
                        for s in d["scripts"]]
    pr = soup.select_one("div.pro_right")
    if route == "/about-us" and pr:
        pr.clear(); pr.append(frag(ABOUT_HTML))
    if route == "/contact-us" and pr:
        pr.clear(); pr.append(frag(CONTACT_HTML))

    # metadata
    h1 = soup.select_one("h1")
    name = h1.get_text(" ", strip=True) if h1 and route != "/" else ""
    if route == "/":
        d["title"] = f"{BRAND} | {TAGLINE} — Water Submersible Pumps"
        d["description"] = (f"{BRAND} is the authorised Jiadi dealer in Pakistan, importing genuine water submersible "
                            f"pumps from China. Deep well, borehole, solar & sewage pumps in Rawalpindi. Call {PHONE}.")
        d["keywords"] = BASE_KW
    else:
        d["title"] = f"{name} | {BRAND} — {TAGLINE}"
        d["description"] = (f"{name} — genuine Jiadi pump imported from China by {BRAND}, authorised dealer in "
                            f"Pakistan. City Saddar Road, Rawalpindi. Call {PHONE}.")
        d["keywords"] = f"{name}, {name} Pakistan, {name} price in Pakistan, " + BASE_KW
    d["html"] = str(soup)
    json.dump(d, open(path, "w", encoding="utf-8"), ensure_ascii=False)


for r in REMOVED:
    p = os.path.join(DATA, r.strip("/") + ".json")
    if os.path.exists(p):
        os.remove(p)
for p in glob.glob(os.path.join(DATA, "*.json")):
    process(p)
print("done")
