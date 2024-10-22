"use client";

import React, { useState } from "react";
import { revalidateTag } from "next/cache";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { CheckIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { userRolesEnum } from "@amaxa/db/schema";
import { cn } from "@amaxa/ui";
import { Button } from "@amaxa/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@amaxa/ui/command";
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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@amaxa/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@amaxa/ui/popover";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";
import { toast } from "@amaxa/ui/toast";

import { api } from "~/trpc/react";

const addUserSchema = z.object({
  userId: z.string(),
  permission: z.string(),
});

type AddUserForm = z.infer<typeof addUserSchema>;

export default function AddUserForm({
  userMap,
}: {
  userMap: {
    value: string;
    label: string;
  }[];
}) {
  const { id } = useParams();
  const [open, setOpen] = useState(false);
  const form = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
  });

  const { mutate: create } = api.users.joinProject.useMutation({
    onSuccess: () => {
      setOpen(false);
      revalidateTag("getUserProjects");
    },
    onError: () => {
      toast.error("error");
      revalidateTag("getUserProjects");
      setOpen(false);
    },
  });

  function onSubmit(data: AddUserForm) {
    create({
      userId: data.userId,
      permission: data.permission,
      projectId: id as string,
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Invite User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add A User</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="permission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Role</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a role" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectGroup>
                        {userRolesEnum.map((item) => (
                          <SelectItem
                            key={item}
                            value={item}
                            className="capitalize"
                          >
                            {item}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    The role of the user being added to the project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="userId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>User</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl className="w-full">
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground",
                          )}
                        >
                          {field.value
                            ? userMap.find((user) => user.value === field.value)
                                ?.label
                            : "Select User"}
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput
                          placeholder="Search User"
                          className="h-9"
                        />
                        <CommandList>
                          <CommandEmpty>No user found.</CommandEmpty>
                          <CommandGroup>
                            {userMap.map((user) => (
                              <CommandItem
                                value={user.label}
                                key={user.value}
                                onSelect={() => {
                                  form.setValue("userId", user.value);
                                }}
                              >
                                {user.label}
                                <CheckIcon
                                  className={cn(
                                    "ml-auto h-4 w-4",
                                    user.value === field.value
                                      ? "opacity-100"
                                      : "opacity-0",
                                  )}
                                />
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormDescription>
                    The user who will be added to the project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add User</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
