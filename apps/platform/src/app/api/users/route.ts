import { verifySession } from "@/lib/auth";
import { listUsers } from "@/lib/workos";

export async function GET() {
  // Require authentication - any logged in user can access
  await verifySession();

  const result = await listUsers();

  if (result.status === "ok") {
    return new Response(JSON.stringify(result.value), { status: 200 });
  }

  return new Response(
    JSON.stringify({
      error: result.error.message,
      operation: result.error.operation,
    }),
    { status: 500 },
  );
}
