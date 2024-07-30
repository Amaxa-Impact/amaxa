"use client"
import React from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@amaxa/ui/dialog'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from 'zod'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@amaxa/ui/form"
import { Combobox } from '@amaxa/ui/combobox'
import { Button } from '@amaxa/ui/button'

const addUserSchema = z.object({
  userId: z.string(),
  permissions: z.array(z.string()),
})

type AddUserForm = z.infer<typeof addUserSchema>

export default function AddUserForm({
  userMap,
}: {
  userMap: {
    value: string;
    label: string;
  }[]
}) {
  const form = useForm<AddUserForm>({
    resolver: zodResolver(addUserSchema),
  })

  function onSubmit(data: AddUserForm) {
    console.log(data)
  }

  return (
    <Dialog>
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
              name="userId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>User</FormLabel>
                  <FormControl>
                    <Combobox
                      {...field}
                      options={userMap}
                    />
                  </FormControl>
                  <FormDescription>Select a user to add to the project</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Add User</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
