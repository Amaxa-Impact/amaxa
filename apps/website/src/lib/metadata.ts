import type { Metadata } from "next";

interface PageData {
  headerTitle: string;
  solutionSubtitle: string;
  imageSrc: string;
}

export function createMetadata(pageData: PageData, id: string): Metadata {
  const { headerTitle, solutionSubtitle } = pageData;

  return {
    title: headerTitle,
    description: solutionSubtitle,
    openGraph: {
      title: headerTitle,
      description: solutionSubtitle,
      type: "website",
      images: [
        {
          url: `/project/${id}/opengraph-image`, // Points to the OG image route below
          alt: headerTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: headerTitle,
      description: solutionSubtitle,
      images: [`/project/${id}/opengraph-image`],
    },
  };
}
