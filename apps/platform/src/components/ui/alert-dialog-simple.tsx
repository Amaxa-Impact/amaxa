"use client";

import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface AlertDialogOptions {
  title: string;
  description: string;
  buttonText?: string;
  variant?: "default" | "destructive";
}

interface AlertDialogState extends AlertDialogOptions {
  open: boolean;
}

const alertDialogState: AlertDialogState | null = null;
let setAlertDialogState: ((state: AlertDialogState | null) => void) | null =
  null;

export function AlertDialogProvider() {
  const [state, setState] = useState<AlertDialogState | null>(null);
  setAlertDialogState = setState;

  if (!state) {
    return null;
  }

  const handleClose = () => {
    setState(null);
  };

  return (
    <AlertDialog
      onOpenChange={(open) => !open && handleClose()}
      open={state.open}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{state.title}</AlertDialogTitle>
          <AlertDialogDescription>{state.description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogAction
            className={
              state.variant === "destructive"
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : ""
            }
            onClick={handleClose}
          >
            {state.buttonText || "OK"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function alertDialog(options: AlertDialogOptions) {
  if (setAlertDialogState) {
    setAlertDialogState({
      ...options,
      open: true,
    });
  } else {
    // biome-ignore lint/suspicious/noAlert: fallback
    window.alert(`${options.title}\n\n${options.description}`);
  }
}
