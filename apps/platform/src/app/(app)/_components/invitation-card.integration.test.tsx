import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Id } from "@amaxa/backend/_generated/dataModel";

const {
  acceptInvitationMock,
  declineInvitationMock,
  pushMock,
  toastErrorMock,
  toastSuccessMock,
  useMutationMock,
  useRouterMock,
} = vi.hoisted(() => ({
  useMutationMock: vi.fn(),
  useRouterMock: vi.fn(),
  acceptInvitationMock: vi.fn(),
  declineInvitationMock: vi.fn(),
  pushMock: vi.fn(),
  toastSuccessMock: vi.fn(),
  toastErrorMock: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: useRouterMock,
}));

vi.mock("convex/react", () => ({
  useMutation: useMutationMock,
}));

vi.mock("sonner", () => ({
  toast: {
    success: toastSuccessMock,
    error: toastErrorMock,
  },
}));

vi.mock("@amaxa/backend/_generated/api", () => ({
  api: {
    workspaceInvitations: {
      acceptInvitation: "workspaceInvitations.acceptInvitation",
      declineInvitation: "workspaceInvitations.declineInvitation",
    },
  },
}));

import { InvitationCard } from "./invitation-card";

const invitation = {
  _id: "inv_1" as Id<"workspaceInvitations">,
  workspaceId: "ws_1" as Id<"workspaces">,
  email: "member@example.com",
  role: "admin" as const,
  token: "invite-token",
  workspaceName: "Acme Workspace",
  workspaceSlug: "acme-workspace",
};

describe("InvitationCard integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(console, "error").mockImplementation(() => {});
    useRouterMock.mockReturnValue({ push: pushMock });
    acceptInvitationMock.mockResolvedValue(undefined);
    declineInvitationMock.mockResolvedValue(undefined);
    useMutationMock.mockImplementation((mutation: string) => {
      if (mutation === "workspaceInvitations.acceptInvitation") {
        return acceptInvitationMock;
      }

      return declineInvitationMock;
    });
  });

  it("accepts an invitation and routes to the workspace", async () => {
    render(<InvitationCard invitation={invitation} />);

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    await waitFor(() => {
      expect(acceptInvitationMock).toHaveBeenCalledWith({
        invitationId: invitation._id,
      });
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Joined Acme Workspace");
    expect(pushMock).toHaveBeenCalledWith("/acme-workspace");
  });

  it("declines an invitation and keeps the user on the page", async () => {
    render(<InvitationCard invitation={invitation} />);

    fireEvent.click(screen.getByRole("button", { name: "Decline" }));

    await waitFor(() => {
      expect(declineInvitationMock).toHaveBeenCalledWith({
        invitationId: invitation._id,
      });
    });
    expect(toastSuccessMock).toHaveBeenCalledWith("Invitation declined");
    expect(pushMock).not.toHaveBeenCalled();
  });

  it("shows an error toast when accept fails", async () => {
    acceptInvitationMock.mockRejectedValue(new Error("Invite expired"));

    render(<InvitationCard invitation={invitation} />);

    fireEvent.click(screen.getByRole("button", { name: "Accept" }));

    await waitFor(() => {
      expect(toastErrorMock).toHaveBeenCalledWith("Invite expired");
    });
    expect(pushMock).not.toHaveBeenCalled();
  });
});
