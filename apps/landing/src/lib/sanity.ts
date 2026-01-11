import type { QueryParams } from "@sanity/client";
import type { SanityImageSource } from "@sanity/image-url";
import { createClient } from "@sanity/client";
import { createImageUrlBuilder } from "@sanity/image-url";

import { sanityConfig } from "./env";

export const sanityClient = createClient({
  projectId: sanityConfig.projectId,
  dataset: sanityConfig.dataset,
  apiVersion: sanityConfig.apiVersion,
});

interface FetchArgs<QueryString extends string> {
  query: QueryString;
  params?: QueryParams;
  revalidate?: number | false;
  tags?: string[];
}

export async function sanityFetch<
  QueryResult = unknown,
  const QueryString extends string = string,
>({ query, params = {} }: FetchArgs<QueryString>): Promise<QueryResult> {
  return sanityClient.fetch<QueryResult>(query, params, {});
}

const builder = createImageUrlBuilder(sanityClient);

export const urlFor = (source: SanityImageSource) => builder.image(source);
