import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.amaxaimpact.org",
      lastModified: new Date(),
    },
    {
      url: "https://www.amaxaimpact.org/about-us",
      lastModified: new Date(),
    },
    {
      url: "https://www.amaxaimpact.org/platform",
      lastModified: new Date(),
    },
    {
      url: "https://www.amaxaimpact.org/blog",
      lastModified: new Date(),
    },
    {
      url: "https://www.amaxaimpact.org/apply",
      lastModified: new Date(),
    },
  ];
}
