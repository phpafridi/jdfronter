import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { allSlugs, getPage } from "@/lib/pages";
import LegacyScripts from "@/components/LegacyScripts";
import HeroSlider from "@/components/HeroSlider";

type Props = { params: Promise<{ slug?: string[] }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return allSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getPage((await params).slug);
  if (!page) return {};
  return {
    title: page.title,
    description: page.description,
    keywords: page.keywords,
    alternates: { canonical: page.route },
    openGraph: { siteName: "JD Frontier", locale: "en_PK", type: "website", url: page.route, title: page.title, description: page.description, images: ["/uploads/201816806/logo348866.jpg"] },
  };
}

const GLOBAL_CSS = new Set([
  "https://css01.v15cdn.com/animate.css",
  "https://css02.v15cdn.com/m187/green/style.css",
]);

export default async function Page({ params }: Props) {
  const page = getPage((await params).slug);
  if (!page) notFound();
  return (
    <>
      {page.styles.filter((h) => !GLOBAL_CSS.has(h)).map((href) => (
        <link key={href} rel="stylesheet" href={href} precedence="default" />
      ))}
      {page.inlineStyles.map((css, i) => (
        <style key={i} dangerouslySetInnerHTML={{ __html: css }} />
      ))}
      {page.html.includes("@@HERO@@") ? (() => {
        const [before, after] = page.html.split("@@HERO@@");
        return (<>
          <div dangerouslySetInnerHTML={{ __html: before }} />
          <HeroSlider />
          <div dangerouslySetInnerHTML={{ __html: after }} />
        </>);
      })() : <div id="page-root" dangerouslySetInnerHTML={{ __html: page.html }} />}
      <LegacyScripts scripts={page.scripts} />
    </>
  );
}
