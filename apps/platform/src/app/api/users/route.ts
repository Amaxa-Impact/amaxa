import { WorkOS } from "@workos-inc/node";

export async function GET() {
  const workos = new WorkOS(process.env.WORKOS_API_KEY);
  const users = await workos.userManagement.listUsers();

  return new Response(JSON.stringify(users.data), { status: 200 });
}
