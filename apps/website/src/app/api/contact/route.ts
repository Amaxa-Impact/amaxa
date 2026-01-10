import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import {
  contactFormSchema,
  sendContactEmail,
} from "@amaxa/resend";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    const recipientEmail = "lauren@amaxaimpact.org";
    
    const fromEmail = process.env.RESEND_FROM_EMAIL || "contact@amaxaimpact.org";

    const result = await sendContactEmail({
      formData: validatedData,
      recipientEmail,
      fromEmail,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Failed to send message. Please try again.",
          error: result.error,
          referenceId: result.referenceId,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your message has been sent successfully!",
        referenceId: result.referenceId,
        calendarLink: result.calendarLink,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: "Invalid form data", details: error.errors },
        { status: 400 }
      );
    }

    console.error("Error processing contact form:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}
