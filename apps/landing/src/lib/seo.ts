export interface SeoProps {
  title: string;
  description: string;
  image: string;
  type: "website" | "article";
  canonicalURL: string;
  keywords: string[];
  noIndex: boolean;
}
