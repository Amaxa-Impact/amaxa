"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

import { Button } from "@amaxa/ui/button";
import { Checkbox } from "@amaxa/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@amaxa/ui/form";
import { Input } from "@amaxa/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";

import { api } from "~/trpc/react";

const formSchema = z.object({
  id: z.string(),
  name: z.string().optional(),
  email: z.string().email(),
  isPublic: z.boolean(),
  status: z.enum(["Verified", "Unverified", "Pending"]),
  role: z.enum(["Admin", "User"]),
  image: z.string().optional(),
});

type UserEditFormProps = {
  user: z.infer<typeof formSchema>;
  onSuccess: () => void;
};

export function UserEditForm({ user, onSuccess }: UserEditFormProps) {
  const utils = api.useUtils();
  const updateUser = api.users.updateUser.useMutation({
    onSuccess: () => {
      utils.users.invalidate();
      toast.success("User updated");
      onSuccess();
    },
    onError: (error) => {
      utils.users.invalidate();
      toast.error("Error updating user");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: user.id,
      name: user.name || "",
      email: user.email,
      isPublic: user.isPublic,
      status: user.status,
      role: user.role,
      image: user.image || "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await updateUser.mutateAsync(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isPublic"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
              <FormControl>
                <Checkbox
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>Public</FormLabel>
                <FormDescription>
                  Make this user's profile public
                </FormDescription>
              </div>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Verified">Verified</SelectItem>
                  <SelectItem value="Unverified">Unverified</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="role"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Role</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="Admin">Admin</SelectItem>
                  <SelectItem value="User">User</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Save changes</Button>
      </form>
    </Form>
  );
}
