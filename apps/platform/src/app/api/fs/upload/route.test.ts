import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { withAuthMock, fetchMock } = vi.hoisted(() => ({
  withAuthMock: vi.fn(),
  fetchMock: vi.fn(),
}));

vi.mock("@/env", () => ({
  env: {
    NEXT_PUBLIC_CONVEX_URL: "https://demo-instance.convex.cloud",
  },
}));

vi.mock("@workos-inc/authkit-nextjs", () => ({
  withAuth: withAuthMock,
}));

import { POST } from "./route";

describe("POST /api/fs/upload", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal("fetch", fetchMock);
    withAuthMock.mockResolvedValue({ accessToken: "access-token" });
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns 401 when the user has no access token", async () => {
    withAuthMock.mockResolvedValue({ accessToken: null });

    const request = new Request("http://localhost/api/fs/upload", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "test payload",
    });

    const response = await POST(request as never);
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(401);
    expect(body).toEqual({ error: "Unauthorized" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("proxies uploads to Convex with auth headers", async () => {
    fetchMock.mockResolvedValue(
      new Response(JSON.stringify({ storageId: "storage-123" }), {
        status: 200,
        headers: { "content-type": "application/json" },
      }),
    );

    const request = new Request("http://localhost/api/fs/upload", {
      method: "POST",
      headers: { "content-type": "text/plain" },
      body: "resume-content",
    });

    const response = await POST(request as never);
    const body = (await response.json()) as { storageId: string };

    expect(response.status).toBe(200);
    expect(body).toEqual({ storageId: "storage-123" });
    expect(fetchMock).toHaveBeenCalledWith(
      "https://demo-instance.convex.site/fs/upload",
      expect.objectContaining({
        method: "POST",
        headers: {
          "Content-Type": "text/plain",
          Authorization: "Bearer access-token",
        },
      }),
    );

    const requestInit = fetchMock.mock.calls[0]?.[1] as RequestInit | undefined;
    expect(requestInit?.body).toBeInstanceOf(ArrayBuffer);
  });

  it("returns upstream upload failures with the same status code", async () => {
    fetchMock.mockResolvedValue(new Response("payload too large", { status: 413 }));

    const request = new Request("http://localhost/api/fs/upload", {
      method: "POST",
      body: "x".repeat(256),
    });

    const response = await POST(request as never);
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(413);
    expect(body).toEqual({ error: "Upload failed: payload too large" });
  });
});
