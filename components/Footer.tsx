import Link from "next/link";
import { SITE, categories } from "@/lib/site";
import { Icon } from "./Icon";

export default function Footer() {
  return (
    <>
      <section className="cta-band">
        <div className="container cta-in">
          <div>
            <h2>Need help choosing a pump?</h2>
            <p>Call our experts for free pump sizing for your bore.</p>
          </div>
          <a href={`tel:${SITE.phoneTel}`} className="btn btn-orange btn-lg"><Icon name="phone" size={22} /> {SITE.phone}</a>
        </div>
      </section>
      <footer className="footer">
        <div className="container footer-grid">
          <div>
            <div className="footer-brand">JD FRONTIER</div>
            <p>{SITE.tagline}, importing genuine water submersible pumps from China to Pakistan.</p>
          </div>
          <div>
            <h3>Quick Links</h3>
            <ul>
              <li><Link href="/about-us">About Us</Link></li>
              <li><Link href="/products">Products</Link></li>
              <li><Link href="/production-equipment">Certificates</Link></li>
              <li><Link href="/contact-us">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3>Popular Pumps</h3>
            <ul>
              {categories.slice(0, 7).map((c) => <li key={c.slug}><Link href={"/" + c.slug}>{c.name}</Link></li>)}
            </ul>
          </div>
          <div>
            <h3>Contact</h3>
            <ul className="footer-contact">
              <li><Icon name="pin" size={18} /> {SITE.address}</li>
              <li><Icon name="phone" size={18} /> <a href={`tel:${SITE.phoneTel}`}>{SITE.phone}</a></li>
              <li><Icon name="clock" size={18} /> {SITE.hours}</li>
            </ul>
          </div>
        </div>
        <div className="container footer-bottom">© {new Date().getFullYear()} {SITE.name}. All rights reserved.</div>
      </footer>
      <a href={`tel:${SITE.phoneTel}`} className="mobile-call" aria-label={`Call ${SITE.phone}`}>
        <Icon name="phone" size={20} /> Call {SITE.phone}
      </a>
    </>
  );
}
