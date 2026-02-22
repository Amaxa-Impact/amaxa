import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import type { Doc } from "@amaxa/backend/_generated/dataModel";

import { WorkspaceCard } from "./workspace-card";

const workspace = {
  _id: "ws_1",
  _creationTime: 0,
  slug: "acme-workspace",
  name: "Acme Workspace",
  createdBy: "user_1",
} as unknown as Doc<"workspaces">;

describe("WorkspaceCard integration", () => {
  it("renders workspace details and role badge", () => {
    render(<WorkspaceCard workspace={workspace} role="admin" />);

    expect(screen.getByText("Acme Workspace")).toBeTruthy();
    expect(screen.getByText("acme-workspace")).toBeTruthy();
    expect(screen.getByText("admin")).toBeTruthy();
  });

  it("links to the workspace home route", () => {
    render(<WorkspaceCard workspace={workspace} role="owner" />);

    const link = screen.getByRole("link", { name: /Acme Workspace/i });
    expect(link.getAttribute("href")).toBe("/acme-workspace");
  });
});
