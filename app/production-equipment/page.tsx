import PageBanner from "@/components/PageBanner";
import { certificates, pageMeta } from "@/lib/site";

export const metadata = {
  ...pageMeta("Certificates", "Jiadi submersible pumps sold by JD Frontier in Pakistan meet ISO 9001, CE, GS, RoHS and other international quality standards."),
  alternates: { canonical: "/production-equipment" },
};

export default function Certificates() {
  return (
    <>
      <PageBanner title="Certificates" crumbs={[{ name: "Certificates", href: "/production-equipment" }]} />
      <section className="section container">
        <div className="section-head">
          <span className="kicker">Certified Quality</span>
          <h2>Our Certificates</h2>
          <p className="lead">Every pump we supply meets international quality requirements including ISO 9001, CE, GS, SON and RoHS, backed by Jiadi&apos;s strict quality control system.</p>
        </div>
        <div className="cert-grid">
          {certificates.map((c) => (
            <a key={c.src} href={c.src} target="_blank" rel="noopener" className="cert-card">
              <img src={c.src} alt={`${c.label} certificate`} loading="lazy" />
              <span>{c.label}</span>
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
