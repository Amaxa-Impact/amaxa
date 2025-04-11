import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "https://www.amaxaimpact.org",
      lastModified: new Date(),
    },
    {
      url: "https://www.amaxaimpact.org/pathways",
      lastModified: new Date(),
    },
    {
      url: "https://www.amaxaimpact.org/who-we-are",
      lastModified: new Date(),
    },
    {
      url: "https://www.amaxaimpact.org/project",
      lastModified: new Date(),
    },

    {
      url: "https://www.amaxaimpact.org/newsletter",
      lastModified: new Date(),
    },
  ];
}
