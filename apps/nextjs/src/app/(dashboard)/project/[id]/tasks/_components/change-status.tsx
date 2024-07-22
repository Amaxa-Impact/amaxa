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
import useStore from '~/lib/store';

interface ChangeStatusProps {
  defaultValue: TaskStatus;
  id: string;
}

export function ChangeStatus({ defaultValue, id }: ChangeStatusProps) {
  const [value, setValue] = useState<TaskStatus>(defaultValue);
  const changeNode = useStore(state => state.changeNode);

  function onSubmit(newValue: TaskStatus) {
    setValue(newValue);
    changeNode(id, { status: newValue });
  }

  return (
    <Select onValueChange={onSubmit} value={value} defaultValue={value}>
      <SelectTrigger className="capitalize">
        <SelectValue placeholder="Select a status" />
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
