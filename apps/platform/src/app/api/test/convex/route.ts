import { NextResponse } from "next/server";
import { env } from "@/env";
import { type } from "arktype";
import { fetchMutation, fetchQuery } from "convex/nextjs";

const inputSchema = type({
  type: "'mutation' | 'query'",
  functionName: "string",
  args: "object",
});

export async function POST(request: Request) {
  if (env.NODE_ENV !== "test" && env.E2E_TESTS_ENABLED !== "true") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const body: unknown = await request.json();
  const data = inputSchema(body);

  if (data instanceof type.errors) {
    return NextResponse.json({ error: data.summary }, { status: 400 });
  }

  const { type: requestType, functionName, args } = data;

  try {
    if (requestType === "mutation") {
      const result = await fetchMutation(
        functionName as unknown as Parameters<typeof fetchMutation>[0],
        args as Parameters<typeof fetchMutation>[1],
      );
      return NextResponse.json(result ?? null);
    }

    const result = await fetchQuery(
      functionName as unknown as Parameters<typeof fetchQuery>[0],
      args as Parameters<typeof fetchQuery>[1],
    );
    return NextResponse.json(result ?? null);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unexpected error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
