import type { MetadataRoute } from "next";

import { LEGAL_SLUGS, UPDATED } from "@/lib/legal";

const sitemap = (): MetadataRoute.Sitemap => [
  { url: "https://irmahs.dev" },
  ...LEGAL_SLUGS.map((slug) => ({
    lastModified: UPDATED,
    url: `https://irmahs.dev/${slug}`,
  })),
];

export default sitemap;
