"use client";

import { useState } from "react";

import { statusValues, TaskStatus } from "@amaxa/db/schema";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";

import { showErrorToast } from "~/lib/handle-error";
import { api } from "~/trpc/react";

interface ChangeStatusProps {
  defaultValue: TaskStatus;
  id: string;
}

export function ChangeStatus({ defaultValue, id }: ChangeStatusProps) {
  const [value, setValue] = useState<TaskStatus>(defaultValue);
  const context = api.useUtils();
  const { mutate: update } = api.tasks.update.useMutation({
    onSuccess: () => {
      context.tasks.getProjectTasks.invalidate();
    },
    onError: (error) => {
      showErrorToast(error);
    },
  });

  function onSubmit(value: TaskStatus) {
    setValue(value);
    update({
      status: value,
      id: id,
    });
  }

  return (
    <Select onValueChange={onSubmit} value={value} defaultValue={value}>
      <SelectTrigger className="capitalize">
        <SelectValue placeholder="Select a priority" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {statusValues.map((item) => (
            <SelectItem key={item} value={item} className="capitalize">
              {item}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}
