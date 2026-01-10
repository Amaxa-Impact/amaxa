"use client";

import { useState } from "react";
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

interface ConfirmDialogOptions {
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  onConfirm: () => void | Promise<void>;
}

interface ConfirmDialogState extends ConfirmDialogOptions {
  open: boolean;
}

let setConfirmDialogState: ((state: ConfirmDialogState | null) => void) | null =
  null;

export function ConfirmDialogProvider() {
  const [state, setState] = useState<ConfirmDialogState | null>(null);
  setConfirmDialogState = setState;

  if (!state) {
    return null;
  }

  const handleConfirm = async () => {
    await state.onConfirm();
    setState(null);
  };

  const handleCancel = () => {
    setState(null);
  };

  return (
    <AlertDialog
      onOpenChange={(open) => !open && handleCancel()}
      open={state.open}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state.title}</AlertDialogTitle>
          <AlertDialogDescription>{state.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleCancel}>
            {state.cancelText || "Cancel"}
          </AlertDialogCancel>
          <AlertDialogAction
            className={
              state.variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
            onClick={handleConfirm}
          >
            {state.confirmText || "Confirm"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function confirmDialog(options: ConfirmDialogOptions) {
  if (setConfirmDialogState) {
    setConfirmDialogState({
      ...options,
      open: true,
    });
  } else if (window.confirm(`${options.title}\n\n${options.description}`)) {
    // biome-ignore lint/suspicious/noAlert: fallback
    options.onConfirm();
  }
}
