import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";

import type { Id } from "@amaxa/backend/_generated/dataModel";

const { useQueryMock } = vi.hoisted(() => ({
  useQueryMock: vi.fn(),
}));

vi.mock("convex/react", () => ({
  useQuery: useQueryMock,
}));

vi.mock("@amaxa/backend/_generated/api", () => ({
  api: {
    workspaces: {
      listForUser: "workspaces.listForUser",
    },
    workspaceInvitations: {
      listPendingForUser: "workspaceInvitations.listPendingForUser",
    },
  },
}));

vi.mock("./workspace-card", () => ({
  WorkspaceCard: ({
    role,
    workspace,
  }: {
    role: string;
    workspace: { name: string };
  }) => (
    <div data-testid="workspace-card">
      {workspace.name}:{role}
    </div>
  ),
}));

vi.mock("./invitation-card", () => ({
  InvitationCard: ({ invitation }: { invitation: { workspaceName: string } }) => (
    <div data-testid="invitation-card">{invitation.workspaceName}</div>
  ),
}));

import { HomeClient } from "./home-client";

const workspaceRows = [
  {
    workspace: {
      _id: "ws_1" as Id<"workspaces">,
      slug: "acme",
      name: "Acme",
    },
    role: "owner" as const,
  },
  {
    workspace: {
      _id: "ws_2" as Id<"workspaces">,
      slug: "beta",
      name: "Beta",
    },
    role: "member" as const,
  },
];

const invitationRows = [
  {
    _id: "inv_1" as Id<"workspaceInvitations">,
    workspaceId: "ws_1" as Id<"workspaces">,
    email: "member@example.com",
    role: "member" as const,
    token: "token-1",
    workspaceName: "Gamma Workspace",
    workspaceSlug: "gamma",
  },
];

describe("HomeClient integration", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton while queries are pending", () => {
    useQueryMock.mockReturnValue(undefined);

    render(<HomeClient />);

    expect(document.querySelector(".animate-pulse")).not.toBeNull();
    expect(screen.queryByRole("heading", { name: "Your Workspaces" })).toBeNull();
  });

  it("renders workspace cards and pending invitations", () => {
    useQueryMock.mockImplementation((query: string) => {
      if (query === "workspaces.listForUser") {
        return workspaceRows;
      }

      return invitationRows;
    });

    render(<HomeClient />);

    expect(screen.getByRole("heading", { name: "Your Workspaces" })).toBeTruthy();
    expect(screen.getAllByTestId("workspace-card")).toHaveLength(2);
    expect(
      screen.getByRole("heading", { name: "Pending Invitations" }),
    ).toBeTruthy();
    expect(screen.getAllByTestId("invitation-card")).toHaveLength(1);
  });

  it("shows empty state guidance when no workspace exists", () => {
    useQueryMock.mockImplementation((query: string) => {
      if (query === "workspaces.listForUser") {
        return [];
      }

      return [];
    });

    render(<HomeClient />);

    expect(screen.getByText("No workspaces yet")).toBeTruthy();
    expect(
      screen.getByText("You'll see your workspaces here once you're added to one"),
    ).toBeTruthy();
  });

  it("changes empty-state copy when invitations exist", () => {
    useQueryMock.mockImplementation((query: string) => {
      if (query === "workspaces.listForUser") {
        return [];
      }

      return invitationRows;
    });

    render(<HomeClient />);

    expect(screen.getByText("No workspaces yet")).toBeTruthy();
    expect(
      screen.getByText("Accept an invitation below to get started"),
    ).toBeTruthy();
  });
});
