"use client";

import React from "react";
import { useForm } from "@tanstack/react-form";
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
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@amaxa/ui/field";
import { Input } from "@amaxa/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";
import { Textarea } from "@amaxa/ui/textarea";

type ContactFormValues = typeof contactFormSchema.infer;

interface ContactFormProps {
  formType?: ContactFormValues["formType"];
  title: string;
  description?: string;
}

const timezones = [
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
  const [status, setStatus] = React.useState<{
    state: "idle" | "success" | "error";
    message: string;
  }>({ state: "idle", message: "" });

  const form = useForm({
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
    } satisfies ContactFormValues,
    validators: {
      onSubmit: contactFormSchema,
    },
    onSubmit: async ({ value }) => {
      setStatus({ state: "idle", message: "" });
      try {
        const res = await fetch("/api/contact", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(value),
        });

        const json = await res.json().catch(() => null);

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
        form.reset();
      } catch (err) {
        setStatus({
          state: "error",
          message:
            err instanceof Error ? err.message : "Failed to send message.",
        });
      }
    },
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            void form.handleSubmit();
          }}
          className="space-y-6"
        >
          {/* Full Name */}
          <form.Field
            name="name"
            children={(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel>Full Name</FieldLabel>
                <Input
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="John Doe"
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          {/* Email */}
          <form.Field
            name="email"
            children={(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel>Email Address</FieldLabel>
                <Input
                  type="email"
                  name={field.name}
                  value={field.state.value}
                  onBlur={field.handleBlur}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder="john@example.com"
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          {formType === "demo" && (
            <>
              <form.Field
                name="organization"
                children={(field) => (
                  <Field data-invalid={field.state.meta.errors.length > 0}>
                    <FieldLabel>Organization Name</FieldLabel>
                    <Input
                      name={field.name}
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      placeholder="Personal, School, or Company"
                    />
                    <FieldError errors={field.state.meta.errors} />
                  </Field>
                )}
              />

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field
                  name="phone"
                  children={(field) => (
                    <Field data-invalid={field.state.meta.errors.length > 0}>
                      <FieldLabel>Phone Number (Optional)</FieldLabel>
                      <Input
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={field.state.value}
                        onChange={(e) =>
                          field.handleChange(formatPhoneNumber(e.target.value))
                        }
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                />

                <form.Field
                  name="preferredDate"
                  children={(field) => (
                    <Field data-invalid={field.state.meta.errors.length > 0}>
                      <FieldLabel>Preferred Date (Optional)</FieldLabel>
                      <Input
                        type="date"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <form.Field
                  name="preferredTime"
                  children={(field) => (
                    <Field data-invalid={field.state.meta.errors.length > 0}>
                      <FieldLabel>Preferred Time (Optional)</FieldLabel>
                      <Input
                        type="time"
                        value={field.state.value}
                        onChange={(e) => field.handleChange(e.target.value)}
                      />
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                />

                <form.Field
                  name="timezone"
                  children={(field) => (
                    <Field data-invalid={field.state.meta.errors.length > 0}>
                      <FieldLabel className="flex items-center gap-2">
                        <Globe className="h-4 w-4" /> Timezone (Optional)
                      </FieldLabel>
                      <Select
                        value={field.state.value}
                        onValueChange={field.handleChange}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="max-h-[300px]">
                          {timezones.map((tz) => (
                            <SelectItem key={tz.value} value={tz.value}>
                              {tz.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FieldDescription>
                        Select your timezone for scheduling.
                      </FieldDescription>
                      <FieldError errors={field.state.meta.errors} />
                    </Field>
                  )}
                />
              </div>
            </>
          )}

          <form.Field
            name="message"
            children={(field) => (
              <Field data-invalid={field.state.meta.errors.length > 0}>
                <FieldLabel>Message</FieldLabel>
                <Textarea
                  value={field.state.value}
                  onChange={(e) => field.handleChange(e.target.value)}
                  placeholder={
                    formType === "demo"
                      ? "Tell us about your organization..."
                      : "How can we help?"
                  }
                  className="min-h-[120px]"
                />
                <FieldError errors={field.state.meta.errors} />
              </Field>
            )}
          />

          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
            children={([canSubmit, isSubmitting]) => (
              <Button
                type="submit"
                className="w-full"
                disabled={!canSubmit || isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" /> Send Message
                  </>
                )}
              </Button>
            )}
          />

          {status.state === "success" && (
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-900">
              {status.message}
            </div>
          )}
          {status.state === "error" && (
            <div className="rounded-md border border-red-200 bg-red-50 p-3 text-sm text-red-900">
              {status.message}
            </div>
          )}

          {formType !== "demo" && (
            <div className="mt-4 rounded-lg border border-[#BCD96C]/30 bg-[#BCD96C]/10 p-4">
              <div className="flex items-start gap-3">
                <Info className="mt-0.5 h-5 w-5 flex-shrink-0 text-[#3B3B3B]" />
                <div className="text-sm text-[#3B3B3B]/80">
                  <p className="mb-1 font-medium">
                    Where does this message go?
                  </p>
                  <p>
                    Sent to <strong>lauren@amaxaimpact.org</strong>. We
                    typically respond within 1-2 business days.
                  </p>
                </div>
              </div>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
}

export default function ContactUsPage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-12">
      <ContactForm title="Contact Us" description="Get in touch with our team" />
    </div>
  );
}
