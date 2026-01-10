"use client";

import {
  IconArrowLeft,
  IconCheck,
  IconMail,
  IconMailForward,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { cn } from "@/lib/utils";

type ResponseStatus = "pending" | "reviewed" | "accepted" | "rejected";

const statusStyles: Record<ResponseStatus, string> = {
  pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
  reviewed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
};

interface ResponseDetailPageProps {
  responseId: Id<"applicationResponses">;
  formId: Id<"applicationForms">;
}

export function ResponseDetailPage({
  responseId,
  formId,
}: ResponseDetailPageProps) {
  const response = useQuery(api.applicationResponses.get, { responseId });
  const form = useQuery(api.applicationForms.get, { formId });
  const updateStatus = useMutation(api.applicationResponses.updateStatus);
  const [emailSending, setEmailSending] = useState(false);
  const [emailConfirmation, setEmailConfirmation] = useState<{
    type: "acceptance" | "rejection";
    sent: boolean;
  } | null>(null);

  if (!response) {
    return (
      <div className="flex h-full items-center justify-center p-6">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="mt-4 text-muted-foreground text-sm">
            Loading application...
          </p>
        </div>
      </div>
    );
  }

  const handleStatusChange = async (newStatus: ResponseStatus) => {
    const previousStatus = response.status;

    if (newStatus === "accepted" && previousStatus !== "accepted") {
      setEmailSending(true);
      try {
        const result = await updateStatus({
          responseId: response._id,
          status: newStatus,
          sendSchedulingEmail: true,
        });
        if (result.success) {
          setEmailConfirmation({ type: "acceptance", sent: true });
          toast.success("Application accepted", {
            description: "Interview scheduling email sent to applicant",
          });
        }
      } catch (_error) {
        toast.error("Failed to update status");
      } finally {
        setEmailSending(false);
      }
      return;
    }

    if (newStatus === "rejected" && previousStatus !== "rejected") {
      setEmailSending(true);
      try {
        const result = await updateStatus({
          responseId: response._id,
          status: newStatus,
          sendRejectionEmail: true,
        });
        if (result.success) {
          setEmailConfirmation({ type: "rejection", sent: true });
          toast.success("Application rejected", {
            description: "Rejection email sent to applicant",
          });
        }
      } catch (_error) {
        toast.error("Failed to update status");
      } finally {
        setEmailSending(false);
      }
      return;
    }

    try {
      await updateStatus({
        responseId: response._id,
        status: newStatus,
      });
      setEmailConfirmation(null);
      toast.success("Status updated");
    } catch (_error) {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-3xl space-y-6">
          <Link href={`/applications/${formId}/responses`}>
            <Button className="gap-2" variant="ghost">
              <IconArrowLeft size={16} />
              Back to responses
            </Button>
          </Link>

          <div>
            <h1 className="font-semibold text-2xl">
              Application from {response.applicantName}
            </h1>
            <p className="mt-1 text-muted-foreground">
              Submitted on{" "}
              {new Date(response.submittedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {form && ` for ${form.title}`}
            </p>
          </div>

          {emailConfirmation?.sent && (
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4",
                emailConfirmation.type === "acceptance"
                  ? "border-primary/30 bg-primary/5"
                  : "border-muted bg-muted/50"
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  emailConfirmation.type === "acceptance"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted-foreground/10 text-muted-foreground"
                )}
              >
                <IconMailForward size={20} />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">
                  {emailConfirmation.type === "acceptance"
                    ? "Interview Scheduling Email Sent"
                    : "Rejection Email Sent"}
                </p>
                <p className="text-muted-foreground text-xs">
                  {emailConfirmation.type === "acceptance"
                    ? "The applicant will receive a link to schedule their interview."
                    : "The applicant has been notified about the decision."}
                </p>
              </div>
              <IconCheck className="text-primary" size={20} />
            </div>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-base">Application Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4">
                <Select
                  disabled={emailSending}
                  onValueChange={(v) => handleStatusChange(v as ResponseStatus)}
                  value={response.status}
                >
                  <SelectTrigger className="w-44">
                    <Badge className={statusStyles[response.status]} variant="outline">
                      {response.status.charAt(0).toUpperCase() +
                        response.status.slice(1)}
                    </Badge>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">Pending</SelectItem>
                    <SelectItem value="reviewed">Reviewed</SelectItem>
                    <SelectItem value="accepted">
                      <span className="flex items-center gap-2">
                        Accepted
                        <IconMail className="text-muted-foreground" size={14} />
                      </span>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <span className="flex items-center gap-2">
                        Rejected
                        <IconMail className="text-muted-foreground" size={14} />
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                {emailSending && (
                  <span className="flex items-center gap-2 text-muted-foreground text-sm">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    Sending email...
                  </span>
                )}
              </div>
              <p className="mt-3 text-muted-foreground text-xs">
                Changing status to Accepted or Rejected will automatically send
                an email to the applicant.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-transparent px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-xl font-semibold text-primary">
                  {response.applicantName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="font-semibold text-lg">{response.applicantName}</h3>
                  <a
                    className="text-primary hover:underline"
                    href={`mailto:${response.applicantEmail}`}
                  >
                    {response.applicantEmail}
                  </a>
                </div>
              </div>
            </div>
          </Card>

          {response.fieldResponses.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Responses</CardTitle>
              </CardHeader>
              <div className="divide-y">
                {response.fieldResponses.map((fr, index) => (
                  <div
                    className={cn("p-4", index % 2 === 0 && "bg-muted/30")}
                    key={fr.fieldId}
                  >
                    <span className="text-muted-foreground text-xs font-medium uppercase tracking-wide">
                      {fr.fieldLabel}
                    </span>
                    <div className="mt-2">
                      {Array.isArray(fr.value) ? (
                        <div className="flex flex-wrap gap-1">
                          {fr.value.map((v, i) => (
                            <Badge
                              key={`${fr.fieldId}-${i}`}
                              variant="secondary"
                            >
                              {v}
                            </Badge>
                          ))}
                        </div>
                      ) : (
                        <p className="whitespace-pre-wrap">{fr.value}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
