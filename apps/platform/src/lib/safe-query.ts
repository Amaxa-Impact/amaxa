/* eslint-disable @typescript-eslint/no-explicit-any */
import type { FunctionReference } from "convex/server";
import { useMemo } from "react";
import { Result } from "better-result";
import { useQuery } from "convex/react";

import { QueryLoading } from "./errors";

type AnyQuery = FunctionReference<"query", any, any, any>;

export function useSafeQuery<Q extends AnyQuery>(
  query: Q,
  args: Q["_args"],
): Result<Q["_returnType"], QueryLoading> {
  const data = useQuery(query, args);

  return useMemo(() => {
    if (data === undefined) {
      return Result.err(new QueryLoading({}));
    }

    return Result.ok(data);
  }, [data]);
}
