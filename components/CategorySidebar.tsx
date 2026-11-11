import Link from "next/link";
import { categories, SITE } from "@/lib/site";
import { Icon } from "./Icon";

export default function CategorySidebar({ active }: { active?: string }) {
  return (
    <aside className="sidebar">
      <details className="side-box side-cats" open>
        <summary>Product Categories</summary>
        <ul>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link href={"/" + c.slug} className={active?.startsWith(c.slug) ? "active" : ""}>{c.name}</Link>
              {c.children.length > 0 && active?.startsWith(c.slug) && (
                <ul>
                  {c.children.map((ch) => (
                    <li key={ch.slug}><Link href={"/" + ch.slug} className={active?.startsWith(ch.slug) ? "active" : ""}>{ch.name}</Link></li>
                  ))}
                </ul>
              )}
            </li>
          ))}
        </ul>
      </details>
      <div className="side-box side-help">
        <h3>Need Help?</h3>
        <p>Not sure which pump fits your bore? Call us for free advice.</p>
        <a href={`tel:${SITE.phoneTel}`} className="btn btn-orange btn-block"><Icon name="phone" size={18} /> {SITE.phone}</a>
      </div>
    </aside>
  );
}
