import PageBanner from "@/components/PageBanner";
import { Icon } from "@/components/Icon";
import { SITE, pageMeta } from "@/lib/site";

export const metadata = {
  ...pageMeta("Contact Us", `Contact ${SITE.name}, authorised Jiadi dealer in Pakistan. ${SITE.address}. Call ${SITE.phone}.`),
  alternates: { canonical: "/contact-us" },
};

export default function Contact() {
  return (
    <>
      <PageBanner title="Contact Us" crumbs={[{ name: "Contact Us", href: "/contact-us" }]} />
      <section className="section container contact-grid">
        <div className="contact-cards">
          <span className="kicker">Get in Touch</span>
          <h2>Visit or Call {SITE.name}</h2>
          <p className="lead">Talk to us about the right pump for your bore, prices and availability.</p>
          <a href={`tel:${SITE.phoneTel}`} className="contact-card">
            <Icon name="phone" size={28} /><div><strong>Phone</strong><span>{SITE.phone}</span></div>
          </a>
          <div className="contact-card">
            <Icon name="pin" size={28} /><div><strong>Address</strong><span>{SITE.name}, {SITE.address}</span></div>
          </div>
          <div className="contact-card">
            <Icon name="clock" size={28} /><div><strong>Opening Hours</strong><span>{SITE.hours}</span></div>
          </div>
        </div>
        <div className="map-box">
          <iframe src={SITE.mapEmbed} title="JD Frontier location on Google Maps" loading="lazy" allowFullScreen referrerPolicy="strict-origin-when-cross-origin" />
        </div>
      </section>
    </>
  );
}
