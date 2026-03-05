"use client";

import { useState } from "react";
import { useWorkspace } from "@/components/workspace/context";
import {
  IconClock,
  IconDotsVertical,
  IconMail,
  IconPlus,
  IconRefresh,
  IconTrash,
  IconUsers,
} from "@tabler/icons-react";
import { useForm } from "@tanstack/react-form";
import { type } from "arktype";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { cn } from "@amaxa/ui";
import { Badge } from "@amaxa/ui/badge";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amaxa/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@amaxa/ui/dropdown-menu";
import { Field, FieldContent, FieldError, FieldLabel } from "@amaxa/ui/field";
import { Input } from "@amaxa/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amaxa/ui/table";
import { Textarea } from "@amaxa/ui/textarea";

import { AdminContainer } from "../_components/admin-container";

type WorkspaceRole = "owner" | "admin" | "member";

const roleBadgeStyles: Record<WorkspaceRole, string> = {
  owner: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  member: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const EMAIL_HEADER_CANDIDATES = new Set([
  "email",
  "e-mail",
  "email address",
  "e-mail address",
]);

function splitDelimitedRow(row: string): string[] {
  if (!row.includes(",") && row.includes("\t")) {
    return row.split("\t").map((cell) => cell.trim());
  }

  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let index = 0; index < row.length; index += 1) {
    const char = row[index];

    if (char === '"') {
      if (inQuotes && row[index + 1] === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current.trim());
      current = "";
      continue;
    }

    current += char;
  }

  cells.push(current.trim());
  return cells;
}

function parseInvitationCsv(csvInput: string): {
  emails: string[];
  invalidRows: number[];
  duplicateCount: number;
} {
  const rows = csvInput.split(/\r?\n/);
  const firstContentRow = rows.findIndex((row) => row.trim().length > 0);

  if (firstContentRow === -1) {
    return { emails: [], invalidRows: [], duplicateCount: 0 };
  }

  const headerRow = rows[firstContentRow] ?? "";
  const firstCells = splitDelimitedRow(headerRow).map((cell) =>
    cell.toLowerCase().replace(/\s+/g, " ").trim(),
  );
  const emailColumnIndex = firstCells.findIndex((cell) =>
    EMAIL_HEADER_CANDIDATES.has(cell),
  );

  const sourceColumnIndex = emailColumnIndex >= 0 ? emailColumnIndex : 0;
  const startRow =
    emailColumnIndex >= 0 ? firstContentRow + 1 : firstContentRow;

  const seen = new Set<string>();
  const emails: string[] = [];
  const invalidRows: number[] = [];
  let duplicateCount = 0;

  for (let rowIndex = startRow; rowIndex < rows.length; rowIndex += 1) {
    const row = rows[rowIndex];
    if (!row || row.trim().length === 0) {
      continue;
    }

    const cells = splitDelimitedRow(row);
    const candidate = (cells[sourceColumnIndex] ?? cells[0] ?? "")
      .replace(/^['"]|['"]$/g, "")
      .trim()
      .toLowerCase();

    if (!EMAIL_REGEX.test(candidate)) {
      invalidRows.push(rowIndex + 1);
      continue;
    }

    if (seen.has(candidate)) {
      duplicateCount += 1;
      continue;
    }

    seen.add(candidate);
    emails.push(candidate);
  }

  return {
    emails,
    invalidRows,
    duplicateCount,
  };
}

export function WorkspaceUsersClient() {
  const { workspace } = useWorkspace();
  const [inviteDialogOpen, setInviteDialogOpen] = useState(false);

  return (
    <AdminContainer
      title="Users"
      description={`Manage members and invitations for ${workspace.name}`}
      actions={
        <Dialog open={inviteDialogOpen} onOpenChange={setInviteDialogOpen}>
          <DialogTrigger
            render={
              <Button size="sm">
                <IconPlus className="size-4" />
                Invite User
              </Button>
            }
          />
          <DialogContent>
            <InviteUserDialog
              workspaceSlug={workspace.slug}
              onSuccess={(message) => {
                setInviteDialogOpen(false);
                toast.success(message ?? "Invitation sent successfully");
              }}
            />
          </DialogContent>
        </Dialog>
      }
    >
      <MembersTable workspaceSlug={workspace.slug} />
      <PendingInvitationsTable workspaceSlug={workspace.slug} />
    </AdminContainer>
  );
}

function MembersTable({ workspaceSlug }: { workspaceSlug: string }) {
  const members = useQuery(api.workspaceToUser.listUsersForWorkspace, {
    workspaceSlug,
  });
  const updateRole = useMutation(api.workspaceToUser.updateRole);
  const removeUser = useMutation(api.workspaceToUser.removeUser);

  if (!members) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <IconUsers className="h-5 w-5" />
            Members
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground py-8 text-center">
            Loading members...
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleRoleChange = async (userId: string, newRole: WorkspaceRole) => {
    try {
      await updateRole({ workspaceSlug, userId, role: newRole });
      toast.success("Role updated");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update role",
      );
    }
  };

  const handleRemove = async (userId: string) => {
    try {
      await removeUser({ workspaceSlug, userId });
      toast.success("User removed");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to remove user",
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-base">
          <IconUsers className="size-5" />
          Members ({members.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>User ID</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[50px]" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member._id}>
                <TableCell className="font-mono text-sm">
                  {member.userId}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(roleBadgeStyles[member.role])}
                  >
                    {member.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={() => (
                        <Button variant="ghost" size="icon">
                          <IconDotsVertical className="h-4 w-4" />
                        </Button>
                      )}
                    />
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleRoleChange(member.userId, "admin")}
                        disabled={member.role === "admin"}
                      >
                        Make Admin
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          handleRoleChange(member.userId, "member")
                        }
                        disabled={member.role === "member"}
                      >
                        Make Member
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleRemove(member.userId)}
                        className="text-destructive focus:text-destructive"
                        disabled={member.role === "owner"}
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
                        Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function PendingInvitationsTable({ workspaceSlug }: { workspaceSlug: string }) {
  const invitations = useQuery(
    api.workspaceInvitations.listPendingForWorkspace,
    {
      workspaceSlug,
    },
  );
  const revokeInvitation = useMutation(
    api.workspaceInvitations.revokeInvitation,
  );
  const resendInvitation = useMutation(
    api.workspaceInvitations.resendInvitation,
  );

  if (!invitations || invitations.length === 0) {
    return null;
  }

  const handleRevoke = async (invitationId: Id<"workspaceInvitations">) => {
    try {
      await revokeInvitation({ invitationId });
      toast.success("Invitation revoked");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to revoke invitation",
      );
    }
  };

  const handleResend = async (invitationId: Id<"workspaceInvitations">) => {
    try {
      await resendInvitation({ invitationId });
      toast.success("Invitation resent");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to resend invitation",
      );
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconMail className="h-5 w-5" />
          Pending Invitations ({invitations.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Expires</TableHead>
              <TableHead className="w-12.5" />
            </TableRow>
          </TableHeader>
          <TableBody>
            {invitations.map((invitation) => (
              <TableRow key={invitation._id}>
                <TableCell className="font-medium">
                  {invitation.email}
                </TableCell>
                <TableCell>
                  <Badge
                    variant="secondary"
                    className={cn(roleBadgeStyles[invitation.role])}
                  >
                    {invitation.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="text-muted-foreground flex items-center gap-1 text-sm">
                    <IconClock className="h-3 w-3" />
                    {formatExpiry(invitation.expiresAt)}
                  </div>
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger
                      render={<Button variant="ghost" size="icon" />}
                    >
                      <IconDotsVertical className="h-4 w-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem
                        onClick={() => handleResend(invitation._id)}
                      >
                        <IconRefresh className="mr-2 h-4 w-4" />
                        Resend
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem
                        onClick={() => handleRevoke(invitation._id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <IconTrash className="mr-2 h-4 w-4" />
                        Revoke
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function formatExpiry(expiresAt: number): string {
  const now = Date.now();
  const diff = expiresAt - now;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  }
  if (hours > 0) {
    return `${hours}h`;
  }
  return "< 1h";
}

const inviteSchema = type({
  email: "string.email",
  role: "'admin' | 'member'",
});

function InviteUserDialog({
  workspaceSlug,
  onSuccess,
}: {
  workspaceSlug: string;
  onSuccess: (message?: string) => void;
}) {
  const createInvitation = useMutation(
    api.workspaceInvitations.createInvitation,
  );
  const [csvInput, setCsvInput] = useState("");
  const [csvRole, setCsvRole] = useState<"admin" | "member">("member");
  const [isBulkInviting, setIsBulkInviting] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
      role: "member" as "admin" | "member",
    },
    validators: {
      onChange: inviteSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await createInvitation({
          workspaceSlug,
          email: value.email.trim(),
          role: value.role,
        });
        form.reset();
        onSuccess();
      } catch (error) {
        console.error(error);
      }
    },
  });

  const handleBulkInvite = async () => {
    const parsed = parseInvitationCsv(csvInput);

    if (parsed.emails.length === 0) {
      const invalidNote =
        parsed.invalidRows.length > 0
          ? ` Found ${parsed.invalidRows.length} invalid row${parsed.invalidRows.length === 1 ? "" : "s"}.`
          : "";
      toast.error(`No valid emails found in CSV.${invalidNote}`);
      return;
    }

    setIsBulkInviting(true);
    let sentCount = 0;
    const failures: string[] = [];

    try {
      for (const email of parsed.emails) {
        try {
          await createInvitation({
            workspaceSlug,
            email,
            role: csvRole,
          });
          sentCount += 1;
        } catch (error) {
          failures.push(
            `${email}: ${error instanceof Error ? error.message : "Failed to send invitation"}`,
          );
        }
      }

      const skippedParts: string[] = [];
      if (parsed.duplicateCount > 0) {
        skippedParts.push(
          `${parsed.duplicateCount} duplicate email${parsed.duplicateCount === 1 ? "" : "s"} skipped`,
        );
      }
      if (parsed.invalidRows.length > 0) {
        skippedParts.push(
          `${parsed.invalidRows.length} invalid row${parsed.invalidRows.length === 1 ? "" : "s"} ignored`,
        );
      }
      const skippedText =
        skippedParts.length > 0 ? ` (${skippedParts.join(", ")})` : "";

      if (sentCount > 0 && failures.length === 0) {
        setCsvInput("");
        onSuccess(
          `Sent ${sentCount} invitation${sentCount === 1 ? "" : "s"}${skippedText}`,
        );
        return;
      }

      if (sentCount > 0) {
        toast.success(
          `Sent ${sentCount} invitation${sentCount === 1 ? "" : "s"}${skippedText}`,
        );
      }

      if (failures.length > 0) {
        const preview = failures.slice(0, 2).join(" | ");
        const overflow =
          failures.length > 2 ? ` (+${failures.length - 2} more)` : "";
        toast.error(
          `${failures.length} invitation${failures.length === 1 ? "" : "s"} failed: ${preview}${overflow}`,
        );
      }

      if (sentCount === 0 && failures.length === 0) {
        toast.error("No invitations were sent.");
      }
    } finally {
      setIsBulkInviting(false);
    }
  };

  return (
    <div>
      <DialogHeader>
        <DialogTitle>Invite User</DialogTitle>
        <DialogDescription>
          Send an invitation to join this workspace.
        </DialogDescription>
      </DialogHeader>

      <div className="grid gap-6 py-4">
        <form.Field name="email">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
              <FieldContent>
                <Input
                  id={field.name}
                  name={field.name}
                  type="email"
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="user@example.com"
                  value={field.state.value}
                />
                <FieldError
                  errors={field.state.meta.errors.map((error) => {
                    if (typeof error === "string") {
                      return { message: error };
                    }
                    return undefined;
                  })}
                />
              </FieldContent>
            </Field>
          )}
        </form.Field>

        <form.Field name="role">
          {(field) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Role</FieldLabel>
              <FieldContent>
                <Select
                  value={field.state.value}
                  onValueChange={(value: "admin" | "member" | null) => {
                    if (value) {
                      field.handleChange(value);
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-muted-foreground mt-1 text-xs">
                  Admins can manage workspace settings and invite users
                </p>
              </FieldContent>
            </Field>
          )}
        </form.Field>

        <div className="border-border space-y-3 border-t pt-4">
          <div>
            <p className="text-sm font-medium">Bulk Invite via CSV</p>
            <p className="text-muted-foreground mt-1 text-xs">
              Paste CSV rows with an email column, or one email per line.
            </p>
          </div>

          <Textarea
            value={csvInput}
            onChange={(event) => setCsvInput(event.target.value)}
            placeholder={"email\nalex@example.com\njamie@example.com"}
            rows={6}
          />

          <div className="grid gap-2">
            <Field>
              <FieldLabel htmlFor="csv-role">Role for CSV invites</FieldLabel>
              <FieldContent>
                <Select
                  value={csvRole}
                  onValueChange={(value: "admin" | "member" | null) => {
                    if (value) {
                      setCsvRole(value);
                    }
                  }}
                >
                  <SelectTrigger id="csv-role">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                  </SelectContent>
                </Select>
              </FieldContent>
            </Field>

            <Button
              type="button"
              variant="secondary"
              isLoading={isBulkInviting}
              disabled={csvInput.trim().length === 0}
              onClick={() => void handleBulkInvite()}
            >
              {isBulkInviting ? "Sending..." : "Send CSV Invitations"}
            </Button>
          </div>
        </div>
      </div>

      <DialogFooter>
        <DialogClose render={<Button variant="outline">Cancel</Button>} />
        <form.Subscribe
          selector={(state) => [state.canSubmit, state.isSubmitting]}
        >
          {([canSubmit, isSubmitting]) => (
            <Button
              disabled={!canSubmit || isBulkInviting}
              isLoading={!!isSubmitting}
              onClick={() => void form.handleSubmit()}
              type="button"
            >
              {isSubmitting ? "Sending..." : "Send Invitation"}
            </Button>
          )}
        </form.Subscribe>
      </DialogFooter>
    </div>
  );
}
