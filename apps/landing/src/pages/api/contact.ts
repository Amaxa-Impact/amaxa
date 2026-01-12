import type { APIRoute } from "astro";
import { type } from "arktype";

import {
  contactFormSchema,
  RESEND_FROM_EMAIL,
  sendContactEmail,
} from "@amaxa/resend";

export const POST: APIRoute = async ({ request }) => {
  try {
    const body: unknown = await request.json();
    const data = contactFormSchema(body);

    // Arktype error handling
    if (data instanceof type.errors) {
      return new Response(JSON.stringify({ error: data }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const validatedData = data;
    const recipientEmail = "lauren@amaxaimpact.org";

    const resultEmail = await sendContactEmail({
      formData: validatedData,
      recipientEmail,
      fromEmail: RESEND_FROM_EMAIL,
    });

    if (!resultEmail.success) {
      return new Response(
        JSON.stringify({
          success: false,
          message: "Failed to send message. Please try again.",
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
    return new Response(
      JSON.stringify({
        success: false,
        error: "Failed to send message. Please try again.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
