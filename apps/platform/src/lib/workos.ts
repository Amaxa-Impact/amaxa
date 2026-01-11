import "server-only";

import { env } from "@/env";
import { WorkOS } from "@workos-inc/node";

const workos = new WorkOS(env.WORKOS_API_KEY);

export async function listUsers() {
  const users = await workos.userManagement.listUsers();

  return users.data;
}
export type User = Awaited<ReturnType<typeof listUsers>>;
