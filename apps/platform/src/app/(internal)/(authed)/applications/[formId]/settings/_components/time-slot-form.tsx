/** biome-ignore-all lint/correctness/noChildrenProp: TanStack Form uses children prop pattern */
"use client";

import { useState } from "react";
import {
  getDefaultTimezone,
  TimezoneSelect,
} from "@/components/scheduling/timezone-select";
import { useForm } from "@tanstack/react-form";
import { useMutation } from "convex/react";
import { format } from "date-fns";
import { toast } from "sonner";

import type { Id } from "@amaxa/backend/_generated/dataModel";
import { api } from "@amaxa/backend/_generated/api";
import { cn } from "@amaxa/ui";
import { Button } from "@amaxa/ui/button";
import { Calendar } from "@amaxa/ui/calendar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@amaxa/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@amaxa/ui/field";
import { Input } from "@amaxa/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@amaxa/ui/popover";

import { AdminSelector } from "./admin-selector";

interface TimeSlotFormProps {
  formId: Id<"applicationForms">;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingSlot?: {
    _id: Id<"interviewTimeSlots">;
    startTime: number;
    timezone: string;
    assignedAdminId?: string;
  };
}

export function TimeSlotForm({
  formId,
  open,
  onOpenChange,
  editingSlot,
}: TimeSlotFormProps) {
  const createSlot = useMutation(api.interviewTimeSlots.create);
  const updateSlot = useMutation(api.interviewTimeSlots.update);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const isEditing = !!editingSlot;

  const getDefaultValues = () => {
    if (editingSlot) {
      const date = new Date(editingSlot.startTime);
      return {
        date,
        time: format(date, "HH:mm"),
        timezone: editingSlot.timezone,
        assignedAdminId: editingSlot.assignedAdminId ?? "",
      };
    }
    return {
      date: null as Date | null,
      time: "",
      timezone: getDefaultTimezone(),
      assignedAdminId: "",
    };
  };

  const form = useForm({
    defaultValues: getDefaultValues(),
    onSubmit: async ({ value }) => {
      if (!value.date) {
        toast.error("Please select a date");
        return;
      }

      if (!value.time) {
        toast.error("Please enter a time");
        return;
      }

      try {
        const [hours, minutes] = value.time.split(":").map(Number);
        const dateInTimezone = new Date(value.date);
        if (!hours || !minutes) {
          toast.error("Please enter a valid time");
          return;
        }
        dateInTimezone.setHours(hours, minutes, 0, 0);

        const startTime = dateInTimezone.getTime();

        if (editingSlot) {
          await updateSlot({
            slotId: editingSlot._id,
            startTime,
            timezone: value.timezone,
            assignedAdminId: value.assignedAdminId || undefined,
          });
          toast.success("Time slot updated");
        } else {
          await createSlot({
            formId,
            startTime,
            timezone: value.timezone,
            assignedAdminId: value.assignedAdminId || undefined,
          });
          toast.success("Time slot created");
        }

        form.reset();
        onOpenChange(false);
      } catch (error) {
        toast.error(
          isEditing
            ? "Failed to update time slot"
            : "Failed to create time slot",
          {
            description:
              error instanceof Error ? error.message : "An error occurred",
          },
        );
      }
    },
  });

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Time Slot" : "Add Time Slot"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update the interview time slot details."
              : "Create a new 30-minute interview time slot."}
          </DialogDescription>
        </DialogHeader>

        <div id="time-slot-form">
          <FieldGroup>
            <form.Field name="date">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.value;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel>Date</FieldLabel>
                    <Popover onOpenChange={setCalendarOpen} open={calendarOpen}>
                      <PopoverTrigger
                        className={cn(
                          "border-input bg-input/20 flex h-9 w-full items-center justify-start rounded-md border px-3 py-2 text-left text-sm",
                          !field.state.value && "text-muted-foreground",
                        )}
                      >
                        {field.state.value ? (
                          format(field.state.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </PopoverTrigger>
                      <PopoverContent align="start" className="w-auto p-0">
                        <Calendar
                          disabled={(date) => date < new Date()}
                          mode="single"
                          onSelect={(date) => {
                            field.handleChange(date ?? null);
                            setCalendarOpen(false);
                          }}
                          selected={field.state.value ?? undefined}
                        />
                      </PopoverContent>
                    </Popover>
                    <FieldDescription>
                      Select the date for this interview slot.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError
                        errors={[{ message: "Please select a date" }]}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="time">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.value;

                return (
                  <Field data-invalid={isInvalid}>
                    <FieldLabel htmlFor="time-slot-time">Time</FieldLabel>
                    <Input
                      id="time-slot-time"
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      type="time"
                      value={field.state.value}
                    />
                    <FieldDescription>
                      Start time for the 30-minute interview slot.
                    </FieldDescription>
                    {isInvalid && (
                      <FieldError
                        errors={[{ message: "Please enter a time" }]}
                      />
                    )}
                  </Field>
                );
              }}
            </form.Field>

            <form.Field name="timezone">
              {(field) => (
                <Field>
                  <FieldLabel>Timezone</FieldLabel>
                  <TimezoneSelect
                    className="w-full"
                    onValueChange={field.handleChange}
                    value={field.state.value}
                  />
                  <FieldDescription>
                    The timezone for this interview slot.
                  </FieldDescription>
                </Field>
              )}
            </form.Field>

            <form.Field name="assignedAdminId">
              {(field) => (
                <Field>
                  <FieldLabel>Assigned Admin (Optional)</FieldLabel>
                  <AdminSelector
                    className="w-full"
                    onValueChange={field.handleChange}
                    value={field.state.value}
                  />
                  <FieldDescription>
                    Optionally assign a site admin to conduct this interview.
                  </FieldDescription>
                </Field>
              )}
            </form.Field>
          </FieldGroup>
        </div>

        <DialogFooter>
          <Button
            onClick={() => {
              form.reset();
              onOpenChange(false);
            }}
            type="button"
            variant="outline"
          >
            Cancel
          </Button>
          <Button onClick={() => void form.handleSubmit()} type="button">
            {isEditing ? "Update Slot" : "Create Slot"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
