import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import { Icon } from "@/components/Icon";
import { SITE, pageMeta } from "@/lib/site";

export const metadata = {
  ...pageMeta("About Us", `${SITE.name} is the authorised Jiadi dealer in Pakistan, importing genuine water submersible pumps from China. ${SITE.address}. Call ${SITE.phone}.`),
  alternates: { canonical: "/about-us" },
};

const WHY = [
  { icon: "shield", title: "100% genuine products", text: "Imported directly from the Jiadi factory — no copies or refurbished units." },
  { icon: "drop", title: "Full range in stock", text: "2\" to 6\" deep well, borehole, screw, peripheral, drainage, sewage and solar pumps." },
  { icon: "sun", title: "Built for Pakistan", text: "Pumps suited to deep water tables, voltage fluctuation and solar irrigation." },
  { icon: "award", title: "Expert guidance", text: "We help you pick the right head, flow and motor for your bore so you don't overspend." },
  { icon: "tool", title: "Warranty & service", text: "Local support and genuine spare parts when you need them." },
  { icon: "check", title: "Dealer & bulk pricing", text: "Competitive rates for contractors, resellers and project orders." },
];

export default function About() {
  return (
    <>
      <PageBanner title="About Us" crumbs={[{ name: "About Us", href: "/about-us" }]} />
      <section className="section container about-split">
        <div className="about-media">
          <img src="/Content/upload/2018348866/201809211027257969804.jpg" alt="Jiadi factory" />
          <div className="about-badge"><strong>1988</strong><span>Jiadi founded</span></div>
        </div>
        <div className="about-text">
          <span className="kicker">Who We Are</span>
          <h2>Authorised Jiadi Dealer in Pakistan</h2>
          <p><strong>{SITE.name}</strong> is the authorised dealer of Jiadi submersible pumps in Pakistan. We import genuine water submersible pumps directly from China and supply them across Pakistan from our base on City Saddar Road, Rawalpindi.</p>
          <p>Jiadi has manufactured submersible pumps and motors since 1988. Through {SITE.name}, Pakistani homes, farms, housing societies and industries get the same factory-original pumps — with local stock, local pricing and local support.</p>
          <Link href="/products" className="btn btn-blue">View Products</Link>
        </div>
      </section>
      <section className="section bg-light">
        <div className="container">
          <div className="section-head"><span className="kicker">Why Choose Us</span><h2>Why Choose {SITE.name}</h2></div>
          <div className="why-grid">
            {WHY.map((w) => (
              <div key={w.title} className="why-card">
                <Icon name={w.icon} size={36} className="feature-icon" />
                <h3>{w.title}</h3>
                <p>{w.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section container narrow center">
        <span className="kicker">Our Promise</span>
        <h2 className="h2">Reliable water, every day.</h2>
        <p className="lead">Whether it&apos;s a household tube well in Rawalpindi or a solar irrigation system in the field, we stand behind every pump we sell.</p>
      </section>
    </>
  );
}
