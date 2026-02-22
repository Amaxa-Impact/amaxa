import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { env } from "@/env";
import { getWorkOS, saveSession, signOut } from "@workos-inc/authkit-nextjs";
import { type as defineType, type } from "arktype";
import { SignJWT } from "jose";

const inputSchema = defineType({
  action: "string?",
  email: "string?",
  password: "string?",
  role: "'admin' | 'coach'?",
});

export async function POST(request: NextRequest) {
  if (env.NODE_ENV === "production" && env.E2E_TESTS_ENABLED !== "true") {
    return NextResponse.json({ error: "Not available" }, { status: 404 });
  }

  const body: unknown = await request.json();
  const data = inputSchema(body);

  if (data instanceof type.errors) {
    return NextResponse.json({ error: data.summary }, { status: 400 });
  }

  const { action, email, password, role } = data;

  if (action === "signOut") {
    await signOut();
    return NextResponse.json({ success: true });
  }

  if (!email || !password) {
    if (env.NODE_ENV === "production") {
      return NextResponse.json(
        { error: "Missing credentials" },
        { status: 400 },
      );
    }

    const testUser = await createTestSession(request, role ?? "admin");
    return NextResponse.json({ success: true, userId: testUser.id });
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

type TestRole = "admin" | "coach";

const testUsers: Record<
  TestRole,
  { id: string; email: string; firstName: string }
> = {
  admin: {
    id: "e2e-admin",
    email: "e2e-admin@example.com",
    firstName: "E2E Admin",
  },
  coach: {
    id: "e2e-coach",
    email: "e2e-coach@example.com",
    firstName: "E2E Coach",
  },
};

async function createTestSession(request: NextRequest, role: TestRole) {
  const testUser = testUsers[role];

  if (!env.WORKOS_COOKIE_PASSWORD) {
    throw new Error("WORKOS_COOKIE_PASSWORD is required for test auth");
  }

  const secret = new TextEncoder().encode(env.WORKOS_COOKIE_PASSWORD);
  const accessToken = await new SignJWT({
    sid: `session-${role}`,
    org_id: "org-e2e",
    role: "member",
    roles: ["member"],
    permissions: [],
    entitlements: [],
    feature_flags: [],
    email: testUser.email,
  })
    .setProtectedHeader({ alg: "HS256" })
    .setSubject(testUser.id)
    .setIssuer("urn:e2e:auth")
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(secret);

  const now = new Date().toISOString();
  await saveSession(
    {
      accessToken,
      refreshToken: "e2e-refresh-token",
      user: {
        id: testUser.id,
        email: testUser.email,
        emailVerified: true,
        profilePictureUrl: null,
        firstName: testUser.firstName,
        lastName: "User",
        object: "user",
        createdAt: now,
        updatedAt: now,
        lastSignInAt: now,
        externalId: null,
        metadata: {},
        locale: null,
      },
    },
    request,
  );

  return testUser;
}
