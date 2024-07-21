"use client";

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import type { CreateProjectSchema } from "@amaxa/db/schema";
import { createProjectSchema } from "@amaxa/db/schema";
import { Button } from "@amaxa/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amaxa/ui/dialog";
import { Form } from "@amaxa/ui/form";
import { toast } from "@amaxa/ui/toast";

import { api } from "~/trpc/react";

export default function CreateProjectDialog() {
  const { mutate: create } = api.projects.create.useMutation({
    onSuccess: () => {
      toast.success("Project created");
    },
  });
  const form = useForm<CreateProjectSchema>({
    resolver: zodResolver(createProjectSchema),
  });

  function onSubmit(data: CreateProjectSchema) {}
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create a Project</DialogTitle>
        </DialogHeader>
        <div>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-8"
            ></form>
          </Form>
        </div>
      </DialogContent>
      <DialogTrigger asChild>
        <Button variant={"outline"}>Create Project</Button>
      </DialogTrigger>
    </Dialog>
  );
}
