import Link from "next/link";
import PageBanner from "@/components/PageBanner";
import CategorySidebar from "@/components/CategorySidebar";
import { Icon } from "@/components/Icon";
import { categories, categoryProducts, pageMeta, productImage } from "@/lib/site";

export const metadata = {
  ...pageMeta("Products", "All genuine Jiadi water submersible pumps available in Pakistan from JD Frontier: 2\" to 6\" deep well, solar, sewage, drainage and screw pumps."),
  alternates: { canonical: "/products" },
};

export default function Products() {
  return (
    <>
      <PageBanner title="Our Products" crumbs={[{ name: "Products", href: "/products" }]} />
      <div className="container section with-sidebar">
        <CategorySidebar />
        <div>
          <p className="lead">Browse our full range of genuine Jiadi submersible pumps. Every pump is imported directly from the factory and supported locally in Pakistan.</p>
          <div className="cat-grid cat-grid-3">
            {categories.map((c) => {
              const first = categoryProducts(c.slug)[0];
              return (
                <Link key={c.slug} href={"/" + c.slug} className="cat-card">
                  <div className="cat-img"><img src={first ? productImage(first) : "/placeholder-pump.svg"} alt={c.name} loading="lazy" /></div>
                  <div className="cat-body"><h3>{c.name}</h3><span>{c.products.length} products <Icon name="arrow" size={16} /></span></div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
}
