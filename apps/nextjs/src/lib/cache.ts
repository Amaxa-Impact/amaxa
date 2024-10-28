import { unstable_cache as next_unstable_cache } from "next/cache";

// next_unstable_cache doesn't handle deduplication, so we wrap it in React's cache
export const next_cache = <Inputs extends unknown[], Output>(
  callback: (...args: Inputs) => Promise<Output>,
  key: string[],
  options?: { revalidate: number | false },
) => next_unstable_cache(callback, key, options);
