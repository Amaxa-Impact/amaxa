"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { CheckCircle, XCircle } from "lucide-react";

import { api } from "@amaxa/backend/_generated/api";
import { cn } from "@amaxa/ui";
import { Badge } from "@amaxa/ui/badge";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@amaxa/ui/card";

type InvitationRole = "admin" | "member";

const roleBadgeStyles: Record<InvitationRole, string> = {
  admin: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  member: "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300",
};

interface InviteAcceptClientProps {
  token: string;
  invitation: {
    email: string;
    role: InvitationRole;
    workspaceName: string;
    workspaceSlug: string;
  };
  userEmail: string;
}

export function InviteAcceptClient({
  token,
  invitation,
  userEmail,
}: InviteAcceptClientProps) {
  const router = useRouter();
  const [isAccepting, setIsAccepting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const acceptByToken = useMutation(api.workspaceInvitations.acceptByToken);

  const emailMismatch =
    userEmail.toLowerCase() !== invitation.email.toLowerCase();

  const handleAccept = async () => {
    setIsAccepting(true);
    setError(null);

    try {
      const result = await acceptByToken({ token });

      if (result.success && result.workspaceSlug) {
        setSuccess(true);
        setTimeout(() => {
          router.push(`/${result.workspaceSlug}`);
        }, 1500);
      } else {
        setError(result.error ?? "Failed to accept invitation");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to accept invitation",
      );
    } finally {
      setIsAccepting(false);
    }
  };

  if (success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-green-50 to-white p-4 dark:from-green-950/20 dark:to-background">
        <Card className="w-full max-w-md">
          <CardContent className="flex flex-col items-center py-12 text-center">
            <CheckCircle className="mb-4 h-16 w-16 text-green-500" />
            <h1 className="mb-2 text-2xl font-bold">Welcome!</h1>
            <p className="text-muted-foreground">
              You've joined <strong>{invitation.workspaceName}</strong>.
              <br />
              Redirecting you now...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <h1 className="text-2xl font-bold">Workspace Invitation</h1>
          <p className="text-muted-foreground">
            You've been invited to join a workspace
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="bg-muted/50 rounded-lg p-4">
            <div className="mb-4 text-center">
              <h2 className="text-xl font-semibold">
                {invitation.workspaceName}
              </h2>
              <p className="text-muted-foreground text-sm">
                {invitation.workspaceSlug}
              </p>
            </div>

            <div className="flex items-center justify-center gap-2">
              <span className="text-muted-foreground text-sm">Role:</span>
              <Badge
                variant="secondary"
                className={cn(roleBadgeStyles[invitation.role])}
              >
                {invitation.role}
              </Badge>
            </div>
          </div>

          {emailMismatch && (
            <div className="flex items-start gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 dark:border-amber-900 dark:bg-amber-950/50">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
              <div>
                <p className="font-medium text-amber-800 dark:text-amber-200">
                  Email Mismatch
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300">
                  This invitation was sent to{" "}
                  <strong>{invitation.email}</strong>, but you're signed in as{" "}
                  <strong>{userEmail}</strong>.
                </p>
                <p className="mt-2 text-sm text-amber-700 dark:text-amber-300">
                  Please sign in with the correct email address to accept this
                  invitation.
                </p>
              </div>
            </div>
          )}

          {error && (
            <div className="flex items-start gap-3 rounded-lg border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/50">
              <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
              <div>
                <p className="font-medium text-red-800 dark:text-red-200">
                  Error
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          )}

          <div className="text-muted-foreground text-center text-sm">
            <p>
              Signed in as <strong>{userEmail}</strong>
            </p>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button
            onClick={handleAccept}
            disabled={isAccepting || emailMismatch}
            className="w-full"
          >
            {isAccepting ? "Accepting..." : "Accept Invitation"}
          </Button>

          {emailMismatch && (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                window.location.href = "/sign-out?redirect=/invite/" + token;
              }}
            >
              Sign in with different account
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
