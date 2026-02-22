import { beforeEach, describe, expect, it, vi } from "vitest";

const { fetchQueryMock, verifySessionMock } = vi.hoisted(() => ({
  verifySessionMock: vi.fn(),
  fetchQueryMock: vi.fn(),
}));

vi.mock("@/lib/auth/dal", () => ({
  verifySession: verifySessionMock,
}));

vi.mock("convex/nextjs", () => ({
  fetchQuery: fetchQueryMock,
}));

vi.mock("@amaxa/backend/_generated/api", () => ({
  api: {
    users: {
      listAll: "users/listAll",
    },
  },
}));

import { GET } from "./route";

describe("GET /api/users", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    verifySessionMock.mockResolvedValue({ accessToken: "session-token" });
  });

  it("returns user options for an authenticated session", async () => {
    const users = [
      {
        id: "user-1",
        email: "user1@example.com",
        firstName: "User",
        lastName: "One",
      },
    ];
    fetchQueryMock.mockResolvedValue(users);

    const response = await GET();
    const body = (await response.json()) as unknown;

    expect(response.status).toBe(200);
    expect(body).toEqual(users);
    expect(fetchQueryMock).toHaveBeenCalledWith(
      "users/listAll",
      {},
      { token: "session-token" },
    );
  });

  it("returns a 500 with the upstream error message", async () => {
    fetchQueryMock.mockRejectedValue(new Error("Convex unavailable"));

    const response = await GET();
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(500);
    expect(body).toEqual({ error: "Convex unavailable" });
  });
});
