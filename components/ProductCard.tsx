import Link from "next/link";
import { Product, productImage } from "@/lib/site";
import { Icon } from "./Icon";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={"/" + p.slug} className="pcard">
      <div className="pcard-img"><img src={productImage(p)} alt={p.name} loading="lazy" /></div>
      <div className="pcard-body">
        <h3>{p.name}</h3>
        <span className="pcard-link">View details <Icon name="arrow" size={16} /></span>
      </div>
    </Link>
  );
}
