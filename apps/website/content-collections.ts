import { defineCollection, defineConfig } from "@content-collections/core";
import { z } from "zod";

const posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "*.mdx",
  schema: z.object({
    title: z.string(),
    description: z.string(),
    publishedAt: z.string(),
    author: z.string(),
    authorAvatar: z.string().optional(),
    authorBio: z.string().optional(),
    featuredImage: z.string().optional(),
    ogUrl: z.string().optional(),
    ogType: z.string().optional(),
    ogTitle: z.string().optional(),
    ogDescription: z.string().optional(),
    ogImage: z.string().optional(),
    slug: z.string(),
    tags: z.array(z.string()).optional(),
    category: z.string().optional(),
    draft: z.boolean().optional().default(false),
  }),
  parser: "frontmatter",
  transform: ({ content: _, ...post }) => {
    return post;
  },
});

export default defineConfig({
  collections: [posts],
});
