import catalog from "@/content/catalog.json";

import { SITE } from "./config";
export { SITE };

export type Category = { slug: string; name: string; parent: string | null; products: string[]; children: Category[] };
export type Product = { slug: string; name: string; images: string[]; summary: string; html: string; categories: string[] };

export const categories = catalog.categories as Category[];
export const products = catalog.products as Record<string, Product>;
export const certificates = catalog.certificates as { src: string; label: string }[];

const flat: Record<string, Category> = {};
(function walk(list: Category[]) { for (const c of list) { flat[c.slug] = c; walk(c.children); } })(categories);
export const categoryBySlug = flat;

export const allProducts = Object.values(products);
export const productImage = (p: Product) => p.images[0] ?? "/placeholder-pump.svg";

export function categoryProducts(slug: string): Product[] {
  return (flat[slug]?.products ?? []).map((s) => products[s]).filter(Boolean);
}

export function crumbsFor(slug: string): { name: string; href: string }[] {
  const out: { name: string; href: string }[] = [];
  let c: Category | undefined = flat[slug];
  while (c) { out.unshift({ name: c.name, href: "/" + c.slug }); c = c.parent ? flat[c.parent] : undefined; }
  return out;
}

export function pageMeta(name: string, extra?: string) {
  return {
    title: `${name} | ${SITE.name} — ${SITE.tagline}`,
    description: extra ?? `${name} — genuine Jiadi pump imported from China by ${SITE.name}, authorised dealer in Pakistan. ${SITE.address}. Call ${SITE.phone}.`,
    keywords: [name, `${name} Pakistan`, `${name} price in Pakistan`, ...SITE.keywords],
  };
}

export const FEATURED = [
  "4-submersible-pump/4-ss-submersible-pump",
  "6-submersible-pump",
  "submersible-solar-pump",
  "sewage-submersible-pump",
  "2-submersible-pump",
  "3-5-submersible-pump",
  "submersible-screw-pump",
  "submersible-drainage-pump",
];
