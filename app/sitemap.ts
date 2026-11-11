import type { MetadataRoute } from "next";
import { SITE, categoryBySlug, products } from "@/lib/site";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about-us", "/products", "/production-equipment", "/contact-us"];
  return [
    ...pages.map((p) => ({ url: SITE.url + p, priority: p === "" ? 1 : 0.8 })),
    ...Object.keys(categoryBySlug).map((s) => ({ url: `${SITE.url}/${s}`, priority: 0.7 })),
    ...Object.keys(products).map((s) => ({ url: `${SITE.url}/${s}`, priority: 0.6 })),
  ];
}
