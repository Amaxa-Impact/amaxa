"use client";

import { IconPlus } from "@tabler/icons-react";
import { useQuery } from "convex/react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import { TimeSlotForm } from "./_components/time-slot-form";
import { TimeSlotList } from "./_components/time-slot-list";

const MAX_SLOTS = 15;

interface SchedulingSettingsProps {
  formId: Id<"applicationForms">;
}

interface EditingSlot {
  _id: Id<"interviewTimeSlots">;
  startTime: number;
  timezone: string;
  assignedAdminId?: string;
}

export function SchedulingSettings({ formId }: SchedulingSettingsProps) {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<EditingSlot | undefined>();

  const slots = useQuery(api.interviewTimeSlots.listByForm, { formId });
  const slotCount = slots?.length ?? 0;
  const canAddMore = slotCount < MAX_SLOTS;

  const handleEdit = (slot: EditingSlot) => {
    setEditingSlot(slot);
    setIsFormOpen(true);
  };

  const handleFormClose = (open: boolean) => {
    setIsFormOpen(open);
    if (!open) {
      setEditingSlot(undefined);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex-1 space-y-1">
          <h3 className="font-semibold">Interview Time Slots</h3>
          <p className="text-muted-foreground text-sm">
            Create up to {MAX_SLOTS} available time slots for interviews.
          </p>
        </div>
        <Button
          disabled={!canAddMore}
          onClick={() => setIsFormOpen(true)}
          size="sm"
        >
          <IconPlus className="mr-1.5 size-4" />
          Add Slot
        </Button>
      </div>

      {slotCount > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Slots used</span>
            <span className="font-medium">{slotCount} / {MAX_SLOTS}</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all"
              style={{ width: `${(slotCount / MAX_SLOTS) * 100}%` }}
            />
          </div>
        </div>
      )}

      <TimeSlotList formId={formId} onEdit={handleEdit} />

      <TimeSlotForm
        editingSlot={editingSlot}
        formId={formId}
        onOpenChange={handleFormClose}
        open={isFormOpen}
      />
    </div>
  );
}
