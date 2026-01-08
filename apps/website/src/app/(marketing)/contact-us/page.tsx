"use client";

import React, { useState } from "react";
import {
  ArrowRight,
  Calendar,
  CheckCircle2,
  Globe,
  Info,
  Loader2,
  Mail,
  Send,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

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
import { Separator } from "@amaxa/ui/separator";
import { Textarea } from "@amaxa/ui/textarea";

import { timezones } from "~/lib/timezones";

const unifiedInquiryFormSchema = z.object({
  inquiryType: z.enum(["general", "internship", "high-school"], {
    required_error: "Please select an inquiry type",
  }),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z
    .string()
    .min(10, "Please provide more details (at least 10 characters)"),
});

const demoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  organization: z.string().min(1, "Organization name is required"),
  phone: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  timezone: z.string().optional(),
  message: z
    .string()
    .min(10, "Please provide more details about your interest"),
});

type FormType = "internship" | "high-school" | "general" | "demo";

interface ContactFormProps {
  formType: FormType;
  title: string;
  description: string;
  schema: z.ZodType<any>;
  showInquiryTypeSelector?: boolean;
}

function formatPhoneNumber(value: string): string {
  const phoneNumber = value.replace(/\D/g, "");

  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

function ContactForm({
  formType,
  title,
  description,
  schema,
  showInquiryTypeSelector = false,
}: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm({
    schema,
    defaultValues:
      formType === "demo"
        ? {
            name: "",
            email: "",
            organization: "",
            phone: "",
            preferredDate: "",
            preferredTime: "",
            timezone: "America/Denver",
            message: "",
          }
        : showInquiryTypeSelector
          ? {
              inquiryType: "general" as const,
              name: "",
              email: "",
              message: "",
            }
          : { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: any) => {
    try {
      const finalFormType = showInquiryTypeSelector
        ? values.inquiryType
        : formType;

      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...values,
          formType: finalFormType,
        }),
      });

      if (!response.ok) {
        console.error("❌ Response not OK:", response.status);
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          errorData = {
            error: "Failed to send message",
            message: "Please try again later.",
          };
        }

        let errorMessage = errorData.error || "Failed to send message";
        let errorDescription = errorData.message || "Please try again later.";

        if (response.status === 400) {
          errorMessage = "Validation Error";
          errorDescription =
            errorData.message || "Please check your form and try again.";
        } else if (response.status === 403) {
          errorMessage = "Email Service Error";
          errorDescription =
            "There was an issue with the email service. Please check your email address and try again, or contact us directly.";
        } else if (response.status === 500) {
          errorMessage = "Server Error";
          errorDescription =
            "Something went wrong on our end. Please try again in a few moments.";
        }

        toast.error(errorMessage, {
          description: errorDescription,
          duration: Infinity,
        });

        return;
      }

      const data = await response.json();

      if (data.success) {
        const referenceId = data.referenceId;

        toast.success("Message Submitted Successfully", {
          description: referenceId
            ? `Your message has been received. Reference ID: ${referenceId}`
            : "Your message has been received and will be reviewed by our team.",
          duration: Infinity,
        });

        if (referenceId) {
          setTimeout(() => {
            toast.info("Save Your Reference ID", {
              description: `Reference ID: ${referenceId}. Please save this ID for your records. You can use it when following up with us.`,
              duration: Infinity,
            });
          }, 1500);
        }

        form.reset();
      } else {
        // Handle case where success is false but status was 200
        const errorMessage = data.error || "Failed to send message";
        const errorDescription = data.message || "Please try again later.";

        toast.error(errorMessage, {
          description: errorDescription,
          duration: Infinity,
        });
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("❌ ========== FORM SUBMISSION ERROR ==========");
      console.error(
        "❌ Error type:",
        error instanceof Error ? error.constructor.name : typeof error,
      );
      console.error(
        "❌ Error message:",
        error instanceof Error ? error.message : String(error),
      );
      console.error("❌ Full error:", error);
      console.error("❌ ============================================");
      toast.error("Failed to send message", {
        description:
          error instanceof Error
            ? error.message
            : "Network error. Please check your connection and try again.",
        duration: Infinity,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {showInquiryTypeSelector && (
              <FormField
                control={form.control}
                name="inquiryType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel {...({} as any)}>Inquiry Type</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="internship">
                          Internship Inquiry
                        </SelectItem>
                        <SelectItem value="high-school">
                          High School Program
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Select the type of inquiry that best matches your question
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel {...({} as any)}>Full Name</FormLabel>
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
                  <FormLabel {...({} as any)}>Email Address</FormLabel>
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

            {formType === "demo" && (
              <>
                <FormField
                  control={form.control}
                  name="organization"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel {...({} as any)}>Organization Name</FormLabel>
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
                        <FormLabel {...({} as any)}>
                          Phone Number (Optional)
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="(555) 123-4567"
                            {...field}
                            value={field.value || ""}
                            onChange={(e) => {
                              const formatted = formatPhoneNumber(
                                e.target.value,
                              );
                              field.onChange(formatted);
                            }}
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
                        <FormLabel {...({} as any)}>
                          Preferred Date (Optional)
                        </FormLabel>
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
                        <FormLabel {...({} as any)}>
                          Preferred Time (Optional)
                        </FormLabel>
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
                        <FormLabel {...({} as any)}>
                          <div className="flex items-center gap-2">
                            <Globe className="h-4 w-4" />
                            Timezone (Optional)
                          </div>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
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
                          convenient time
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </>
            )}

            <FormField
              control={form.control}
              name="message"
              render={({ field }) => (
                <FormItem>
                  <FormLabel {...({} as any)}>Message</FormLabel>
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
              className="w-full bg-[#3B3B3B] text-white hover:bg-[#3B3B3B]/90"
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

            {formType !== "demo" && (
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
            )}
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
        <section className="w-full py-16 md:py-24">
          <div className="container mx-auto px-6 md:px-16 lg:px-20">
            <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
              <div className="mb-12 max-w-full md:mb-0 md:max-w-3xl lg:max-w-4xl">
                <h1 className="text-4xl font-light leading-tight text-[#3B3B3B] md:text-4xl lg:text-6xl">
                  Contact Us
                </h1>
                <div className="lg:w-200 relative -mt-2 ml-auto h-6 w-48 md:-mt-4 md:w-64">
                  <svg
                    viewBox="0 0 325 500"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M1 41C1 41 54 10 81 41C108 72 162 10 189 41C216 72 270 41 270 41"
                      stroke="#BCD96C"
                      strokeWidth="8"
                      strokeLinecap="round"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Main Content */}
      <section className="w-full bg-gray-50 px-6 py-12 md:px-16 md:py-16 lg:px-20 lg:py-20">
        <div className="mx-auto max-w-7xl space-y-16">
          {/* Introduction Section */}
          <div className="text-center">
            <h2 className="text-3xl font-normal text-[#3B3B3B] md:text-4xl lg:text-5xl">
              Get in touch with ámaxa.
            </h2>
            <p className="mt-4 text-lg text-[#3B3B3B]/80 md:text-xl">
              We're here to help. Choose the form that best fits your inquiry,
              or reach out directly.
            </p>
          </div>

          {/* Direct Contact Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="flex h-full flex-col border-2">
              <CardHeader className="flex-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#BCD96C]/20">
                  <Mail className="h-6 w-6 text-[#3B3B3B]" />
                </div>
                <CardTitle className="text-xl">Email Us</CardTitle>
                <CardDescription className="mt-2">
                  Reach out directly via email for any inquiries or questions.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-end space-y-3">
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    General Inquiries
                  </p>
                  <a
                    href="mailto:lauren@amaxaimpact.org"
                    className="break-all font-medium text-[#3B3B3B] transition-colors hover:text-[#BCD96C]"
                  >
                    lauren@amaxaimpact.org
                  </a>
                </div>
                <Separator />
                <div>
                  <p className="mb-2 text-sm text-muted-foreground">
                    Collaboration
                  </p>
                  <a
                    href="mailto:lexi@amaxaimpact.org"
                    className="break-all font-medium text-[#3B3B3B] transition-colors hover:text-[#BCD96C]"
                  >
                    lexi@amaxaimpact.org
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="flex h-full flex-col border-2">
              <CardHeader className="flex-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#BCD96C]/20">
                  <Calendar className="h-6 w-6 text-[#3B3B3B]" />
                </div>
                <CardTitle className="text-xl">Schedule a Call</CardTitle>
                <CardDescription className="mt-2">
                  Interested in learning more? Use the demo request form below
                  to schedule an introduction call.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-end">
                <Button
                  variant="outline"
                  className="group w-full border-[#3B3B3B] text-[#3B3B3B] transition-colors hover:border-[#BCD96C] hover:bg-[#BCD96C]/20"
                  onClick={() => {
                    document
                      .getElementById("demo-section")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Request Demo
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Forms Section */}
          <div className="space-y-12">
            <div className="space-y-4 text-center">
              <div className="mb-2 inline-flex items-center justify-center rounded-full bg-[#BCD96C]/20 p-3">
                <Mail className="h-6 w-6 text-[#3B3B3B]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#3B3B3B] md:text-3xl">
                Send Us a Message
              </h3>
              <p className="mx-auto max-w-2xl text-muted-foreground">
                Fill out the form below that matches your inquiry type. A team
                member will reply to your email address, or for demo requests
                with a preferred date and time, you'll receive a Google Calendar
                invite.
              </p>
            </div>

            <div className="mx-auto max-w-3xl">
              <ContactForm
                formType="general"
                title="Send Us a Message"
                description="Fill out the form below and select your inquiry type. All messages are sent directly to our team."
                schema={unifiedInquiryFormSchema}
                showInquiryTypeSelector={true}
              />
            </div>
          </div>

          {/* Demo/Intro Call Section */}
          <div className="my-16">
            <Separator />
          </div>

          <div id="demo-section" className="scroll-mt-20 space-y-8">
            <div className="space-y-4 text-center">
              <div className="mb-4 inline-flex items-center justify-center rounded-full bg-[#BCD96C]/20 p-4">
                <Calendar className="h-8 w-8 text-[#3B3B3B]" />
              </div>
              <h3 className="text-3xl font-semibold text-[#3B3B3B] md:text-4xl">
                Schedule a Demo or Call
              </h3>
              <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
                Are you an orgainzation interested in learning more about ámaxa?
                Request an introduction call with our team.
              </p>

              {/* Information Card */}
              <div className="mx-auto mt-6 max-w-2xl rounded-xl border border-[#BCD96C]/30 bg-gradient-to-br from-[#BCD96C]/10 to-[#BCD96C]/5 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-[#BCD96C]/20 p-2">
                      <CheckCircle2 className="h-6 w-6 text-[#3B3B3B]" />
                    </div>
                  </div>
                  <div className="space-y-2 text-left">
                    <h4 className="text-lg font-semibold text-[#3B3B3B]">
                      What happens next?
                    </h4>
                    <ul className="space-y-2 text-sm text-[#3B3B3B]/80">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-[#BCD96C]">•</span>
                        <span>
                          Your request is sent to an ámaxa team member
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-[#BCD96C]">•</span>
                        <span>
                          We review your information and preferred time
                          (including timezone)
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-[#BCD96C]">•</span>
                        <span>
                          The team member will reply to your email address, or
                          if you've provided a preferred date and time, you'll
                          receive a Google Calendar invite
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 text-[#BCD96C]">•</span>
                        <span>
                          We typically respond within 1-2 business days
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="mx-auto max-w-3xl">
              <ContactForm
                formType="demo"
                title="Request a Demo or Intro Call"
                description="Tell us about your organization and we'll schedule a time to connect."
                schema={demoFormSchema}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
