import { listUsers } from "@/lib/workos";

export async function GET() {
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
