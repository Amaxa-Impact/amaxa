import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { type } from "arktype";

import { contactFormSchema, sendContactEmail } from "@amaxa/resend";

import { env } from "~/env";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = contactFormSchema(body);
    if (data instanceof type.errors) {
      return NextResponse.json({ error: data.summary }, { status: 400 });
    }

    const validatedData = data;

    const recipientEmail = "lauren@amaxaimpact.org";

    const fromEmail = env.RESEND_FROM_EMAIL ?? "contact@amaxaimpact.org";

    const resultEmail = await sendContactEmail({
      formData: validatedData,
      recipientEmail,
      fromEmail,
    });

    if (!resultEmail.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send message. Please try again.",
          error: resultEmail.error,
          referenceId: resultEmail.referenceId,
        },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
        referenceId: resultEmail.referenceId,
        calendarLink: resultEmail.calendarLink,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 },
    );
  }
}
