import type { QueryParams } from "next-sanity";
import { createClient } from "next-sanity";

import { apiVersion, dataset, projectId, useCdn } from "./env";

export const sanityClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn,
});

interface FetchArgs<QueryString extends string> {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}

// Helper that mirrors the official next-sanity pattern so we can attach
// Next.js caching metadata in a single place.
export async function sanityFetch<
  QueryResult = unknown,
  const QueryString extends string = string,
>({
  query,
  params = {},
  revalidate = 60,
  tags = [],
}: FetchArgs<QueryString>): Promise<QueryResult> {
  return sanityClient.fetch<QueryResult>(query, params, {
    cache: "force-cache",
    next: {
      revalidate: tags.length ? false : revalidate,
      tags,
    },
  });
}
