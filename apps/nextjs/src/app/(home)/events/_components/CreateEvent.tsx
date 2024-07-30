"use client"
import { Button } from '@amaxa/ui/button'
import { format } from "date-fns";
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@amaxa/ui/dialog'
import { TimePickerDemo } from "@amaxa/ui/time-picker/time-picker-demo"
import { Calendar } from "@amaxa/ui/calendar"
import { useForm } from 'react-hook-form'
import { Input } from '@amaxa/ui/input'
import { toast } from '@amaxa/ui/toast'
import { useRouter } from 'next/navigation'
import React from 'react'
import { showErrorToast } from '~/lib/handle-error'
import { api } from '~/trpc/react'
import { createEventSchema } from '@amaxa/db/schema'
import { z } from 'zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@amaxa/ui/form'
import { Textarea } from '@amaxa/ui/textarea'
import { Popover, PopoverContent, PopoverTrigger } from '@amaxa/ui/popover'
import { cn } from '@amaxa/ui'
import { CalendarIcon } from 'lucide-react'

type CreateEventProps = z.infer<typeof createEventSchema>

export const CreateEvent = () => {
  const router = useRouter()

  const { mutate: create } = api.events.create.useMutation({
    onSuccess: () => {
      toast.success('Event created')
      router.refresh()
    },
    onError: (error) => {
      showErrorToast(error)
    },
  })

  const form = useForm<CreateEventProps>({
    resolver: zodResolver(createEventSchema)
  })

  function handleSubmit(data: CreateEventProps) {
    create(data)
  }

  return (
    <div>
      <Dialog>
        <DialogTrigger asChild>
          <Button >Create an Event</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Event</DialogTitle>
            <DialogDescription>
              Here you can create a new event
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-8 py-4">
            <Form {...form} >
              <form onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                  control={form.control}
                  name='name'
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Event Name
                      </FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormDescription>
                        THe name of the event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="time"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="text-left">Time</FormLabel>
                      <Popover>
                        <FormControl>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              className={cn(
                                "justify-start text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {field.value ? (
                                format(field.value, "PPP HH:mm:ss")
                              ) : (
                                <span>Pick a date</span>
                              )}
                            </Button>
                          </PopoverTrigger>
                        </FormControl>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            initialFocus
                          />
                          <div className="p-3 border-t border-border">
                            <TimePickerDemo
                              setDate={field.onChange}
                              date={field.value}
                            />
                          </div>
                        </PopoverContent>
                      </Popover>
                      <FormDescription>
                        The time of the event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  name='desc'
                  control={form.control}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Description
                      </FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormDescription>
                        A description of the event
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </div>
          <DialogFooter>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

