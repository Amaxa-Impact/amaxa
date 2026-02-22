"use client";

import { useState } from "react";
import Link from "next/link";
import { useApplicationForm } from "@/components/application/context";
import {
  IconArrowLeft,
  IconCheck,
  IconMail,
  IconMailForward,
} from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { cn } from "@amaxa/ui";
import { Badge } from "@amaxa/ui/badge";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@amaxa/ui/select";

import { FileList } from "./file-preview";

interface FileValue {
  type: "file";
  files: {
    blobId: string;
    path: string;
    filename: string;
    contentType: string;
    sizeBytes: number;
  }[];
}

function isFileValue(value: unknown): value is FileValue {
  return (
    typeof value === "object" &&
    value !== null &&
    "type" in value &&
    value.type === "file" &&
    "files" in value &&
    Array.isArray(value.files)
  );
}

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
  const form = useApplicationForm();
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
          <div className="border-primary mx-auto h-8 w-8 animate-spin rounded-full border-2 border-t-transparent" />
          <p className="text-muted-foreground mt-4 text-sm">
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
      } catch {
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
      } catch {
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
    } catch {
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
            <h1 className="text-2xl font-semibold">
              Application from {response.applicantName}
            </h1>
            <p className="text-muted-foreground mt-1">
              Submitted on{" "}
              {new Date(response.submittedAt).toLocaleDateString("en-US", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
              {` for ${form.title}`}
            </p>
          </div>

          {emailConfirmation?.sent && (
            <div
              className={cn(
                "flex items-center gap-3 rounded-lg border p-4",
                emailConfirmation.type === "acceptance"
                  ? "border-primary/30 bg-primary/5"
                  : "border-muted bg-muted/50",
              )}
            >
              <div
                className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full",
                  emailConfirmation.type === "acceptance"
                    ? "bg-primary/10 text-primary"
                    : "bg-muted-foreground/10 text-muted-foreground",
                )}
              >
                <IconMailForward size={20} />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">
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
                  onValueChange={(v) => {
                    if (!v) return;
                    void handleStatusChange(v);
                  }}
                  value={response.status}
                >
                  <SelectTrigger className="w-44">
                    <Badge
                      className={statusStyles[response.status]}
                      variant="outline"
                    >
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
                  <span className="text-muted-foreground flex items-center gap-2 text-sm">
                    <div className="border-primary h-4 w-4 animate-spin rounded-full border-2 border-t-transparent" />
                    Sending email...
                  </span>
                )}
              </div>
              <p className="text-muted-foreground mt-3 text-xs">
                Changing status to Accepted or Rejected will automatically send
                an email to the applicant.
              </p>
            </CardContent>
          </Card>

          <Card className="overflow-hidden">
            <div className="from-primary/10 bg-gradient-to-r to-transparent px-6 py-6">
              <div className="flex items-center gap-4">
                <div className="bg-primary/20 text-primary flex h-14 w-14 items-center justify-center rounded-full text-xl font-semibold">
                  {response.applicantName.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h3 className="text-lg font-semibold">
                    {response.applicantName}
                  </h3>
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
                    <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                      {fr.fieldLabel}
                    </span>
                    <div className="mt-2">
                      {isFileValue(fr.value) ? (
                        <FileList files={fr.value.files} />
                      ) : Array.isArray(fr.value) ? (
                        <div className="flex flex-wrap gap-1">
                          {fr.value.map((value) => (
                            <Badge
                              key={`${fr.fieldId}-${String(value)}`}
                              variant="secondary"
                            >
                              {value}
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
