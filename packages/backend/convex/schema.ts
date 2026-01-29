import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  siteUser: defineTable({
    userId: v.string(),
    role: v.union(v.literal("admin"), v.literal("coach")),
  }).index("by_userId", ["userId"]),

  workspaces: defineTable({
    name: v.string(),
    slug: v.string(),
    createdBy: v.string(),
    createdAt: v.number(),
    deletedAt: v.optional(v.number()),
  })
    .index("by_slug", ["slug"])
    .index("by_createdBy", ["createdBy"]),

  workspaceToUser: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.string(),
    role: v.union(v.literal("owner"), v.literal("admin"), v.literal("member")),
  })
    .index("by_userId", ["userId"])
    .index("by_workspaceId", ["workspaceId"])
    .index("by_userId_and_workspaceId", ["userId", "workspaceId"])
    .index("by_workspaceId_and_role", ["workspaceId", "role"]),

  workspaceInvitations: defineTable({
    workspaceId: v.id("workspaces"),
    email: v.string(),
    role: v.union(v.literal("admin"), v.literal("member")),
    invitedBy: v.string(),
    createdAt: v.number(),
    expiresAt: v.number(),
    token: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("accepted"),
      v.literal("expired"),
      v.literal("revoked"),
    ),
  })
    .index("by_email", ["email"])
    .index("by_workspaceId", ["workspaceId"])
    .index("by_email_and_workspaceId", ["email", "workspaceId"])
    .index("by_token", ["token"])
    .index("by_status", ["status"]),

  projects: defineTable({
    name: v.string(),
    description: v.string(),
    // TODO: Migrate to v.id("workspaces") - requires data migration for existing records
    workspaceId: v.string(),
  }).index("by_workspaceId", ["workspaceId"]),

  tasks: defineTable({
    projectId: v.id("projects"),
    label: v.optional(v.string()),
    description: v.optional(v.string()),
    status: v.optional(
      v.union(
        v.literal("todo"),
        v.literal("in_progress"),
        v.literal("completed"),
        v.literal("blocked"),
      ),
    ),
    assignedTo: v.optional(v.string()),
    dueDate: v.optional(v.number()),
    priority: v.optional(
      v.union(v.literal("low"), v.literal("medium"), v.literal("high")),
    ),
    // Legacy fields - task data now stored in separate fields above
    data: v.optional(
      v.object({
        label: v.optional(v.string()),
        description: v.optional(v.string()),
        status: v.optional(v.string()),
        assignedTo: v.optional(v.string()),
        dueDate: v.optional(v.number()),
        priority: v.optional(v.string()),
      }),
    ),
    position: v.optional(
      v.object({
        x: v.number(),
        y: v.number(),
      }),
    ),
    type: v.optional(v.string()),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    style: v.optional(
      v.object({
        backgroundColor: v.optional(v.string()),
        borderColor: v.optional(v.string()),
        color: v.optional(v.string()),
      }),
    ),
    selected: v.optional(v.boolean()),
    dragging: v.optional(v.boolean()),
  })
    .index("by_project", ["projectId"])
    .index("by_project_and_status", ["projectId", "status"])
    .index("by_project_and_assignedTo", ["projectId", "assignedTo"]),

  taskNodes: defineTable({
    taskId: v.id("tasks"),
    projectId: v.id("projects"),
    type: v.string(),
    position: v.object({
      x: v.number(),
      y: v.number(),
    }),
    width: v.optional(v.number()),
    height: v.optional(v.number()),
    style: v.optional(
      v.object({
        backgroundColor: v.optional(v.string()),
        borderColor: v.optional(v.string()),
        color: v.optional(v.string()),
      }),
    ),
  })
    .index("by_task", ["taskId"])
    .index("by_project", ["projectId"]),

  edges: defineTable({
    projectId: v.id("projects"),
    source: v.id("tasks"),
    target: v.id("tasks"),
    type: v.string(),
    sourceHandle: v.optional(v.string()),
    targetHandle: v.optional(v.string()),
    label: v.optional(v.string()),
    style: v.optional(
      v.object({
        stroke: v.optional(v.string()),
        strokeWidth: v.optional(v.number()),
      }),
    ),
    animated: v.optional(v.boolean()),
  })
    .index("by_project", ["projectId"])
    .index("by_source", ["source"])
    .index("by_target", ["target"])
    .index("by_project_and_source", ["projectId", "source"]),

  userToProject: defineTable({
    workspaceId: v.id("workspaces"),
    userId: v.string(),
    projectId: v.id("projects"),
    role: v.union(v.literal("coach"), v.literal("member")),
  })
    .index("by_userId", ["userId"])
    .index("by_projectId", ["projectId"])
    .index("by_userId_and_projectId", ["userId", "projectId"])
    .index("by_projectId_and_role", ["projectId", "role"]),

  applicationForms: defineTable({
    title: v.string(),
    description: v.optional(v.string()),
    isPublished: v.boolean(),
    slug: v.string(),
    createdBy: v.string(),
  })
    .index("by_slug", ["slug"])
    .index("by_published", ["isPublished"]),

  applicationFormSections: defineTable({
    formId: v.id("applicationForms"),
    title: v.string(),
    description: v.optional(v.string()),
    order: v.number(),
    condition: v.optional(
      v.object({
        sourceFieldId: v.id("applicationFormFields"),
        operator: v.union(
          v.literal("equals"),
          v.literal("notEquals"),
          v.literal("contains"),
        ),
        value: v.union(v.string(), v.array(v.string())),
      }),
    ),
  })
    .index("by_form", ["formId"])
    .index("by_form_and_order", ["formId", "order"]),

  applicationFormFields: defineTable({
    formId: v.id("applicationForms"),
    sectionId: v.optional(v.id("applicationFormSections")),
    label: v.string(),
    description: v.optional(v.string()),
    type: v.union(
      v.literal("text"),
      v.literal("textarea"),
      v.literal("number"),
      v.literal("select"),
      v.literal("multiselect"),
      v.literal("file"),
    ),
    required: v.boolean(),
    order: v.number(),
    options: v.optional(v.array(v.string())),
    min: v.optional(v.number()),
    max: v.optional(v.number()),
    fileConfig: v.optional(
      v.object({
        maxSizeBytes: v.number(),
        allowedMimeTypes: v.array(v.string()),
        maxFiles: v.optional(v.number()),
      }),
    ),
    condition: v.optional(
      v.object({
        sourceFieldId: v.id("applicationFormFields"),
        operator: v.union(
          v.literal("equals"),
          v.literal("notEquals"),
          v.literal("contains"),
        ),
        value: v.union(v.string(), v.array(v.string())),
      }),
    ),
  })
    .index("by_form", ["formId"])
    .index("by_form_and_order", ["formId", "order"])
    .index("by_section", ["sectionId"]),

  applicationResponses: defineTable({
    formId: v.id("applicationForms"),
    submittedAt: v.number(),
    applicantEmail: v.string(),
    applicantName: v.string(),
    status: v.union(
      v.literal("pending"),
      v.literal("reviewed"),
      v.literal("accepted"),
      v.literal("rejected"),
    ),
  })
    .index("by_form", ["formId"])
    .index("by_form_and_status", ["formId", "status"])
    .index("by_email", ["applicantEmail"]),

  applicationFieldResponses: defineTable({
    responseId: v.id("applicationResponses"),
    fieldId: v.id("applicationFormFields"),
    value: v.union(
      v.string(),
      v.array(v.string()),
      v.object({
        type: v.literal("file"),
        files: v.array(
          v.object({
            blobId: v.string(),
            path: v.string(),
            filename: v.string(),
            contentType: v.string(),
            sizeBytes: v.number(),
          }),
        ),
      }),
    ),
  })
    .index("by_response", ["responseId"])
    .index("by_fieldId", ["fieldId"]),

  interviewTimeSlots: defineTable({
    formId: v.id("applicationForms"),
    startTime: v.number(),
    timezone: v.string(),
    assignedAdminId: v.optional(v.string()),
    isBooked: v.boolean(),
    bookedByResponseId: v.optional(v.id("applicationResponses")),
    createdBy: v.string(),
    createdAt: v.number(),
  })
    .index("by_form", ["formId"])
    .index("by_form_and_booked", ["formId", "isBooked"])
    .index("by_booked_response", ["bookedByResponseId"]),

  schedulingTokens: defineTable({
    responseId: v.id("applicationResponses"),
    formId: v.id("applicationForms"),
    token: v.string(),
    expiresAt: v.optional(v.number()),
    emailSentAt: v.optional(v.number()),
    createdAt: v.number(),
  })
    .index("by_token", ["token"])
    .index("by_response", ["responseId"]),

  presence: defineTable({
    room: v.string(),
    user: v.string(),
    data: v.object({
      x: v.optional(v.number()),
      y: v.optional(v.number()),
      cursor: v.optional(
        v.object({
          x: v.number(),
          y: v.number(),
        }),
      ),
      selection: v.optional(v.array(v.string())),
      name: v.optional(v.string()),
      color: v.optional(v.string()),
      emoji: v.optional(v.string()),
    }),
    created: v.number(),
    latestJoin: v.number(),
    updated: v.number(),
  })
    .index("by_room", ["room"])
    .index("by_room_and_user", ["room", "user"]),

  rateLimits: defineTable({
    userId: v.string(),
    action: v.string(),
    count: v.number(),
    windowStart: v.number(),
  }).index("by_userId_and_action", ["userId", "action"]),
});
