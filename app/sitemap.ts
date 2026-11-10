import type { MetadataRoute } from "next";
import { allSlugs } from "@/lib/pages";

// TODO: set to your real domain
const BASE = "https://www.jdfrontier.com";
export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return allSlugs().map((s) => ({ url: `${BASE}/${s.join("/")}` }));
}
