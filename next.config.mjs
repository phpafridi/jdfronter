/** @type {import('next').NextConfig} */
const removed = ["/news/:path*", "/info/:path*", "/newslist-:n", "/inquiry", "/info"];
const aboutSubpages = ["/our-product", "/our-service", "/our-company", "/our-product.html", "/our-service.html", "/our-company.html"];
export default {
  // Old .html URLs keep working (SEO / bookmarks)
  async redirects() {
    return [
      ...aboutSubpages.map((source) => ({ source, destination: "/about-us", permanent: true })),
      ...removed.map((source) => ({ source, destination: "/", permanent: true })),
      { source: "/index.html", destination: "/", permanent: true },
      { source: "/:path*/index.html", destination: "/:path*", permanent: true },
      { source: "/:path*.html", destination: "/:path*", permanent: true },
    ];
  },
};
