import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { acceptByTokenMock, pushMock, useMutationMock, useRouterMock } =
  vi.hoisted(() => ({
    useMutationMock: vi.fn(),
    useRouterMock: vi.fn(),
    acceptByTokenMock: vi.fn(),
    pushMock: vi.fn(),
  }));

vi.mock("next/navigation", () => ({
  useRouter: useRouterMock,
}));

vi.mock("convex/react", () => ({
  useMutation: useMutationMock,
}));

vi.mock("@amaxa/backend/_generated/api", () => ({
  api: {
    workspaceInvitations: {
      acceptByToken: "workspaceInvitations.acceptByToken",
    },
  },
}));

import { InviteAcceptClient } from "./client";

const invitation = {
  email: "member@example.com",
  role: "member" as const,
  workspaceName: "Acme Workspace",
  workspaceSlug: "acme-workspace",
};

describe("InviteAcceptClient integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useRouterMock.mockReturnValue({ push: pushMock });
    useMutationMock.mockReturnValue(acceptByTokenMock);
    acceptByTokenMock.mockResolvedValue({
      success: true,
      workspaceSlug: "acme-workspace",
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("blocks acceptance when signed-in email does not match invitation email", () => {
    render(
      <InviteAcceptClient
        invitation={invitation}
        token="invite-token"
        userEmail="other-user@example.com"
      />,
    );

    expect(screen.getByText("Email Mismatch")).toBeTruthy();
    expect(
      (screen.getByRole("button", {
        name: "Accept Invitation",
      }) as HTMLButtonElement).disabled,
    ).toBe(true);
    expect(screen.getByText("Sign in with different account")).toBeTruthy();
  });

  it("accepts invitation and redirects to the workspace", async () => {
    render(
      <InviteAcceptClient
        invitation={invitation}
        token="invite-token"
        userEmail="member@example.com"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Accept Invitation" }));

    await waitFor(() => {
      expect(acceptByTokenMock).toHaveBeenCalledWith({ token: "invite-token" });
    });
    expect(await screen.findByText("Welcome!")).toBeTruthy();
    await new Promise((resolve) => setTimeout(resolve, 1600));

    expect(pushMock).toHaveBeenCalledWith("/acme-workspace");
  });

  it("shows returned mutation errors without redirecting", async () => {
    acceptByTokenMock.mockResolvedValue({
      success: false,
      error: "Invitation expired",
    });

    render(
      <InviteAcceptClient
        invitation={invitation}
        token="invite-token"
        userEmail="member@example.com"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Accept Invitation" }));

    expect(await screen.findByText("Error")).toBeTruthy();
    expect(await screen.findByText("Invitation expired")).toBeTruthy();
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows thrown errors when invitation acceptance fails", async () => {
    acceptByTokenMock.mockRejectedValue(new Error("Network unavailable"));

    render(
      <InviteAcceptClient
        invitation={invitation}
        token="invite-token"
        userEmail="member@example.com"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: "Accept Invitation" }));

    expect(await screen.findByText("Network unavailable")).toBeTruthy();
    expect(pushMock).not.toHaveBeenCalled();
  });
});
