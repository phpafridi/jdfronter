import type { ReactNode } from "react";
import type { Metadata, Viewport } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { SITE, categories } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(SITE.url),
  title: `${SITE.name} | ${SITE.tagline} — Water Submersible Pumps`,
  description: `${SITE.name} is the authorised Jiadi dealer in Pakistan, importing genuine water submersible pumps from China. ${SITE.address}. Call ${SITE.phone}.`,
  keywords: SITE.keywords,
  applicationName: SITE.name,
  icons: { icon: "/uploads/16806/favicon.png" },
  openGraph: { siteName: SITE.name, locale: "en_PK", type: "website" },
  verification: { google: ["UvW98CTME1sd2-WzNMBU7n3OmiJhoBl-XEvPzeTqbgc", "tuT7COCXuKv8_1X7q9NVqTFVg-lCOx0VYhMbtQBKX5I"] },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#0A4A8F" };

const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: SITE.name,
  description: "Authorised Jiadi dealer in Pakistan, importing water submersible pumps from China.",
  url: SITE.url,
  telephone: "+92-51-5553023",
  address: { "@type": "PostalAddress", streetAddress: "City Saddar Road", addressLocality: "Rawalpindi", addressCountry: "PK" },
  geo: { "@type": "GeoCoordinates", latitude: 33.6097106, longitude: 73.0521117 },
  areaServed: "Pakistan",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-PK">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600&family=Barlow+Condensed:wght@600;700&display=swap" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS) }} />
      </head>
      <body>
        <Header categories={categories.map((c) => ({ slug: c.slug, name: c.name }))} />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
