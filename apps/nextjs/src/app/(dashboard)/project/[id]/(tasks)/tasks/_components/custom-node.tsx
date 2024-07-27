"use client";

import type { NodeProps } from "@xyflow/react";
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

import type { TaskStatus } from "@amaxa/db/schema";
import { Avatar, AvatarFallback } from "@amaxa/ui/avatar";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import { Input } from "@amaxa/ui/input";
import { Label } from "@amaxa/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@amaxa/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";
import { Textarea } from "@amaxa/ui/textarea";

import type { NodeType } from "~/lib/types/flowcart";
import useStore from "~/lib/store";
import { ChangeStatus } from "./change-status";

const getCardClassName = (status: string) => {
  switch (status) {
    case "done":
      return "border-green-600 bg-green-200 text-gray-700";
    case "unable-to-complete":
      return "border-red-600 bg-red-100 text-gray-600";
    default:
      return null;
  }
};

const TaskNode = ({ data, isConnectable }: NodeProps<NodeType>) => {
  const [isEdit, setIsEdit] = React.useState(false);
  const authorInitials =
    data.assigne.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") ?? "S";

  const changeNode = useStore((state) => state.changeNode);
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const updatedData = {
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      status: formData.get("status") as TaskStatus,
    };
    changeNode(data.id, updatedData);
    setIsEdit(false);
  };

  if (!isEdit) {
    return (
      <div className="relative">
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
          style={{ left: "-8px", top: "50%", transform: "translateY(-50%)" }}
        />
        <Card className={`${getCardClassName(data.status)} min-w-[200px]`}>
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <p>{data.title}</p>
              <p>&#8226;</p>
              <Popover>
                <PopoverTrigger>
                  <Avatar>
                    <AvatarFallback>{authorInitials}</AvatarFallback>
                  </Avatar>
                </PopoverTrigger>
                <PopoverContent className="flex flex-col">
                  <div className="flex flex-row items-center gap-4">
                    <Avatar>
                      <AvatarFallback>{authorInitials}</AvatarFallback>
                    </Avatar>
                    <p className="text-xl font-bold">
                      {data.assigne.name ?? "System"}
                    </p>
                  </div>
                </PopoverContent>
              </Popover>
            </CardTitle>
          </CardHeader>
          <CardContent className="flex w-full flex-col gap-3">
            <ChangeStatus id={data.id} defaultValue={data.status} />
            <Button onClick={() => setIsEdit(true)}>Edit</Button>
          </CardContent>
        </Card>
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          style={{ right: "-8px", top: "50%", transform: "translateY(-50%)" }}
        />
      </div>
    );
  } else {
    return (
      <Card className="w-min-[400px] h-min-[200px]">
        <CardHeader>
          <CardTitle>Edit Task</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input id="title" name="title" defaultValue={data.title} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  defaultValue={data.description}
                />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <Select name="status" defaultValue={data.status}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todo">To Do</SelectItem>
                    <SelectItem value="in-progress">In Progress</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                    <SelectItem value="unable-to-complete">
                      Unable to Complete
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Assignee TODO: a select of user id's */}
              <div className="flex justify-between">
                <Button type="submit">Save</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEdit(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    );
  }
};

export default memo(TaskNode);
