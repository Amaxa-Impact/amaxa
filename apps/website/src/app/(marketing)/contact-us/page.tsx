"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Mail, Phone, Calendar, Building2, Send, Loader2, Globe, Info, CheckCircle2, ArrowRight } from "lucide-react";
import { z } from "zod";
import { toast } from "sonner";

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
import { Textarea } from "@amaxa/ui/textarea";
import { Separator } from "@amaxa/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";

// Unified form schema for general inquiries
const unifiedInquiryFormSchema = z.object({
  inquiryType: z.enum(["general", "internship", "high-school"], {
    required_error: "Please select an inquiry type",
  }),
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(10, "Please provide more details (at least 10 characters)"),
});

const demoFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  organization: z.string().min(1, "Organization name is required"),
  phone: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  timezone: z.string().optional(),
  message: z.string().min(10, "Please provide more details about your interest"),
});

type FormType = "internship" | "high-school" | "general" | "demo";

interface ContactFormProps {
  formType: FormType;
  title: string;
  description: string;
  schema: z.ZodType<any>;
  showInquiryTypeSelector?: boolean;
}

function ContactForm({ formType, title, description, schema, showInquiryTypeSelector = false }: ContactFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm({
    schema,
    defaultValues: formType === "demo" 
      ? { name: "", email: "", organization: "", phone: "", preferredDate: "", preferredTime: "", timezone: "America/Denver", message: "" }
      : showInquiryTypeSelector
      ? { inquiryType: "general" as const, name: "", email: "", message: "" }
      : { name: "", email: "", message: "" },
  });

  const onSubmit = async (values: any) => {
    setIsSubmitting(true);
    try {
      // For unified form, use the inquiryType from values, otherwise use formType
      const finalFormType = showInquiryTypeSelector ? values.inquiryType : formType;
      
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

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        // Try to parse error response
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          // If JSON parsing fails, use default error
          errorData = { error: "Failed to send message", message: "Please try again later." };
        }

        let errorMessage = errorData.error || "Failed to send message";
        let errorDescription = errorData.message || "Please try again later.";

        if (errorData.code === "INVALID_EMAIL_RECIPIENT") {
          errorMessage = "Invalid Email Address";
          errorDescription = "You cannot use the recipient email address. Please use your own email address.";
        } else if (response.status === 400) {
          errorMessage = "Validation Error";
          errorDescription = errorData.message || "Please check your form and try again.";
        } else if (response.status === 500) {
          errorMessage = "Server Error";
          errorDescription = "Something went wrong on our end. Please try again in a few moments.";
        }

        toast.error(errorMessage, {
          description: errorDescription,
          duration: 8000,
        });
        
        return; // Exit early on error
      }

      const data = await response.json();

      if (data.success) {
        // Professional success message with reference ID
        const referenceId = data.referenceId;
        
        toast.success("Message Submitted Successfully", {
          description: referenceId 
            ? `Your message has been received. Reference ID: ${referenceId}`
            : "Your message has been received and will be reviewed by our team.",
          duration: 8000,
        });
        
        // Show reference ID prominently if available
        if (referenceId) {
          setTimeout(() => {
            toast.info("Save Your Reference ID", {
              description: `Reference ID: ${referenceId}. Please save this number for your records. You can use it when following up with us.`,
              duration: 10000,
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
          duration: 8000,
        });
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Form submission error:", error);
      toast.error("Failed to send message", {
        description: error instanceof Error 
          ? error.message 
          : "Network error. Please check your connection and try again.",
        duration: 8000,
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select inquiry type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="general">General Inquiry</SelectItem>
                        <SelectItem value="internship">Internship Inquiry</SelectItem>
                        <SelectItem value="high-school">High School Program</SelectItem>
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
                    <Input type="email" placeholder="john@example.com" {...field} />
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
                        <Input placeholder="Your School or Company" {...field} />
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
                        <FormLabel {...({} as any)}>Phone Number (Optional)</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="(555) 123-4567" {...field} />
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
                        <FormLabel {...({} as any)}>Preferred Date (Optional)</FormLabel>
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
                        <FormLabel {...({} as any)}>Preferred Time (Optional)</FormLabel>
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select timezone" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                            <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                            <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                            <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                            <SelectItem value="America/Phoenix">Arizona Time (MST)</SelectItem>
                            <SelectItem value="America/Anchorage">Alaska Time (AKT)</SelectItem>
                            <SelectItem value="Pacific/Honolulu">Hawaii Time (HST)</SelectItem>
                            <SelectItem value="UTC">UTC</SelectItem>
                            <SelectItem value="Europe/London">London (GMT)</SelectItem>
                            <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                            <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                            <SelectItem value="Asia/Shanghai">Shanghai (CST)</SelectItem>
                            <SelectItem value="Australia/Sydney">Sydney (AEST)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Select your timezone so we can schedule at a convenient time
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
                          ? "Tell us about your organization and what you'd like to learn about Ámaxa..."
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
              className="w-full bg-[#3B3B3B] hover:bg-[#3B3B3B]/90 text-white"
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
            
            <div className="mt-4 rounded-lg bg-[#BCD96C]/10 border border-[#BCD96C]/30 p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-[#3B3B3B] mt-0.5 flex-shrink-0" />
                <div className="text-sm text-[#3B3B3B]/80">
                  <p className="font-medium mb-1">Where does this message go?</p>
                  <p>
                    Your message will be sent directly to <strong>jyang.scholar@gmail.com</strong> (TESTING). 
                    {formType === "demo" && " We'll review your request and get back to you within 1-2 business days to schedule your demo or intro call."}
                    {formType !== "demo" && " We typically respond within 1-2 business days."}
                  </p>
                </div>
              </div>
            </div>
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
              Get in Touch with Ámaxa
                </h2>
            <p className="mt-4 text-lg text-[#3B3B3B]/80 md:text-xl">
              We're here to help. Choose the form that best fits your inquiry, or reach out directly.
            </p>
          </div>

          {/* Direct Contact Information */}
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <Card className="border-2 flex flex-col h-full">
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
                  <p className="text-sm text-muted-foreground mb-2">General Inquiries</p>
                  <a
                    href="mailto:lauren@amaxaimpact.org"
                    className="text-[#3B3B3B] hover:text-[#BCD96C] transition-colors font-medium break-all"
                  >
                    lauren@amaxaimpact.org
                  </a>
                </div>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Collaboration</p>
                  <a
                    href="mailto:lexi@amaxaimpact.org"
                    className="text-[#3B3B3B] hover:text-[#BCD96C] transition-colors font-medium break-all"
                  >
                    lexi@amaxaimpact.org
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 flex flex-col h-full">
              <CardHeader className="flex-1">
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#BCD96C]/20">
                  <Calendar className="h-6 w-6 text-[#3B3B3B]" />
                </div>
                <CardTitle className="text-xl">Schedule a Call</CardTitle>
                <CardDescription className="mt-2">
                  Interested in learning more? Use the demo request form below to schedule an introduction call.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col justify-end">
                <Button
                  variant="outline"
                  className="w-full border-[#3B3B3B] text-[#3B3B3B] hover:bg-[#BCD96C]/20 hover:border-[#BCD96C] transition-colors group"
                  onClick={() => {
                    document.getElementById("demo-section")?.scrollIntoView({ behavior: "smooth" });
                  }}
                >
                  Request Demo
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Contact Forms Section */}
          <div className="space-y-12">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center rounded-full bg-[#BCD96C]/20 p-3 mb-2">
                <Mail className="h-6 w-6 text-[#3B3B3B]" />
              </div>
              <h3 className="text-2xl font-semibold text-[#3B3B3B] md:text-3xl">
                Send Us a Message
              </h3>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Fill out the form below that matches your inquiry type. All messages are sent directly to <strong>jyang.scholar@gmail.com</strong> (TESTING).
              </p>
            </div>

            <div className="max-w-3xl mx-auto">
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
          
          <div id="demo-section" className="space-y-8 scroll-mt-20">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center rounded-full bg-[#BCD96C]/20 p-4 mb-4">
                <Calendar className="h-8 w-8 text-[#3B3B3B]" />
              </div>
              <h3 className="text-3xl font-semibold text-[#3B3B3B] md:text-4xl">
                Schedule a Demo or Intro Call
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Are you a school or company interested in learning more about Ámaxa? 
                Request a personalized demo or introduction call with our team.
              </p>
              
              {/* Information Card */}
              <div className="mt-6 max-w-2xl mx-auto rounded-xl bg-gradient-to-br from-[#BCD96C]/10 to-[#BCD96C]/5 border border-[#BCD96C]/30 p-6">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0">
                    <div className="rounded-full bg-[#BCD96C]/20 p-2">
                      <CheckCircle2 className="h-6 w-6 text-[#3B3B3B]" />
                    </div>
                  </div>
                  <div className="text-left space-y-2">
                    <h4 className="font-semibold text-[#3B3B3B] text-lg">What happens next?</h4>
                    <ul className="space-y-2 text-sm text-[#3B3B3B]/80">
                      <li className="flex items-start gap-2">
                        <span className="text-[#BCD96C] mt-1">•</span>
                        <span>Your request is sent to <strong>jyang.scholar@gmail.com</strong> (TESTING)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#BCD96C] mt-1">•</span>
                        <span>We review your information and preferred time (including timezone)</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#BCD96C] mt-1">•</span>
                        <span>Our team will contact you within 1-2 business days to confirm the call</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-[#BCD96C] mt-1">•</span>
                        <span>We'll send you a calendar invite with the confirmed date and time</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-3xl mx-auto">
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
