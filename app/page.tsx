import Link from "next/link";
import HeroSlider from "@/components/HeroSlider";
import ProductCard from "@/components/ProductCard";
import { Icon } from "@/components/Icon";
import { FEATURED, SITE, allProducts, categories, categoryBySlug, categoryProducts, productImage } from "@/lib/site";

export const metadata = { alternates: { canonical: "/" } };

const FEATURES = [
  { icon: "shield", title: "100% Genuine", text: "Imported direct from the Jiadi factory." },
  { icon: "drop", title: "Full Pump Range", text: "2\" to 6\" deep well, solar and sewage." },
  { icon: "award", title: "Certified Quality", text: "ISO 9001, CE, GS and RoHS." },
  { icon: "tool", title: "After-Sales Service", text: "Local warranty and spare parts." },
];

export default function Home() {
  const featured = FEATURED.map((s) => categoryBySlug[s]).filter(Boolean);
  const popular = ["4-submersible-pump/4-ss-submersible-pump", "6-submersible-pump", "submersible-solar-pump", "sewage-submersible-pump"]
    .map((s) => categoryProducts(s)[0]).filter(Boolean);

  return (
    <>
      <HeroSlider />

      <section className="container features">
        {FEATURES.map((f, k) => (
          <div key={f.title} className={`feature${k === 0 ? " feature-accent" : ""}`}>
            <Icon name={f.icon} size={40} className="feature-icon" />
            <h3>{f.title}</h3>
            <p>{f.text}</p>
          </div>
        ))}
      </section>

      <section className="section container about-split">
        <div className="about-media">
          <img src="/Content/upload/2018348866/201809211027257969804.jpg" alt="Jiadi pump factory" loading="lazy" />
          <div className="about-badge"><strong>35+</strong><span>Years of Jiadi quality</span></div>
        </div>
        <div className="about-text">
          <span className="kicker">About Us</span>
          <h2>Your Trusted Pump Partner in Pakistan</h2>
          <p>{SITE.name} imports water submersible pumps from China to Pakistan as the authorised Jiadi dealer. We help homes, farms, housing societies and industries get reliable water with the right pump for every bore.</p>
          <ul className="checklist">
            <li><Icon name="check" size={18} /> Factory-original pumps</li>
            <li><Icon name="check" size={18} /> Expert pump sizing</li>
            <li><Icon name="check" size={18} /> Solar pump solutions</li>
            <li><Icon name="check" size={18} /> Dealer &amp; bulk pricing</li>
          </ul>
          <Link href="/about-us" className="btn btn-blue">Read More</Link>
        </div>
      </section>

      <section className="section bg-light">
        <div className="container">
          <div className="section-head">
            <span className="kicker">Our Products</span>
            <h2>Submersible Pumps for Every Need</h2>
          </div>
          <div className="cat-grid">
            {featured.map((c) => {
              const first = categoryProducts(c.slug)[0];
              return (
                <Link key={c.slug} href={"/" + c.slug} className="cat-card">
                  <div className="cat-img"><img src={first ? productImage(first) : "/placeholder-pump.svg"} alt={c.name} loading="lazy" /></div>
                  <div className="cat-body"><h3>{c.name}</h3><span>{c.products.length} products <Icon name="arrow" size={16} /></span></div>
                </Link>
              );
            })}
          </div>
          <div className="center"><Link href="/products" className="btn btn-orange">View All Products</Link></div>
        </div>
      </section>

      <section className="stats">
        <div className="container stats-grid">
          <div><strong>1988</strong><span>Jiadi founded</span></div>
          <div><strong>{allProducts.length}</strong><span>Pump models</span></div>
          <div><strong>{categories.length}</strong><span>Product categories</span></div>
          <div><strong>100%</strong><span>Genuine products</span></div>
        </div>
      </section>

      <section className="section container">
        <div className="section-head">
          <span className="kicker">Popular Pumps</span>
          <h2>Best Sellers in Pakistan</h2>
        </div>
        <div className="product-grid">
          {popular.map((p) => <ProductCard key={p.slug} p={p} />)}
        </div>
      </section>
    </>
  );
}
