import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.amaxaimpact.org",
      lastModified: new Date(),
    },
    {
      url: "https://www.amaxaimpact.org/program",
      lastModified: new Date(),
    },
    {
      url: "https://www.amaxaimpact.org/who-are-we",
      lastModified: new Date(),
    },
    {
      url: "https://www.amaxaimpact.org/project",
      lastModified: new Date(),
    },
  ];
}
