import { beforeEach, describe, expect, it, vi } from "vitest";

const { generateTextMock, outputObjectMock, requireSiteAdminMock } =
  vi.hoisted(() => ({
    generateTextMock: vi.fn(),
    outputObjectMock: vi.fn((value: unknown) => value),
    requireSiteAdminMock: vi.fn(),
  }));

vi.mock("@/lib/auth/dal", () => ({
  requireSiteAdmin: requireSiteAdminMock,
}));

vi.mock("@ai-sdk/google", () => ({
  google: vi.fn((modelName: string) => ({ provider: "google", modelName })),
}));

vi.mock("ai", () => ({
  generateText: generateTextMock,
  Output: {
    object: outputObjectMock,
  },
}));

import { POST } from "./route";

describe("POST /api/field-type", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    requireSiteAdminMock.mockResolvedValue(undefined);
    vi.spyOn(console, "error").mockImplementation(() => {});
  });

  it("returns 400 when input payload is invalid", async () => {
    const request = new Request("http://localhost/api/field-type", {
      method: "POST",
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const body = (await response.json()) as { error: string };

    expect(response.status).toBe(400);
    expect(typeof body.error).toBe("string");
    expect(generateTextMock).not.toHaveBeenCalled();
    expect(requireSiteAdminMock).toHaveBeenCalledTimes(1);
  });

  it("returns the generated field type prediction", async () => {
    generateTextMock.mockResolvedValue({
      output: {
        fieldType: "select",
        reasoning: "The question expects one option from a list.",
        suggestedOptions: ["Frontend", "Backend", "Full Stack", "DevOps"],
      },
    });

    const request = new Request("http://localhost/api/field-type", {
      method: "POST",
      body: JSON.stringify({
        input: "What role are you applying for?",
      }),
    });

    const response = await POST(request);
    const body = (await response.json()) as {
      fieldType: string;
      reasoning: string;
      suggestedOptions?: string[];
    };

    expect(response.status).toBe(200);
    expect(body).toEqual({
      fieldType: "select",
      reasoning: "The question expects one option from a list.",
      suggestedOptions: ["Frontend", "Backend", "Full Stack", "DevOps"],
    });
    expect(requireSiteAdminMock).toHaveBeenCalledTimes(1);
    expect(generateTextMock).toHaveBeenCalledTimes(1);
  });

  it("returns fallback values when generation fails", async () => {
    generateTextMock.mockRejectedValue(new Error("AI provider timeout"));

    const request = new Request("http://localhost/api/field-type", {
      method: "POST",
      body: JSON.stringify({
        input: "Upload your resume",
      }),
    });

    const response = await POST(request);
    const body = (await response.json()) as { error: string; fieldType: string };

    expect(response.status).toBe(500);
    expect(body).toEqual({
      error: "Failed to predict field type",
      fieldType: "text",
    });
  });
});
