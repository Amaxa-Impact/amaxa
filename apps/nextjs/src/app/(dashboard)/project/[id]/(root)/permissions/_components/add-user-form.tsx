"use client"
import { Button } from '@amaxa/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@amaxa/ui/dialog'
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import React from 'react'
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
import { Input } from "@amaxa/ui/input"

export const addUserSchema = z.object({
  userId: z.string(),
  projectId: z.string(),
  permissions: z.array(z.string()),
})
const schema = addUserSchema.omit({
  projectId: true,
})

type AddUserForm = z.infer<typeof schema>


export default function AddUserForm({
  userMap,
}: {
  userMap: string
}) {

  const form = useForm<AddUserForm>({
    resolver: zodResolver(schema),
  })

  function onSubmit(data: AddUserForm) {
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Invite User</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            Add A User
          </DialogTitle>
        </DialogHeader>
        <div className='w-full flex flex-col gap-10'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

              <FormField
                control={form.control}
                name="userId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>User</FormLabel>
                    <FormControl>

                    </FormControl>
                    <FormDescription>
                      The user you want to add to this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>

          </Form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

