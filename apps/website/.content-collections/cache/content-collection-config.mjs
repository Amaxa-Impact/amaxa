// content-collections.ts
import {
  defineCollection,
  defineConfig
} from "@content-collections/core";
var posts = defineCollection({
  name: "posts",
  directory: "content/posts",
  include: "*.mdx",
  schema: (z) => ({
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
    draft: z.boolean().optional().default(false)
  }),
  parser: "frontmatter",
  transform: ({ content: _, ...post }) => {
    return post;
  }
});
var content_collections_default = defineConfig({
  collections: [posts]
});
export {
  content_collections_default as default
};
