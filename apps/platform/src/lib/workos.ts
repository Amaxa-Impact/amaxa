import "server-only";

import { env } from "@/env";
import { WorkOS } from "@workos-inc/node";
import { Result } from "better-result";

import { WorkOsError } from "./errors";

const workos = new WorkOS(env.WORKOS_API_KEY);

export async function listUsers() {
  return Result.tryPromise({
    try: async () => {
      const users = await workos.userManagement.listUsers();
      return users.data;
    },
    catch: (error) => {
      return new WorkOsError({
        message: `Failed to list users: ${error instanceof Error ? error.message : String(error)}`,
        operation: "listUsers",
        cause: error,
      });
    },
  });
}

export type User =
  Awaited<ReturnType<typeof listUsers>> extends Result<infer T, unknown>
    ? T
    : never;
