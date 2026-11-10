import fs from "node:fs";
import path from "node:path";

export type Script = { src?: string; code?: string };
export type PageData = {
  route: string; title: string; description: string; keywords: string;
  styles: string[]; inlineStyles: string[]; scripts: Script[]; html: string;
};

const DIR = path.join(process.cwd(), "content", "pages");

export function fileFor(slug: string[] = []) {
  return slug.length ? slug.join("__") : "index";
}

export function getPage(slug: string[] = []): PageData | null {
  const file = path.join(DIR, fileFor(slug) + ".json");
  if (!file.startsWith(DIR) || !fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, "utf8"));
}

export function allSlugs(): string[][] {
  return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => {
    const n = f.slice(0, -5);
    return n === "index" ? [] : n.split("__");
  });
}
