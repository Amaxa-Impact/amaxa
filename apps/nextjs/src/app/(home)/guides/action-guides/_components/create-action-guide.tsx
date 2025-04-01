"use client";;
import { useState } from "react";
import { api as trpc } from "@/trpc/react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@amaxa/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@amaxa/ui/dialog";
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

import { extractNotionId } from "~/lib/utils";

import { useMutation } from "@tanstack/react-query";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  embedId: z.string().min(1, "Embed URL is required").url(),
});

export default function CreateActionGuide() {
  const trpc = useTRPC();
  const [open, setOpen] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      description: "",
      embedId: "",
    },
  });

  const queryClient = useQueryClient();
  const createGuide = useMutation(trpc.actionGuides.create.mutationOptions({
    onSuccess: () => {
      setOpen(false);
      void queryClient.invalidateQueries(trpc.actionGuides.pathFilter());
      form.reset();
    },
  }));

  function onSubmit(values: z.infer<typeof formSchema>) {
    createGuide.mutate({
      ...values,
      embedId: extractNotionId(values.embedId),
    });
  }

  return (
    <>
      <style jsx global>{`
        @media (max-width: 640px) {
          input,
          textarea {
            font-size: 16px !important;
          }
        }
      `}</style>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">Create New Guide</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create New Guide</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Guide title" {...field} />
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
                      <Textarea placeholder="Guide description" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="embedId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Embed Url</FormLabel>
                    <FormControl>
                      <Input placeholder="Embed Url" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={createGuide.isLoading}>
                {createGuide.isLoading ? "Creating..." : "Create Guide"}
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </>
  );
}
