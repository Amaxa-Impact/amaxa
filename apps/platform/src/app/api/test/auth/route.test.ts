import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  authenticateWithPasswordMock,
  envMock,
  getWorkOSMock,
  saveSessionMock,
  signJWTSignMock,
  signOutMock,
} = vi.hoisted(() => {
  const authenticateWithPasswordMock = vi.fn();
  const signJWTSignMock = vi.fn().mockResolvedValue("signed-test-token");

  return {
    authenticateWithPasswordMock,
    getWorkOSMock: vi.fn(() => ({
      userManagement: {
        authenticateWithPassword: authenticateWithPasswordMock,
      },
    })),
    saveSessionMock: vi.fn(),
    signOutMock: vi.fn(),
    signJWTSignMock,
    envMock: {
      NODE_ENV: "test" as "development" | "production" | "test",
      E2E_TESTS_ENABLED: "true" as string | undefined,
      WORKOS_CLIENT_ID: "client_123",
      WORKOS_COOKIE_PASSWORD: "cookie_password_for_tests",
    },
  };
});

vi.mock("@/env", () => ({
  env: envMock,
}));

vi.mock("@workos-inc/authkit-nextjs", () => ({
  getWorkOS: getWorkOSMock,
  saveSession: saveSessionMock,
  signOut: signOutMock,
}));

vi.mock("jose", () => ({
  SignJWT: class {
    setProtectedHeader() {
      return this;
    }

    setSubject() {
      return this;
    }

    setIssuer() {
      return this;
    }

    setIssuedAt() {
      return this;
    }

    setExpirationTime() {
      return this;
    }

    sign() {
      return signJWTSignMock();
    }
  },
}));

import { POST } from "./route";

describe("POST /api/test/auth", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    envMock.NODE_ENV = "test";
    envMock.E2E_TESTS_ENABLED = "true";
    envMock.WORKOS_CLIENT_ID = "client_123";
    envMock.WORKOS_COOKIE_PASSWORD = "cookie_password_for_tests";
    signOutMock.mockResolvedValue(undefined);
    saveSessionMock.mockResolvedValue(undefined);
    signJWTSignMock.mockResolvedValue("signed-test-token");
    authenticateWithPasswordMock.mockResolvedValue({
      accessToken: "access-token",
      refreshToken: "refresh-token",
      user: { id: "workos-user-1" },
    });
  });

  const createRequest = (body: unknown) =>
    new Request("http://localhost/api/test/auth", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify(body),
    });

  it("returns 404 in production unless E2E tests are enabled", async () => {
    envMock.NODE_ENV = "production";
    envMock.E2E_TESTS_ENABLED = undefined;

    const response = await POST(createRequest({}) as unknown as never);
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(404);
    expect(body).toEqual({ error: "Not available" });
  });

  it("returns 400 for invalid payloads", async () => {
    const response = await POST(
      createRequest({
        action: 123,
      }) as unknown as never,
    );
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(typeof body.error).toBe("string");
  });

  it("signs out the current session", async () => {
    const response = await POST(
      createRequest({
        action: "signOut",
      }) as unknown as never,
    );
    const body = (await response.json()) as { success: boolean };

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true });
    expect(signOutMock).toHaveBeenCalledTimes(1);
  });

  it("creates a test session when credentials are omitted", async () => {
    const response = await POST(
      createRequest({
        role: "coach",
      }) as unknown as never,
    );
    const body = (await response.json()) as { success: boolean; userId: string };

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, userId: "e2e-coach" });
    expect(saveSessionMock).toHaveBeenCalledTimes(1);
    expect(signJWTSignMock).toHaveBeenCalledTimes(1);
    expect(saveSessionMock.mock.calls[0]?.[0]).toEqual(
      expect.objectContaining({
        user: expect.objectContaining({
          id: "e2e-coach",
          email: "e2e-coach@example.com",
        }),
      }),
    );
  });

  it("authenticates with WorkOS when credentials are provided", async () => {
    const authResponse = {
      accessToken: "workos-access",
      refreshToken: "workos-refresh",
      user: { id: "workos-user-7" },
    };
    authenticateWithPasswordMock.mockResolvedValue(authResponse);

    const response = await POST(
      createRequest({
        email: "coach@example.com",
        password: "password123",
      }) as unknown as never,
    );
    const body = (await response.json()) as { success: boolean; userId: string };

    expect(response.status).toBe(200);
    expect(body).toEqual({ success: true, userId: "workos-user-7" });
    expect(authenticateWithPasswordMock).toHaveBeenCalledWith({
      email: "coach@example.com",
      password: "password123",
      clientId: "client_123",
    });
    expect(saveSessionMock).toHaveBeenCalledWith(
      authResponse,
      expect.any(Request),
    );
  });
});
