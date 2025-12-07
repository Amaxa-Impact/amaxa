// lib/sanity.ts
// Bridge file so existing imports keep working while using the official
// next-sanity toolkit.
export {
  sanityClient,
  sanityFetch,
} from "@/sanity/client";
export { urlFor } from "@/sanity/image";
