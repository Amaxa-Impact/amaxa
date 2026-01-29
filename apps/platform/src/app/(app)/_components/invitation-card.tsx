"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Button } from "@amaxa/ui/button";
import { cn } from "@amaxa/ui";

type InvitationRole = "admin" | "member";

interface Invitation {
  _id: Id<"workspaceInvitations">;
  workspaceId: Id<"workspaces">;
  email: string;
  role: InvitationRole;
  token: string;
  workspaceName: string;
  workspaceSlug: string;
}

interface InvitationCardProps {
  invitation: Invitation;
}

const roleBadgeStyles: Record<InvitationRole, string> = {
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  member: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

export function InvitationCard({ invitation }: InvitationCardProps) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);

  const acceptInvitation = useMutation(api.workspaceInvitations.acceptInvitation);
  const declineInvitation = useMutation(api.workspaceInvitations.declineInvitation);

  const handleAccept = async () => {
    setIsAccepting(true);
    try {
      await acceptInvitation({ invitationId: invitation._id });
      toast.success(`Joined ${invitation.workspaceName}`);
      router.push(`/${invitation.workspaceSlug}`);
    } catch (error) {
      console.error("Failed to accept invitation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to accept invitation"
      );
    } finally {
      setIsAccepting(false);
    }
  };

  const handleDecline = async () => {
    setIsDeclining(true);
    try {
      await declineInvitation({ invitationId: invitation._id });
      toast.success("Invitation declined");
    } catch (error) {
      console.error("Failed to decline invitation:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to decline invitation"
      );
    } finally {
      setIsDeclining(false);
    }
  };

  const isLoading = isAccepting || isDeclining;

  return (
    <div className="bg-card border-border flex items-center justify-between rounded-lg border p-4">
      <div className="flex items-center gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-medium">{invitation.workspaceName}</span>
            <span
              className={cn(
                "rounded-full px-2 py-0.5 text-xs font-medium capitalize",
                roleBadgeStyles[invitation.role],
              )}
            >
              {invitation.role}
            </span>
          </div>
          <p className="text-muted-foreground text-sm">
            {invitation.workspaceSlug}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          size="sm"
          variant="outline"
          onClick={handleDecline}
          disabled={isLoading}
        >
          {isDeclining ? "Declining..." : "Decline"}
        </Button>
        <Button
          size="sm"
          onClick={handleAccept}
          disabled={isLoading}
        >
          {isAccepting ? "Accepting..." : "Accept"}
        </Button>
      </div>
    </div>
  );
}
