// Centralized Sanity environment access so we can align with the official
// next-sanity client configuration.
export const projectId =
  process.env.NEXT_PUBLIC_SANITY_PROJECT_ID ?? "w4q41arm";

export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET ?? "production";

export const apiVersion =
  process.env.NEXT_PUBLIC_SANITY_API_VERSION ?? "2025-03-04";

// fetches where CDN caching is preferred.
export const useCdn =
  process.env.NEXT_PUBLIC_SANITY_USE_CDN === "true" ? true : false;
