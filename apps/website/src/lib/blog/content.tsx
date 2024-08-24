// import { Logo } from "#/ui/icons";
import { allBlogPosts } from "content-collections";
import { Settings } from "lucide-react";

export const BLOG_CATEGORIES: {
  title: string;
  slug: "eng" | "company";
  description: string;
}[] = [
  {
    title: "Engineering",
    slug: "eng",
    description: "",
  },
  {
    title: "Company",
    slug: "company",
    description: "",
  },
  // {
  //   title: "Education",
  //   slug: "education",
  //   description: "Educational content about link management.",
  // },
  // {
];

export const POPULAR_ARTICLES = [""];

export const HELP_CATEGORIES: {
  title: string;
  slug: "blog" | "engineering";
  description: string;
  icon: JSX.Element;
}[] = [];

export const getPopularArticles = () => {
  const popularArticles = POPULAR_ARTICLES.map((slug) => {
    const post = allBlogPosts.find((post) => post.slug === slug);
    if (!post) {
      console.warn(`Popular article with slug "${slug}" not found`);
    }
    return post;
  }).filter((post) => post != null);

  return popularArticles;
};
