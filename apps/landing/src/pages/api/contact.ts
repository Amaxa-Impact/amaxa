import type { APIRoute } from "astro";

import { RESEND_FROM_EMAIL, sendContactEmail } from "@amaxa/resend";

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Check if RESEND_API_KEY is available
    if (!process.env.RESEND_API_KEY) {
      console.error("RESEND_API_KEY is not set in environment variables");
      return new Response(
        JSON.stringify({
          success: false,
          error: "Email service is not configured. Please contact support.",
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const body: unknown = await request.json();

    // Basic runtime validation instead of Arktype to avoid brittle errors
    const {
      name,
      email,
      message,
      formType,
      organization,
      phone,
      preferredDate,
      preferredTime,
      timezone,
    } = (body ?? {}) as Record<string, unknown>;

    const errors: string[] = [];

    if (typeof name !== "string" || name.trim().length === 0) {
      errors.push("Name is required.");
    }

    if (typeof email !== "string" || email.trim().length === 0) {
      errors.push("Email is required.");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push("Email address is invalid.");
    }

    if (typeof message !== "string" || message.trim().length < 10) {
      errors.push("Message must be at least 10 characters.");
    }

    const allowedFormTypes = ["internship", "high-school", "general", "demo"] as const;
    if (typeof formType !== "string" || !allowedFormTypes.includes(formType as any)) {
      errors.push("Invalid inquiry type.");
    }

    if (errors.length > 0) {
      return new Response(
        JSON.stringify({
          success: false,
          message: errors.join(" "),
        }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    const validatedData = {
      name: name as string,
      email: email as string,
      message: message as string,
      formType: formType as string,
      organization: typeof organization === "string" ? organization : undefined,
      phone: typeof phone === "string" ? phone : undefined,
      preferredDate: typeof preferredDate === "string" ? preferredDate : undefined,
      preferredTime: typeof preferredTime === "string" ? preferredTime : undefined,
      timezone: typeof timezone === "string" ? timezone : undefined,
    };
    const recipientEmail = "lauren@amaxaimpact.org";

    const resultEmail = await sendContactEmail({
      formData: validatedData,
      recipientEmail,
      fromEmail: RESEND_FROM_EMAIL,
    });

    if (!resultEmail.success) {
      console.error("Resend email failed:", {
        error: resultEmail.error,
        referenceId: resultEmail.referenceId,
        formType: validatedData.formType,
      });
      return new Response(
        JSON.stringify({
          success: false,
          message: resultEmail.error || "Failed to send message. Please try again.",
          error: resultEmail.error,
          referenceId: resultEmail.referenceId,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        },
      );
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "Your message has been sent successfully!",
        referenceId: resultEmail.referenceId,
        calendarLink: resultEmail.calendarLink,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("Error details:", {
      message: errorMessage,
      stack: error instanceof Error ? error.stack : undefined,
    });
    return new Response(
      JSON.stringify({
        success: false,
        error: errorMessage || "Failed to send message. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
