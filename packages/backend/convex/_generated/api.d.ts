/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type * as applicationFormFields from "../applicationFormFields.js";
import type * as applicationForms from "../applicationForms.js";
import type * as applicationResponses from "../applicationResponses.js";
import type * as auth from "../auth.js";
import type * as dashboard from "../dashboard.js";
import type * as edges from "../edges.js";
import type * as emails_RejectionEmail from "../emails/RejectionEmail.js";
import type * as emails_SchedulingEmail from "../emails/SchedulingEmail.js";
import type * as graph from "../graph.js";
import type * as interviewTimeSlots from "../interviewTimeSlots.js";
import type * as migrations from "../migrations.js";
import type * as permissions from "../permissions.js";
import type * as presence from "../presence.js";
import type * as projects from "../projects.js";
import type * as reactFlowExample from "../reactFlowExample.js";
import type * as schedulingEmail from "../schedulingEmail.js";
import type * as schedulingInternal from "../schedulingInternal.js";
import type * as schedulingTokens from "../schedulingTokens.js";
import type * as tasks from "../tasks.js";
import type * as userToProjects from "../userToProjects.js";

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";

declare const fullApi: ApiFromModules<{
  applicationFormFields: typeof applicationFormFields;
  applicationForms: typeof applicationForms;
  applicationResponses: typeof applicationResponses;
  auth: typeof auth;
  dashboard: typeof dashboard;
  edges: typeof edges;
  "emails/RejectionEmail": typeof emails_RejectionEmail;
  "emails/SchedulingEmail": typeof emails_SchedulingEmail;
  graph: typeof graph;
  interviewTimeSlots: typeof interviewTimeSlots;
  migrations: typeof migrations;
  permissions: typeof permissions;
  presence: typeof presence;
  projects: typeof projects;
  reactFlowExample: typeof reactFlowExample;
  schedulingEmail: typeof schedulingEmail;
  schedulingInternal: typeof schedulingInternal;
  schedulingTokens: typeof schedulingTokens;
  tasks: typeof tasks;
  userToProjects: typeof userToProjects;
}>;

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;

export declare const components: {
  resend: {
    lib: {
      cancelEmail: FunctionReference<
        "mutation",
        "internal",
        { emailId: string },
        null
      >;
      cleanupAbandonedEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      cleanupOldEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      createManualEmail: FunctionReference<
        "mutation",
        "internal",
        {
          from: string;
          headers?: Array<{ name: string; value: string }>;
          replyTo?: Array<string>;
          subject: string;
          to: Array<string> | string;
        },
        string
      >;
      get: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          bcc?: Array<string>;
          bounced?: boolean;
          cc?: Array<string>;
          clicked?: boolean;
          complained: boolean;
          createdAt: number;
          deliveryDelayed?: boolean;
          errorMessage?: string;
          failed?: boolean;
          finalizedAt: number;
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          opened: boolean;
          replyTo: Array<string>;
          resendId?: string;
          segment: number;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
          subject?: string;
          template?: {
            id: string;
            variables?: Record<string, string | number>;
          };
          text?: string;
          to: Array<string>;
        } | null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          bounced: boolean;
          clicked: boolean;
          complained: boolean;
          deliveryDelayed: boolean;
          errorMessage: string | null;
          failed: boolean;
          opened: boolean;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
        } | null
      >;
      handleEmailEvent: FunctionReference<
        "mutation",
        "internal",
        { event: any },
        null
      >;
      sendEmail: FunctionReference<
        "mutation",
        "internal",
        {
          bcc?: Array<string>;
          cc?: Array<string>;
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          options: {
            apiKey: string;
            initialBackoffMs: number;
            onEmailEvent?: { fnHandle: string };
            retryAttempts: number;
            testMode: boolean;
          };
          replyTo?: Array<string>;
          subject?: string;
          template?: {
            id: string;
            variables?: Record<string, string | number>;
          };
          text?: string;
          to: Array<string>;
        },
        string
      >;
      updateManualEmail: FunctionReference<
        "mutation",
        "internal",
        {
          emailId: string;
          errorMessage?: string;
          resendId?: string;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
        },
        null
      >;
    };
  };
};
