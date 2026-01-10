"use client";

import type { z } from "zod";
import React from "react";
import Image from "next/image";
import { Globe, Info, Loader2, Send } from "lucide-react";

import { contactFormSchema } from "@amaxa/resend";
import { Button } from "@amaxa/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@amaxa/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  useForm,
} from "@amaxa/ui/form";
import { Input } from "@amaxa/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";
import { Textarea } from "@amaxa/ui/textarea";

import { AnimatedTitle } from "~/components/animated-underline";

type ContactFormValues = z.infer<typeof contactFormSchema>;

interface ContactFormProps {
  formType?: ContactFormValues["formType"];
  title: string;
  description?: string;
}

const timezones: { value: string; label: string }[] = [
  { value: "America/New_York", label: "Eastern (ET) — America/New_York" },
  { value: "America/Chicago", label: "Central (CT) — America/Chicago" },
  { value: "America/Denver", label: "Mountain (MT) — America/Denver" },
  { value: "America/Los_Angeles", label: "Pacific (PT) — America/Los_Angeles" },
  { value: "UTC", label: "UTC" },
];

function formatPhoneNumber(input: string) {
  const digits = input.replace(/\D/g, "").slice(0, 10);
  const a = digits.slice(0, 3);
  const b = digits.slice(3, 6);
  const c = digits.slice(6, 10);
  if (digits.length <= 3) return a;
  if (digits.length <= 6) return `(${a}) ${b}`;
  return `(${a}) ${b}-${c}`;
}

export function ContactForm({
  formType = "general",
  title,
  description,
}: ContactFormProps) {
  const form = useForm<ContactFormValues, any, ContactFormValues>({
    schema: contactFormSchema,
    defaultValues: {
      formType,
      name: "",
      email: "",
      message: "",
      organization: "",
      phone: "",
      preferredDate: "",
      preferredTime: "",
      timezone: "",
    },
  });

  const isSubmitting = form.formState.isSubmitting;
  const [status, setStatus] = React.useState<
    | { state: "idle" }
    | { state: "success"; message: string }
    | { state: "error"; message: string }
  >({ state: "idle" });

  async function onSubmit(values: ContactFormValues) {
    setStatus({ state: "idle" });
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const json = (await res.json().catch(() => null)) as {
        success?: boolean;
        message?: string;
        error?: string;
      } | null;

      if (!res.ok) {
        setStatus({
          state: "error",
          message: json?.error ?? json?.message ?? "Failed to send message.",
        });
        return;
      }

      setStatus({
        state: "success",
        message: json?.message ?? "Message sent successfully!",
      });
      form.reset({ ...form.getValues(), name: "", email: "", message: "" });
    } catch (err) {
      setStatus({
        state: "error",
        message: err instanceof Error ? err.message : "Failed to send message.",
      });
    }
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description ? <CardDescription>{description}</CardDescription> : null}
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="John Doe" {...field} />
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
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      placeholder="john@example.com"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {formType === "demo" ? (
              <>
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Organization Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Personal, School Name, or Company Name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="(555) 123-4567"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(formatPhoneNumber(e.target.value))
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="preferredDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Date (Optional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="preferredTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Preferred Time (Optional)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="timezone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          <span className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Timezone (Optional)
                          </span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value || undefined}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="max-h-[300px]">
                            {timezones.map((tz) => (
                              <SelectItem key={tz.value} value={tz.value}>
                                {tz.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select your timezone so we can schedule at a
                          convenient time.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            ) : null}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder={
                        formType === "demo"
                          ? "Tell us about your organization and what you'd like to learn about ámaxa..."
                          : "Tell us how we can help you..."
                      }
                      className="min-h-[120px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting}
              variant="primary"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Send Message
                </>
              )}
            </Button>

            {status.state === "success" ? (
              <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
                {status.message}
              </div>
            ) : null}
            {status.state === "error" ? (
              <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900">
                {status.message}
              </div>
            ) : null}

            {formType !== "demo" ? (
              <div className="mt-4 rounded-lg border border-[#BCD96C]/30 bg-[#BCD96C]/10 p-4">
                <div className="flex items-start gap-3">
                  <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3B3B3B]" />
                  <div className="text-sm text-[#3B3B3B]/80">
                    <p className="mb-1 font-medium">
                      Where does this message go?
                    </p>
                    <p>
                      Your message will be sent directly to{" "}
                      <strong>lauren@amaxaimpact.org</strong>. A team member
                      will reply directly to your email address. We typically
                      respond within 1-2 business days.
                    </p>
                  </div>
                </div>
              </div>
            ) : null}
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}

export default function ContactUsPage() {
  return (
    <main>
      {/* Header Section */}
      <div className="relative flex max-h-[320px] w-full flex-col bg-white px-6 sm:max-h-[240px] md:max-h-[320px] md:px-12 lg:px-20">
        {/* Background container - hidden but preserved for reference */}
        <div className="invisible absolute inset-0">
          <div
            className="h-full w-full"
            style={{ background: "url(/Untitled design.png)" }}
          />
        </div>
        {/* Content container with flex layout */}
        <section className="w-full overflow-visible py-16 md:py-24">
          <div className="container mx-auto overflow-visible px-6 md:px-16 lg:px-20">
            <div className="flex flex-col items-center justify-center overflow-visible">
              <div className="mb-12 max-w-full overflow-visible">
                <AnimatedTitle underlinedText="Contact Us" color="#BCD96C" />
              </div>
            </div>
          </div>
        </section>
      </div>

      <section className="w-full px-6 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-16 md:space-y-20">
          {/* High School Program */}
          <div className="space-y-8 md:space-y-10">
            <div className="flex flex-col gap-10 md:flex-row md:items-center md:gap-12">
              {/* Left: Description */}
              <div className="w-full space-y-6 md:w-1/2">
                <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
                  Questions, comments, or partnership proposals? We'd love to
                  hear from you.
                </h2>
                <p className="text-lg leading-relaxed font-normal text-[#3B3B3B] md:text-xl lg:text-2xl">
                  For general inquiries, please email our CEO Lauren McMillen at
                  lauren@amaxaimpact.org.
                </p>

                <p className="text-lg leading-relaxed font-normal text-[#3B3B3B] md:text-xl lg:text-2xl">
                  For collaboration inquiries, please email our COO Alexi Jones
                  at lexi@amaxaimpact.org.
                </p>
              </div>

              {/* Right: Form intro + image */}
              <div className="w-full md:w-1/2">
                <h3 className="text-2xl font-semibold text-[#3B3B3B] md:text-3xl">
                  Send Us a Message
                </h3>
                <p className="text-muted-foreground mt-4 max-w-2xl">
                  Fill out the form below that matches your inquiry type. A team
                  member will reply to your email address, or for demo requests
                  with a preferred date and time, you'll receive a Google
                  Calendar invite.
                </p>

                <div className="mt-8 flex w-full items-center justify-center md:mt-10">
                  <div className="h-auto w-auto">
                    <Image
                      src="https://b47pkz22xs.ufs.sh/f/OxFTTzjZGToO8nKnqPHgjXRpn0dgo1l6KOV2DuqGLya94cMI"
                      alt="mail"
                      width="300"
                      height="300"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-3xl">
              <ContactForm
                formType="demo"
                title="Request a Demo or Intro Call"
                description="Tell us about your organization and we'll schedule a time to connect."
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
