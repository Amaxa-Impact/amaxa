import React from "react";

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

export default function EditNode(props: {
  setIsEdit: React.Dispatch<React.SetStateAction<boolean>>;
  changeNode: (
    id: string,
    data: { title: string; description: string; status: TaskStatus },
  ) => void;
  data: {
    id: string;
    title: string;
    description: string;
    status: TaskStatus;
  };
}) {
  const { setIsEdit, data, changeNode } = props;
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
