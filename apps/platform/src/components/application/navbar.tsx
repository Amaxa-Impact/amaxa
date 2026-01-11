"use client";

import Link from "next/link";
import { IconArrowLeft, IconEye, IconFileText } from "@tabler/icons-react";
import { useQuery } from "convex/react";

import { api } from "@amaxa/backend/_generated/api";
import { Badge } from "@amaxa/ui/badge";
import { Button } from "@amaxa/ui/button";
import { Tabs, TabsList, TabsTab } from "@amaxa/ui/route-tabs";

import { useApplicationForm } from "./context";

export function ApplicationNavbar({ id }: { id: string }) {
  const form = useApplicationForm();
  const responses = useQuery(api.applicationResponses.list, {
    formId: form._id,
  });

  const responseCount = responses?.length ?? 0;

  return (
    <header className="border-border/50 bg-background/95 supports-[backdrop-filter]:bg-background/80 sticky top-0 z-20 w-full border-b backdrop-blur-md">
      {/* Subtle top gradient accent */}
      <div className="via-primary/50 absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent to-transparent" />

      <div className="container mx-auto px-6 py-4">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          {/* Left section: Back button + Title + Metadata */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-3">
              <Link href="/applications">
                <Button
                  className="group text-muted-foreground hover:text-foreground -ml-2 gap-2 transition-colors"
                  size="sm"
                  variant="ghost"
                >
                  <IconArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
                  <span className="hidden sm:inline">Applications</span>
                </Button>
              </Link>

              <div className="bg-border h-4 w-px" />

              <div className="flex items-center gap-2">
                <IconFileText className="text-muted-foreground h-5 w-5" />
                <h1 className="text-lg font-semibold tracking-tight">
                  {form.title}
                </h1>
              </div>
            </div>

            {/* Metadata row */}
            <div className="flex items-center gap-3 pl-2">
              {/* Status Badge */}
              <div className="relative">
                <Badge
                  className="gap-1.5 font-medium"
                  variant={form.isPublished ? "default" : "secondary"}
                >
                  {form.isPublished && (
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />
                  )}
                  {form.isPublished ? "Published" : "Draft"}
                </Badge>
              </div>

              {/* Response Count */}
              <div className="bg-muted/50 flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs">
                <div className="bg-primary h-1 w-1 rounded-full" />
                <span className="font-medium tabular-nums">
                  {responseCount}
                </span>
                <span className="text-muted-foreground">
                  {responseCount === 1 ? "response" : "responses"}
                </span>
              </div>

              {/* View Form Link */}
              {form.isPublished && (
                <Link
                  className="group text-muted-foreground hover:text-primary flex items-center gap-1.5 text-xs transition-colors"
                  href={`/apply/${form.slug}`}
                  target="_blank"
                >
                  <IconEye className="h-3.5 w-3.5" />
                  <span className="font-medium">View live form</span>
                  <svg
                    className="h-3 w-3 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    />
                  </svg>
                </Link>
              )}
            </div>
          </div>

          {/* Right section: Navigation Tabs */}
          <div className="flex items-center">
            <Tabs>
              <TabsList className="bg-muted/30" variant="default">
                <TabsTab href={`/applications/${id}/edit`}>Edit</TabsTab>
                <TabsTab href={`/applications/${id}/responses`}>
                  Responses
                </TabsTab>
                <TabsTab href={`/applications/${id}/scheduling`}>
                  Scheduling
                </TabsTab>

                <TabsTab href={`/applications/${id}/settings`}>
                  Settings
                </TabsTab>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>
    </header>
  );
}
