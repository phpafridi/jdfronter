import Link from "next/link";

export default function PageBanner({ title, crumbs = [] }: { title: string; crumbs?: { name: string; href: string }[] }) {
  return (
    <section className="page-banner">
      <div className="container">
        <h1>{title}</h1>
        <nav aria-label="Breadcrumb" className="crumbs">
          <Link href="/">Home</Link>
          {crumbs.map((c) => (
            <span key={c.href}> / <Link href={c.href}>{c.name}</Link></span>
          ))}
        </nav>
      </div>
    </section>
  );
}
