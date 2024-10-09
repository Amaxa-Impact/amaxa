"use client";

import type { NodeProps } from "@xyflow/react";
import React, { memo } from "react";
import { Handle, Position } from "@xyflow/react";

import type { TaskStatus } from "@amaxa/db/schema";
import { Button } from "@amaxa/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@amaxa/ui/card";
import { Input } from "@amaxa/ui/input";
import { Label } from "@amaxa/ui/label";
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

const getCardClassName = (status: string) => {
  switch (status) {
    case "done":
      return "border-green-600 bg-green-200 text-gray-700";
    case "unable-to-complete":
      return "border-red-600 bg-red-100 text-gray-600";
    default:
      return "dark:bg-zinc-700";
  }
};

const TaskNode = ({ data, isConnectable }: NodeProps<NodeType>) => {
  const [isEdit, setIsEdit] = React.useState(false);
  /* const authorInitials =
    data.assigne.name
      ?.split(" ")
      .map((n) => n[0])
      .join("") ?? "S";
      */

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
          style={{
            left: "-4px",
            top: "50%",
            height: "20px",
            width: "1px",
            transform: "translateY(-50%)",
          }}
        />
        <Card
          className={`${getCardClassName(data.status)} min-w-[250px]`}
          onDoubleClick={() => setIsEdit(true)}
        >
          <CardHeader>
            <CardTitle className="flex flex-row items-center gap-2">
              <p className="text-2xl">{data.title}</p>
            </CardTitle>
          </CardHeader>
        </Card>
        <Handle
          type="source"
          position={Position.Right}
          isConnectable={isConnectable}
          style={{
            right: "-4px",
            top: "50%",
            height: "20px",
            width: "1px",
            transform: "translateY(-50%)",
          }}
        />
      </div>
    );
  } else {
    return (
      <Card className="h-min-[200px] w-[400px]">
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
