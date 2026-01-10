"use client";

import { IconEdit, IconTrash, IconCheck, IconClock, IconCalendarPlus } from "@tabler/icons-react";
import { useMutation, useQuery } from "convex/react";
import { format } from "date-fns";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getUserDisplayName,
  type UserOption,
} from "@/components/ui/user-dropdown";
import { api } from "@/convex/_generated/api";
import type { Id } from "@/convex/_generated/dataModel";
import type { User } from "@/lib/workos";

interface TimeSlot {
  _id: Id<"interviewTimeSlots">;
  startTime: number;
  endTime: number;
  timezone: string;
  assignedAdminId?: string;
  isBooked: boolean;
}

interface TimeSlotListProps {
  formId: Id<"applicationForms">;
  onEdit: (slot: TimeSlot) => void;
}

export function TimeSlotList({ formId, onEdit }: TimeSlotListProps) {
  const slots = useQuery(api.interviewTimeSlots.listByForm, { formId });
  const deleteSlot = useMutation(api.interviewTimeSlots.remove);
  const [allUsers, setAllUsers] = useState<User>([]);
  const [deletingSlotId, setDeletingSlotId] =
    useState<Id<"interviewTimeSlots"> | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch("/api/users");
        if (response.ok) {
          const data = await response.json();
          // API returns array directly, not { users: [...] }
          setAllUsers(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };
    fetchUsers();
  }, []);

  const getAdminName = (adminId?: string) => {
    if (!adminId) {
      return "—";
    }
    const user = allUsers.find((u) => u.id === adminId);
    return user ? getUserDisplayName(user as UserOption) : adminId;
  };

  const handleDelete = async () => {
    if (!deletingSlotId) {
      return;
    }

    try {
      await deleteSlot({ slotId: deletingSlotId });
      toast.success("Time slot deleted");
    } catch (error) {
      toast.error("Failed to delete time slot", {
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setDeletingSlotId(null);
    }
  };

  if (!slots) {
    return (
      <div className="space-y-2">
        {[1, 2, 3].map((i) => (
          <div className="h-12 animate-pulse rounded-md bg-muted" key={i} />
        ))}
      </div>
    );
  }

  if (slots.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 text-center">
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-muted">
          <IconCalendarPlus className="h-6 w-6 text-muted-foreground" />
        </div>
        <h3 className="mb-1 font-medium">No time slots yet</h3>
        <p className="mb-4 text-muted-foreground text-sm">
          Add your first interview slot to get started.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date & Time</TableHead>
              <TableHead>Timezone</TableHead>
              <TableHead>Assigned Admin</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {slots.map((slot) => (
              <TableRow key={slot._id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 flex-col items-center justify-center rounded-lg bg-muted">
                      <span className="text-[10px] font-medium uppercase text-muted-foreground">
                        {format(new Date(slot.startTime), "MMM")}
                      </span>
                      <span className="font-bold text-sm leading-none">
                        {format(new Date(slot.startTime), "d")}
                      </span>
                    </div>
                    <div>
                      <span className="font-medium">
                        {format(new Date(slot.startTime), "EEEE")}
                      </span>
                      <span className="block text-muted-foreground text-xs">
                        {format(new Date(slot.startTime), "h:mm a")} - {format(new Date(slot.endTime), "h:mm a")}
                      </span>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <span className="text-muted-foreground text-sm">
                    {slot.timezone}
                  </span>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {getAdminName(slot.assignedAdminId)}
                  </span>
                </TableCell>
                <TableCell>
                  {slot.isBooked ? (
                    <Badge className="gap-1.5" variant="secondary">
                      <IconCheck className="h-3 w-3" />
                      Booked
                    </Badge>
                  ) : (
                    <Badge className="gap-1.5" variant="outline">
                      <IconClock className="h-3 w-3" />
                      Available
                    </Badge>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1">
                    <Button
                      disabled={slot.isBooked}
                      onClick={() => onEdit(slot)}
                      size="icon"
                      title={
                        slot.isBooked ? "Cannot edit booked slot" : "Edit slot"
                      }
                      variant="ghost"
                    >
                      <IconEdit className="size-4" />
                    </Button>
                    <Button
                      disabled={slot.isBooked}
                      onClick={() => setDeletingSlotId(slot._id)}
                      size="icon"
                      title={
                        slot.isBooked
                          ? "Cannot delete booked slot"
                          : "Delete slot"
                      }
                      variant="ghost"
                    >
                      <IconTrash className="size-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AlertDialog
        onOpenChange={() => setDeletingSlotId(null)}
        open={!!deletingSlotId}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Time Slot</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this time slot? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
