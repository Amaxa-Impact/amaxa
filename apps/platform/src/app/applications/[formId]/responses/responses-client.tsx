"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { IconInbox } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { Badge } from "@amaxa/ui/badge";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent } from "@amaxa/ui/card";
import { confirmDialog } from "@amaxa/ui/confirm-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@amaxa/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@amaxa/ui/table";

type ResponseStatus = "pending" | "reviewed" | "accepted" | "rejected";

const statusColors = {
  all: "bg-foreground",
  pending: "bg-amber-500",
  reviewed: "bg-blue-500",
  accepted: "bg-emerald-500",
  rejected: "bg-rose-500",
};

export default function ResponsesPageClient() {
  const { formId } = useParams<{ formId: Id<"applicationForms"> }>();
  const form = useQuery(api.applicationForms.get, { formId });
  const responses = useQuery(api.applicationResponses.list, { formId });

  const [statusFilter, setStatusFilter] = useState<ResponseStatus | "all">(
    "all",
  );

  if (!form) {
    return <div className="p-6">Form not found</div>;
  }

  const filteredResponses =
    statusFilter === "all"
      ? responses
      : responses?.filter((r) => r.status === statusFilter);

  const statusCounts = {
    all: responses?.length ?? 0,
    pending: responses?.filter((r) => r.status === "pending").length ?? 0,
    reviewed: responses?.filter((r) => r.status === "reviewed").length ?? 0,
    accepted: responses?.filter((r) => r.status === "accepted").length ?? 0,
    rejected: responses?.filter((r) => r.status === "rejected").length ?? 0,
  };

  return (
    <div className="flex h-full flex-col">
      <main className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-6xl space-y-6">
          <div className="flex gap-2">
            <Button
              className="gap-2 transition-all"
              onClick={() => setStatusFilter("all")}
              size="sm"
              variant={statusFilter === "all" ? "default" : "outline"}
            >
              <span className={`h-2 w-2 rounded-full ${statusColors.all}`} />
              All
              <span className="bg-background/20 rounded-full px-1.5 py-0.5 text-[10px]">
                {statusCounts.all}
              </span>
            </Button>
            <Button
              className="gap-2 transition-all"
              onClick={() => setStatusFilter("pending")}
              size="sm"
              variant={statusFilter === "pending" ? "default" : "outline"}
            >
              <span
                className={`h-2 w-2 rounded-full ${statusColors.pending}`}
              />
              Pending
              <span className="bg-background/20 rounded-full px-1.5 py-0.5 text-[10px]">
                {statusCounts.pending}
              </span>
            </Button>
            <Button
              className="gap-2 transition-all"
              onClick={() => setStatusFilter("reviewed")}
              size="sm"
              variant={statusFilter === "reviewed" ? "default" : "outline"}
            >
              <span
                className={`h-2 w-2 rounded-full ${statusColors.reviewed}`}
              />
              Reviewed
              <span className="bg-background/20 rounded-full px-1.5 py-0.5 text-[10px]">
                {statusCounts.reviewed}
              </span>
            </Button>
            <Button
              className="gap-2 transition-all"
              onClick={() => setStatusFilter("accepted")}
              size="sm"
              variant={statusFilter === "accepted" ? "default" : "outline"}
            >
              <span
                className={`h-2 w-2 rounded-full ${statusColors.accepted}`}
              />
              Accepted
              <span className="bg-background/20 rounded-full px-1.5 py-0.5 text-[10px]">
                {statusCounts.accepted}
              </span>
            </Button>
            <Button
              className="gap-2 transition-all"
              onClick={() => setStatusFilter("rejected")}
              size="sm"
              variant={statusFilter === "rejected" ? "default" : "outline"}
            >
              <span
                className={`h-2 w-2 rounded-full ${statusColors.rejected}`}
              />
              Rejected
              <span className="bg-background/20 rounded-full px-1.5 py-0.5 text-[10px]">
                {statusCounts.rejected}
              </span>
            </Button>
          </div>

          {filteredResponses?.length === 0 ? (
            <Card className="border-dashed">
              <CardContent className="flex flex-col items-center py-16 text-center">
                <div className="bg-muted/50 ring-border mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ring-1">
                  <IconInbox className="text-muted-foreground h-8 w-8" />
                </div>
                <h3 className="mb-2 text-lg font-semibold">
                  {responses?.length === 0
                    ? "No applications yet"
                    : "No matching applications"}
                </h3>
                <p className="text-muted-foreground max-w-sm">
                  {responses?.length === 0
                    ? "Applications will appear here once candidates submit their forms."
                    : "Try adjusting your filter to see more results."}
                </p>
              </CardContent>
            </Card>
          ) : (
            <Card className="overflow-hidden shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Applicant</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Submitted</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResponses?.map((response) => (
                    <ResponseRow
                      formId={formId}
                      key={response._id}
                      response={response}
                    />
                  ))}
                </TableBody>
              </Table>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}

function ResponseRow({
  response,
  formId,
}: {
  response: {
    _id: Id<"applicationResponses">;
    applicantName: string;
    applicantEmail: string;
    submittedAt: number;
    status: ResponseStatus;
  };
  formId: Id<"applicationForms">;
}) {
  const updateStatus = useMutation(api.applicationResponses.updateStatus);
  const deleteResponse = useMutation(api.applicationResponses.remove);

  const handleStatusChange = async (newStatus: ResponseStatus) => {
    try {
      await updateStatus({
        responseId: response._id,
        status: newStatus,
      });
      toast.success("Status updated");
    } catch (_error) {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = () => {
    confirmDialog({
      title: "Delete Application",
      description:
        "Are you sure you want to delete this application? This action cannot be undone.",
      confirmText: "Delete",
      cancelText: "Cancel",
      variant: "destructive",
      onConfirm: async () => {
        try {
          await deleteResponse({ responseId: response._id });
          toast.success("Application deleted");
        } catch (_error) {
          toast.error("Failed to delete application");
        }
      },
    });
  };

  const statusStyles: Record<ResponseStatus, string> = {
    pending: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    reviewed: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    accepted: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    rejected: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  };

  return (
    <TableRow className="group">
      <TableCell className="font-medium">
        <div className="flex items-center gap-3">
          <div className="bg-muted flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold uppercase">
            {response.applicantName.charAt(0)}
          </div>
          <span>{response.applicantName}</span>
        </div>
      </TableCell>
      <TableCell>{response.applicantEmail}</TableCell>
      <TableCell>
        {new Date(response.submittedAt).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })}
      </TableCell>
      <TableCell>
        <Select
          onValueChange={(v) => handleStatusChange(v as ResponseStatus)}
          value={response.status}
        >
          <SelectTrigger className="w-32">
            <Badge className={statusStyles[response.status]} variant="outline">
              {response.status.charAt(0).toUpperCase() +
                response.status.slice(1)}
            </Badge>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="reviewed">Reviewed</SelectItem>
            <SelectItem value="accepted">Accepted</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            nativeButton={false}
            render={
              <Link
                href={`/applications/${formId}/responses/response/${response._id}`}
              />
            }
            size="sm"
            variant="outline"
          >
            View
          </Button>
          <Button
            className="text-destructive"
            onClick={handleDelete}
            size="sm"
            variant="ghost"
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}
