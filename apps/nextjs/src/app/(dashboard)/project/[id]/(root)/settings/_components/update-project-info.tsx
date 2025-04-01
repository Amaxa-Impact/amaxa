"use client";;
import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@amaxa/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@amaxa/ui/form";
import { Input } from "@amaxa/ui/input";
import { Textarea } from "@amaxa/ui/textarea";

import { api } from "~/trpc/react";

import { useMutation } from "@tanstack/react-query";

const schema = z.object({
  id: z.string(),
  name: z.string().min(1, "Project name is required"),
  description: z.string().optional(),
});

type FormSchema = z.infer<typeof schema>;

interface ProjectDetailsFormProps {
  projectId: string;
  initialData: {
    name: string;
    description?: string;
  };
}

export function ProjectDetailsForm({
  projectId,
  initialData,
}: ProjectDetailsFormProps) {
  const trpc = useTRPC();
  const form = useForm<FormSchema>({
    resolver: zodResolver(schema),
    defaultValues: {
      id: projectId,
      ...initialData,
    },
  });

  const utils = api.useUtils();
  const { mutate, isPending } = useMutation(api.projects.update.mutationOptions({
    onSuccess: async () => {
      await utils.projects.invalidate();
      toast("Success!");
    },
    onError: (err) => {
      toast(err.message);
    },
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Details</CardTitle>
        <CardDescription>
          Update your project's name and description.
        </CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => mutate(data))}>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Project Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Project Name" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} placeholder="Project Description" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button type="submit" disabled={isPending}>
              {isPending ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
