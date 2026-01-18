import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";
import { getWorkOS, saveSession, signOut } from "@workos-inc/authkit-nextjs";
import { type as defineType, type } from "arktype";

const inputSchema = defineType({
  action: "string?",
  email: "string?",
  password: "string?",
});

export async function POST(request: NextRequest) {
  if (env.NODE_ENV !== "test" && env.E2E_TESTS_ENABLED !== "true") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const body: unknown = await request.json();
  const data = inputSchema(body);

  if (data instanceof type.errors) {
    return NextResponse.json({ error: data.summary }, { status: 400 });
  }

  const { action, email, password } = data;

  if (action === "signOut") {
    await signOut();
    return NextResponse.json({ success: true });
  }

  if (!email || !password) {
    return NextResponse.json({ error: "Missing credentials" }, { status: 400 });
  }

  const authResponse =
    await getWorkOS().userManagement.authenticateWithPassword({
      email,
      password,
      clientId: env.WORKOS_CLIENT_ID,
    });

  await saveSession(authResponse, request);

  return NextResponse.json({ success: true, userId: authResponse.user.id });
}
