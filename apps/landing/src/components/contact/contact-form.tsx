"use client";

import { useState } from "react";
import { z } from "zod";
import {
  Send,
  Loader2,
  Globe,
  Info,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@amaxa/ui/button";
import { Input } from "@amaxa/ui/input";
import { Textarea } from "@amaxa/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@amaxa/ui/select";
import { timezones, getTimezoneLabel } from "@/lib/timezones";
import { formTypeLabels, type FormType } from "@amaxa/resend";

// Map inquiry types to display labels
const inquiryTypeLabels: Record<string, string> = {
  general: "General Inquiry",
  internship: "Internship Inquiry",
  "high-school": "High School Program",
};

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

interface ContactFormProps {
  formType: FormType;
  title: string;
  description: string;
  schema?: z.ZodType<any> | null;
  showInquiryTypeSelector?: boolean;
}

// Format phone number as (XXX) XXX-XXXX
function formatPhoneNumber(value: string): string {
  // Remove all non-digit characters
  const phoneNumber = value.replace(/\D/g, "");
  
  // Limit to 10 digits
  const phoneNumberLength = phoneNumber.length;
  if (phoneNumberLength < 4) return phoneNumber;
  if (phoneNumberLength < 7) {
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
  }
  return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
}

export function ContactForm({ formType, title, description, schema, showInquiryTypeSelector = false }: ContactFormProps) {
  const [formData, setFormData] = useState(
    formType === "demo"
      ? { name: "", email: "", organization: "", phone: "", preferredDate: "", preferredTime: "", timezone: "America/New_York", message: "" }
      : showInquiryTypeSelector
      ? { inquiryType: "" as any, name: "", email: "", message: "" }
      : { name: "", email: "", message: "" }
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
    referenceId?: string;
    calendarLink?: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Simple, defensive runtime validation to avoid any crashes
    const name = (formData as any).name?.trim() ?? "";
    const email = (formData as any).email?.trim() ?? "";
    const message = (formData as any).message?.trim() ?? "";

    if (!name) {
      newErrors.name = "Name is required";
    }

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Invalid email address";
    }

    if (!message || message.length < 10) {
      newErrors.message = "Please provide more details (at least 10 characters)";
    }

    if (showInquiryTypeSelector) {
      const inquiryType = (formData as any).inquiryType;
      if (!inquiryType) {
        newErrors.inquiryType = "Please select an inquiry type";
      }
    }

    if (formType === "demo") {
      const organization = (formData as any).organization?.trim() ?? "";
      if (!organization) {
        newErrors.organization = "Organization name is required";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      // For unified form, use the inquiryType from values, otherwise use formType
      const finalFormType = showInquiryTypeSelector ? (formData as any).inquiryType : formType;
      
      // Prepare the data according to the schema
      const submitData: any = {
        name: formData.name,
        email: formData.email,
        message: formData.message,
        formType: finalFormType,
        organization: formType === "demo" ? (formData as any).organization || "" : "",
        phone: formType === "demo" ? (formData as any).phone : undefined,
        preferredDate: formType === "demo" ? (formData as any).preferredDate : undefined,
        preferredTime: formType === "demo" ? (formData as any).preferredTime : undefined,
        timezone: formType === "demo" ? (formData as any).timezone : undefined,
      };
      
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (response.ok && data.success) {
        // Success message with access code for Lauren - form stays visible
        const referenceId = data.referenceId;

        setSubmitStatus({
          type: "success",
          message:
            "Your message has been received. An ámaxa team member will get in touch with you soon via email.",
          referenceId,
          calendarLink: data.calendarLink,
        });
        
        // Clear errors on success but keep form visible
        setErrors({});
        // Note: Form does NOT reset - stays visible per scrum12 behavior
      } else {
        // Handle validation / server errors (including 400s from the API)
        let errorMessage = "Failed to send message. Please try again later.";

        if (typeof data?.error === "string" && data.error.trim().length > 0) {
          errorMessage = data.error;
        } else if (typeof data?.message === "string" && data.message.trim().length > 0) {
          errorMessage = data.message;
        }

        setSubmitStatus({
          type: "error",
          message: errorMessage,
          // If the backend included a referenceId even on failure, surface it for Lauren
          referenceId: typeof data?.referenceId === "string" ? data.referenceId : undefined,
        });
        // Don't reset form on error - keep user's input
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error("Error submitting form:", error);
      setSubmitStatus({
        type: "error",
        message: error instanceof Error 
          ? error.message 
          : "Network error. Please check your connection and try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full rounded-lg border-2 border-[#3B3B3B]/20 bg-white p-6 shadow-sm">
      <div className="mb-6">
        <h3 className="text-2xl font-semibold text-[#3B3B3B]">{title}</h3>
        <p className="mt-2 text-sm text-[#3B3B3B]/80">{description}</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        {showInquiryTypeSelector && (
          <div>
            <label htmlFor="inquiryType" className="mb-2 block text-sm font-medium text-[#3B3B3B]">
              Inquiry Type <span className="text-red-500">*</span>
            </label>
            <Select
              value={(formData as any).inquiryType || ""}
              onValueChange={(value) => handleSelectChange("inquiryType", value)}
            >
              <SelectTrigger className="w-full text-sm data-[placeholder]:text-[#3B3B3B]/40 text-[#3B3B3B] border-[#3B3B3B]/20 hover:border-[#3B3B3B]/40 transition-colors [&>*[data-slot='select-value']]:hidden" aria-invalid={errors.inquiryType ? "true" : "false"}>
                <SelectValue placeholder="Select inquiry type" />
                <span className="flex-1 text-left">
                  {(formData as any).inquiryType 
                    ? inquiryTypeLabels[(formData as any).inquiryType] 
                    : <span className="text-[#3B3B3B]/40">Select inquiry type</span>}
                </span>
              </SelectTrigger>
              <SelectContent className="z-[9999] bg-white border border-[#3B3B3B]/20 shadow-lg rounded-lg p-1 [&>button[data-slot='select-scroll-up-button']]:hidden [&>button[data-slot='select-scroll-down-button']]:hidden" side="bottom" sideOffset={4} align="start" alignItemWithTrigger={false} collisionAvoidance={{ side: "none" }}>
                <SelectItem value="general" className="cursor-pointer hover:bg-[#BCD96C]/10 focus:bg-[#BCD96C]/10 rounded-md py-2.5 px-3 my-0.5 text-[#3B3B3B]">
                  General Inquiry
                </SelectItem>
                <SelectItem value="internship" className="cursor-pointer hover:bg-[#BCD96C]/10 focus:bg-[#BCD96C]/10 rounded-md py-2.5 px-3 my-0.5 text-[#3B3B3B]">
                  Internship Inquiry
                </SelectItem>
                <SelectItem value="high-school" className="cursor-pointer hover:bg-[#BCD96C]/10 focus:bg-[#BCD96C]/10 rounded-md py-2.5 px-3 my-0.5 text-[#3B3B3B]">
                  High School Program
                </SelectItem>
              </SelectContent>
            </Select>
            {errors.inquiryType && (
              <p className="mt-1 text-sm text-red-500">{errors.inquiryType}</p>
            )}
          </div>
        )}

        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#3B3B3B]">
            Full Name <span className="text-red-500">*</span>
          </label>
          <Input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            className="text-sm placeholder:text-[#3B3B3B]/40 border-[#3B3B3B]/20 hover:border-[#3B3B3B]/40 transition-colors"
            aria-invalid={errors.name ? "true" : "false"}
            required
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-500">{errors.name}</p>
          )}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#3B3B3B]">
            Email Address <span className="text-red-500">*</span>
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="john@example.com"
            className="text-sm placeholder:text-[#3B3B3B]/40 border-[#3B3B3B]/20 hover:border-[#3B3B3B]/40 transition-colors"
            aria-invalid={errors.email ? "true" : "false"}
            required
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-500">{errors.email}</p>
          )}
        </div>

        {formType === "demo" && (
          <>
            <div>
              <label htmlFor="organization" className="mb-2 block text-sm font-medium text-[#3B3B3B]">
                Organization Name <span className="text-red-500">*</span>
              </label>
              <Input
                id="organization"
                name="organization"
                type="text"
                value={(formData as any).organization || ""}
                onChange={handleChange}
                placeholder="Personal, School Name, or Company Name"
                className="text-sm placeholder:text-[#3B3B3B]/40 border-[#3B3B3B]/20 hover:border-[#3B3B3B]/40 transition-colors"
                aria-invalid={errors.organization ? "true" : "false"}
                required
              />
              {errors.organization && (
                <p className="mt-1 text-sm text-red-500">{errors.organization}</p>
              )}
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#3B3B3B]">
                  Phone Number (Optional)
                </label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={(formData as any).phone || ""}
                  onChange={(e) => {
                    const inputValue = e.target.value;
                    const cleaned = inputValue.replace(/[^\d\s()\-]/g, '');
                    const formatted = formatPhoneNumber(cleaned);
                    setFormData((prev) => ({ ...prev, phone: formatted }));
                    if (errors.phone) {
                      setErrors((prev) => {
                        const newErrors = { ...prev };
                        delete newErrors.phone;
                        return newErrors;
                      });
                    }
                  }}
                  onKeyDown={(e) => {
                    if ([8, 9, 27, 13, 46].indexOf(e.keyCode) !== -1 ||
                        (e.keyCode === 65 && e.ctrlKey === true) ||
                        (e.keyCode === 67 && e.ctrlKey === true) ||
                        (e.keyCode === 86 && e.ctrlKey === true) ||
                        (e.keyCode === 88 && e.ctrlKey === true) ||
                        (e.keyCode >= 35 && e.keyCode <= 39)) {
                      return;
                    }
                    if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
                      e.preventDefault();
                    }
                  }}
                  placeholder="(555) 123-4567"
                  className="text-sm placeholder:text-[#3B3B3B]/40 border-[#3B3B3B]/20 hover:border-[#3B3B3B]/40 transition-colors"
                  aria-invalid={errors.phone ? "true" : "false"}
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
                )}
              </div>

              <div>
                <label htmlFor="preferredDate" className="mb-2 block text-sm font-medium text-[#3B3B3B]">
                  Preferred Date (Optional)
                </label>
                <Input
                  id="preferredDate"
                  name="preferredDate"
                  type="date"
                  value={(formData as any).preferredDate || ""}
                  onChange={handleChange}
                  className="text-sm border-[#3B3B3B]/20 hover:border-[#3B3B3B]/40 transition-colors"
                  aria-invalid={errors.preferredDate ? "true" : "false"}
                />
                {errors.preferredDate && (
                  <p className="mt-1 text-sm text-red-500">{errors.preferredDate}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div>
                <label htmlFor="preferredTime" className="mb-2 block text-sm font-medium text-[#3B3B3B]">
                  Preferred Time (Optional)
                </label>
                <Input
                  id="preferredTime"
                  name="preferredTime"
                  type="time"
                  value={(formData as any).preferredTime || ""}
                  onChange={handleChange}
                  className="text-sm border-[#3B3B3B]/20 hover:border-[#3B3B3B]/40 transition-colors"
                  aria-invalid={errors.preferredTime ? "true" : "false"}
                />
                {errors.preferredTime && (
                  <p className="mt-1 text-sm text-red-500">{errors.preferredTime}</p>
                )}
              </div>

              <div>
                <label htmlFor="timezone" className="mb-2 block text-sm font-medium text-[#3B3B3B]">
                  <div className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Timezone (Optional)
                  </div>
                </label>
                <Select
                  value={(formData as any).timezone || "America/New_York"}
                  onValueChange={(value) => handleSelectChange("timezone", value)}
                >
                  <SelectTrigger className="w-full text-sm data-[placeholder]:text-[#3B3B3B]/40 text-[#3B3B3B] border-[#3B3B3B]/20 hover:border-[#3B3B3B]/40 transition-colors [&>*[data-slot='select-value']]:hidden" aria-invalid={errors.timezone ? "true" : "false"}>
                    <SelectValue placeholder="Select timezone" />
                    <span className="flex-1 text-left">
                      {(formData as any).timezone 
                        ? getTimezoneLabel((formData as any).timezone) 
                        : <span className="text-[#3B3B3B]/40">Select timezone</span>}
                    </span>
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px] z-[9999] bg-white border border-[#3B3B3B]/20 shadow-lg rounded-lg p-1 [&>button[data-slot='select-scroll-up-button']]:hidden [&>button[data-slot='select-scroll-down-button']]:hidden" side="bottom" sideOffset={4} align="start" alignItemWithTrigger={false} collisionAvoidance={{ side: "none" }}>
                    {timezones.map((tz) => (
                      <SelectItem key={tz.value} value={tz.value} className="cursor-pointer hover:bg-[#BCD96C]/10 focus:bg-[#BCD96C]/10 rounded-md py-2.5 px-3 my-0.5 text-[#3B3B3B]">
                        {tz.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.timezone && (
                  <p className="mt-1 text-sm text-red-500">{errors.timezone}</p>
                )}
              </div>
            </div>
          </>
        )}

        <div>
          <label htmlFor="message" className="mb-2 block text-sm font-medium text-[#3B3B3B]">
            Message <span className="text-red-500">*</span>
          </label>
          <Textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder={
              formType === "demo"
                ? "Tell us about your organization and what you'd like to learn about ámaxa..."
                : "Tell us how we can help you..."
            }
            className="text-sm min-h-[120px] placeholder:text-[#3B3B3B]/40 border-[#3B3B3B]/20 hover:border-[#3B3B3B]/40 transition-colors"
            aria-invalid={errors.message ? "true" : "false"}
            required
          />
          {errors.message && (
            <p className="mt-1 text-sm text-red-500">{errors.message}</p>
          )}
        </div>

        {submitStatus.type && (
          <div
            className={`rounded-lg p-4 ${
              submitStatus.type === "success"
                ? "bg-green-50 text-green-800 border-2 border-green-300"
                : "bg-red-50 text-red-800 border-2 border-red-300"
            }`}
          >
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                {submitStatus.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                ) : null}
                <div className="flex-1">
                  <p className="text-sm font-medium">{submitStatus.message}</p>
                </div>
              </div>
              {submitStatus.referenceId && submitStatus.type === "success" && (
                <div className="bg-white/60 rounded-md p-3 border border-green-300/50">
                  <p className="text-xs text-green-700 mb-1">Reference ID for Lauren:</p>
                  <p className="text-lg font-bold text-green-900 font-mono tracking-wide">
                    {submitStatus.referenceId}
                  </p>
                  <p className="text-xs text-green-700 mt-2">
                    Lauren can look up this reference ID in her email to find your message.
                  </p>
                </div>
              )}
              {submitStatus.calendarLink && formType === "demo" && submitStatus.type === "success" && (
                <div className="mt-3">
                  <a
                    href={submitStatus.calendarLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm font-medium transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 13V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h8"/>
                      <line x1="16" x2="16" y1="2" y2="6"/>
                      <line x1="8" x2="8" y1="2" y2="6"/>
                      <line x1="3" x2="21" y1="10" y2="10"/>
                      <path d="M19 16v6"/>
                      <line x1="16" x2="22" y1="19" y2="19"/>
                    </svg>
                    Add to Google Calendar (Video Call)
                  </a>
                  <p className="text-xs text-green-700 mt-2">
                    Click to create a calendar event. Lauren will receive the invite.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          type="submit"
          className="w-full bg-[#3B3B3B] hover:bg-[#3B3B3B]/90 text-white"
          disabled={isSubmitting}
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
          <div className="mt-4 rounded-lg bg-[#BCD96C]/10 border border-[#BCD96C]/30 p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-[#3B3B3B] mt-0.5 flex-shrink-0" />
              <div className="text-sm text-[#3B3B3B]/80">
                <p className="font-medium mb-1">Where does this message go?</p>
                <p>
                  Your message will be sent directly to <strong>lauren@amaxaimpact.org</strong>. A team member will reply directly to your email address. We typically respond within 1-2 business days.
                </p>
              </div>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}
