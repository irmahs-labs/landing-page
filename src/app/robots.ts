import type { MetadataRoute } from "next";

// Every page is public and may be read by search engines and AI agents
// alike; /api is the page's own plumbing.
const robots = (): MetadataRoute.Robots => ({
  rules: { allow: "/", disallow: "/api/", userAgent: "*" },
  sitemap: "https://irmahs.dev/sitemap.xml",
});

export default robots;
