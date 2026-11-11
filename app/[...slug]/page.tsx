import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import PageBanner from "@/components/PageBanner";
import CategorySidebar from "@/components/CategorySidebar";
import ProductCard from "@/components/ProductCard";
import Gallery from "@/components/Gallery";
import { Icon } from "@/components/Icon";
import { SITE, allProducts, categoryBySlug, categoryProducts, crumbsFor, pageMeta, productImage, products } from "@/lib/site";

type Props = { params: Promise<{ slug: string[] }> };
export const dynamicParams = false;

export function generateStaticParams() {
  return [...Object.keys(categoryBySlug), ...Object.keys(products)].map((s) => ({ slug: s.split("/") }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const slug = (await params).slug.join("/");
  const c = categoryBySlug[slug];
  const p = products[slug];
  const name = c?.name ?? p?.name;
  if (!name) return {};
  const m = pageMeta(name);
  return {
    ...m,
    alternates: { canonical: "/" + slug },
    openGraph: { title: m.title, description: m.description, url: "/" + slug, images: p ? [productImage(p)] : undefined },
  };
}

export default async function Page({ params }: Props) {
  const slug = (await params).slug.join("/");
  const cat = categoryBySlug[slug];
  if (cat) {
    const list = categoryProducts(slug);
    return (
      <>
        <PageBanner title={cat.name} crumbs={[{ name: "Products", href: "/products" }, ...crumbsFor(slug)]} />
        <div className="container section with-sidebar">
          <CategorySidebar active={slug} />
          <div>
            {cat.children.length > 0 && (
              <div className="chips">
                {cat.children.map((ch) => <Link key={ch.slug} href={"/" + ch.slug} className="chip">{ch.name}</Link>)}
              </div>
            )}
            <p className="lead">{list.length} genuine Jiadi {cat.name.toLowerCase()} models available in Pakistan from {SITE.name}.</p>
            <div className="product-grid product-grid-3">
              {list.map((p) => <ProductCard key={p.slug} p={p} />)}
            </div>
          </div>
        </div>
      </>
    );
  }

  const p = products[slug];
  if (!p) notFound();
  const catSlug = p.categories[0];
  const related = (catSlug ? categoryProducts(catSlug) : allProducts).filter((x) => x.slug !== p.slug).slice(0, 4);
  const productLd = {
    "@context": "https://schema.org", "@type": "Product", name: p.name, image: p.images.map((i) => SITE.url + i),
    description: p.summary, brand: { "@type": "Brand", name: "Jiadi" },
    offers: { "@type": "Offer", availability: "https://schema.org/InStock", priceCurrency: "PKR", seller: { "@type": "Organization", name: SITE.name } },
  };

  return (
    <>
      <PageBanner title={p.name} crumbs={[{ name: "Products", href: "/products" }, ...(catSlug ? crumbsFor(catSlug) : [])]} />
      <div className="container section">
        <div className="product-top">
          <Gallery images={p.images} alt={p.name} />
          <div className="product-info">
            <span className="kicker">Genuine Jiadi Pump</span>
            <h2>{p.name}</h2>
            <p>{p.summary}</p>
            <ul className="checklist">
              <li><Icon name="check" size={18} /> Imported directly from China</li>
              <li><Icon name="check" size={18} /> Local warranty &amp; service in Pakistan</li>
              <li><Icon name="check" size={18} /> Free pump sizing advice</li>
            </ul>
            <div className="product-btns">
              <a href={`tel:${SITE.phoneTel}`} className="btn btn-orange"><Icon name="phone" size={18} /> Call {SITE.phone}</a>
              <Link href="/contact-us" className="btn btn-blue">Get a Quote</Link>
            </div>
          </div>
        </div>

        <div className="product-details">
          <h2 className="tab-title">Product Details</h2>
          <div className="prose" dangerouslySetInnerHTML={{ __html: p.html }} />
        </div>

        {related.length > 0 && (
          <div className="related">
            <h2 className="tab-title">Related Products</h2>
            <div className="product-grid">{related.map((r) => <ProductCard key={r.slug} p={r} />)}</div>
          </div>
        )}
      </div>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(productLd) }} />
    </>
  );
}
