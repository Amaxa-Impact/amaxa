import { verifySession } from "@/lib/auth/dal";
import { fetchQuery } from "convex/nextjs";

import { api } from "@amaxa/backend/_generated/api";

interface UserOption {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
}

export async function GET() {
  // Require authentication - any logged in user can access
  const session = await verifySession();

  try {
    const users = (await fetchQuery(
      api.users.listAll,
      {},
      { token: session.accessToken },
    )) as UserOption[];

    return new Response(JSON.stringify(users), { status: 200 });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "Failed to list users",
      }),
      { status: 500 },
    );
  }
}
