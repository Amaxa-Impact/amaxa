import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { requireSiteAdmin } from "./permissions";

const MAX_SLOTS_PER_FORM = 15;

export const listSiteAdmins = query({
  args: {},
  returns: v.array(
    v.object({
      userId: v.string(),
      role: v.union(v.literal("admin"), v.literal("coach")),
    })
  ),
  handler: async (ctx) => {
    await requireSiteAdmin(ctx);

    const siteUsers = await ctx.db.query("siteUser").collect();

    console.log(siteUsers);

    return siteUsers
      .filter((user) => user.role === "admin")
      .map((user) => ({
        userId: user.userId,
        role: user.role,
      }));
  },
});
const SLOT_DURATION_MS = 30 * 60 * 1000; // 30 minutes

export const listByForm = query({
  args: {
    formId: v.id("applicationForms"),
  },
  returns: v.array(
    v.object({
      _id: v.id("interviewTimeSlots"),
      _creationTime: v.number(),
      formId: v.id("applicationForms"),
      startTime: v.number(),
      endTime: v.number(),
      timezone: v.string(),
      assignedAdminId: v.optional(v.string()),
      isBooked: v.boolean(),
      bookedByResponseId: v.optional(v.id("applicationResponses")),
      createdBy: v.string(),
      createdAt: v.number(),
    })
  ),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const slots = await ctx.db
      .query("interviewTimeSlots")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    return slots
      .map((slot) => ({
        ...slot,
        endTime: slot.startTime + SLOT_DURATION_MS,
      }))
      .sort((a, b) => a.startTime - b.startTime);
  },
});

export const listAvailableByToken = query({
  args: {
    token: v.string(),
  },
  returns: v.union(
    v.object({
      slots: v.array(
        v.object({
          _id: v.id("interviewTimeSlots"),
          startTime: v.number(),
          endTime: v.number(),
          timezone: v.string(),
          assignedAdminId: v.optional(v.string()),
        })
      ),
      applicantName: v.string(),
      formTitle: v.string(),
      alreadyBooked: v.boolean(),
      bookedSlot: v.optional(
        v.object({
          startTime: v.number(),
          endTime: v.number(),
          timezone: v.string(),
        })
      ),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    const tokenRecord = await ctx.db
      .query("schedulingTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!tokenRecord) {
      return null;
    }

    if (tokenRecord.expiresAt && tokenRecord.expiresAt < Date.now()) {
      return null;
    }

    const response = await ctx.db.get(tokenRecord.responseId);
    if (!response) {
      return null;
    }

    const form = await ctx.db.get(tokenRecord.formId);
    if (!form) {
      return null;
    }

    const existingBooking = await ctx.db
      .query("interviewTimeSlots")
      .withIndex("by_booked_response", (q) =>
        q.eq("bookedByResponseId", tokenRecord.responseId)
      )
      .unique();

    if (existingBooking) {
      return {
        slots: [],
        applicantName: response.applicantName,
        formTitle: form.title,
        alreadyBooked: true,
        bookedSlot: {
          startTime: existingBooking.startTime,
          endTime: existingBooking.startTime + SLOT_DURATION_MS,
          timezone: existingBooking.timezone,
        },
      };
    }

    const allSlots = await ctx.db
      .query("interviewTimeSlots")
      .withIndex("by_form_and_booked", (q) =>
        q.eq("formId", tokenRecord.formId).eq("isBooked", false)
      )
      .collect();

    const futureSlots = allSlots
      .filter((slot) => slot.startTime > Date.now())
      .map((slot) => ({
        _id: slot._id,
        startTime: slot.startTime,
        endTime: slot.startTime + SLOT_DURATION_MS,
        timezone: slot.timezone,
        assignedAdminId: slot.assignedAdminId,
      }))
      .sort((a, b) => a.startTime - b.startTime);

    return {
      slots: futureSlots,
      applicantName: response.applicantName,
      formTitle: form.title,
      alreadyBooked: false,
    };
  },
});

export const getBookedSlotByResponse = query({
  args: {
    responseId: v.id("applicationResponses"),
  },
  returns: v.union(
    v.object({
      _id: v.id("interviewTimeSlots"),
      startTime: v.number(),
      endTime: v.number(),
      timezone: v.string(),
      assignedAdminId: v.optional(v.string()),
    }),
    v.null()
  ),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const slot = await ctx.db
      .query("interviewTimeSlots")
      .withIndex("by_booked_response", (q) =>
        q.eq("bookedByResponseId", args.responseId)
      )
      .unique();

    if (!slot) {
      return null;
    }

    return {
      _id: slot._id,
      startTime: slot.startTime,
      endTime: slot.startTime + SLOT_DURATION_MS,
      timezone: slot.timezone,
      assignedAdminId: slot.assignedAdminId,
    };
  },
});

export const create = mutation({
  args: {
    formId: v.id("applicationForms"),
    startTime: v.number(),
    timezone: v.string(),
    assignedAdminId: v.optional(v.string()),
  },
  returns: v.id("interviewTimeSlots"),
  handler: async (ctx, args) => {
    const userId = await requireSiteAdmin(ctx);

    const form = await ctx.db.get(args.formId);
    if (!form) {
      throw new Error("Form not found");
    }

    const existingSlots = await ctx.db
      .query("interviewTimeSlots")
      .withIndex("by_form", (q) => q.eq("formId", args.formId))
      .collect();

    if (existingSlots.length >= MAX_SLOTS_PER_FORM) {
      throw new Error(
        `Maximum of ${MAX_SLOTS_PER_FORM} time slots allowed per form`
      );
    }

    const slotId = await ctx.db.insert("interviewTimeSlots", {
      formId: args.formId,
      startTime: args.startTime,
      timezone: args.timezone,
      assignedAdminId: args.assignedAdminId,
      isBooked: false,
      createdBy: userId,
      createdAt: Date.now(),
    });

    return slotId;
  },
});

export const update = mutation({
  args: {
    slotId: v.id("interviewTimeSlots"),
    startTime: v.optional(v.number()),
    timezone: v.optional(v.string()),
    assignedAdminId: v.optional(v.string()),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const slot = await ctx.db.get(args.slotId);
    if (!slot) {
      throw new Error("Time slot not found");
    }

    if (slot.isBooked) {
      throw new Error("Cannot update a booked time slot");
    }

    const { slotId, ...updates } = args;
    await ctx.db.patch(slotId, updates);
    return null;
  },
});

export const remove = mutation({
  args: {
    slotId: v.id("interviewTimeSlots"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const slot = await ctx.db.get(args.slotId);
    if (!slot) {
      throw new Error("Time slot not found");
    }

    if (slot.isBooked) {
      throw new Error("Cannot delete a booked time slot");
    }

    await ctx.db.delete(args.slotId);
    return null;
  },
});

export const book = mutation({
  args: {
    token: v.string(),
    slotId: v.id("interviewTimeSlots"),
  },
  returns: v.object({
    success: v.boolean(),
    message: v.string(),
  }),
  handler: async (ctx, args) => {
    const tokenRecord = await ctx.db
      .query("schedulingTokens")
      .withIndex("by_token", (q) => q.eq("token", args.token))
      .unique();

    if (!tokenRecord) {
      return { success: false, message: "Invalid scheduling link" };
    }

    if (tokenRecord.expiresAt && tokenRecord.expiresAt < Date.now()) {
      return { success: false, message: "This scheduling link has expired" };
    }

    const existingBooking = await ctx.db
      .query("interviewTimeSlots")
      .withIndex("by_booked_response", (q) =>
        q.eq("bookedByResponseId", tokenRecord.responseId)
      )
      .unique();

    if (existingBooking) {
      return {
        success: false,
        message: "You have already booked an interview slot",
      };
    }

    const slot = await ctx.db.get(args.slotId);
    if (!slot) {
      return { success: false, message: "Time slot not found" };
    }

    if (slot.formId !== tokenRecord.formId) {
      return { success: false, message: "Invalid time slot for this form" };
    }

    if (slot.isBooked) {
      return {
        success: false,
        message: "This time slot has already been booked",
      };
    }

    if (slot.startTime <= Date.now()) {
      return {
        success: false,
        message: "This time slot is no longer available",
      };
    }

    await ctx.db.patch(args.slotId, {
      isBooked: true,
      bookedByResponseId: tokenRecord.responseId,
    });

    return { success: true, message: "Interview scheduled successfully" };
  },
});

export const cancelBooking = mutation({
  args: {
    slotId: v.id("interviewTimeSlots"),
  },
  returns: v.null(),
  handler: async (ctx, args) => {
    await requireSiteAdmin(ctx);

    const slot = await ctx.db.get(args.slotId);
    if (!slot) {
      throw new Error("Time slot not found");
    }

    if (!slot.isBooked) {
      throw new Error("Time slot is not booked");
    }

    await ctx.db.patch(args.slotId, {
      isBooked: false,
      bookedByResponseId: undefined,
    });

    return null;
  },
});
