/** @type {import('next').NextConfig} */
const removed = ["/news/:path*", "/info/:path*", "/newslist-:n", "/inquiry", "/info"];
const aboutSubpages = ["/our-product", "/our-service", "/our-company"];
export default {
  async redirects() {
    return [
      { source: "/sitemap", destination: "/sitemap.xml", permanent: true },
      { source: "/certificates", destination: "/production-equipment", permanent: true },
      ...aboutSubpages.map((source) => ({ source, destination: "/about-us", permanent: true })),
      ...removed.map((source) => ({ source, destination: "/", permanent: true })),
      { source: "/productlist-:n", destination: "/products", permanent: true },
      { source: "/:path*/page-:n(\\d+)", destination: "/:path*", permanent: true },
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:path*/index.html", destination: "/:path*", permanent: true },
      { source: "/:path*.html", destination: "/:path*", permanent: true },
    ];
  },
};
