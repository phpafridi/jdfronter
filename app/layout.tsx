import type { ReactNode } from "react";
import type { Metadata } from "next";
import "./jdf.css";

// TODO: set to your real domain
export const metadata: Metadata = {
  metadataBase: new URL("https://www.jdfrontier.com"),
  title: "JD Frontier | Authorised Jiadi Dealer in Pakistan",
  description: "JD Frontier is the authorised Jiadi dealer in Pakistan, importing genuine water submersible pumps from China. City Saddar Road, Rawalpindi. Call 051-5553023.",
  applicationName: "JD Frontier",
};

const LOCAL_BUSINESS = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "JD Frontier",
  description: "Authorised Jiadi dealer in Pakistan, importing water submersible pumps from China.",
  telephone: "+92-51-5553023",
  address: { "@type": "PostalAddress", streetAddress: "City Saddar Road", addressLocality: "Rawalpindi", addressCountry: "PK" },
  geo: { "@type": "GeoCoordinates", latitude: 33.6097106, longitude: 73.0521117 },
  areaServed: "Pakistan",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en-PK">
      <head>
        <meta name="format-detection" content="telephone=no" />
        <link rel="icon" href="/uploads/16806/favicon.png" />
        <link rel="stylesheet" href="https://css01.v15cdn.com/animate.css" />
        <link rel="stylesheet" href="https://css02.v15cdn.com/m187/green/style.css" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(LOCAL_BUSINESS) }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
