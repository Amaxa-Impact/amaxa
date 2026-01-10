import type { ContactFormData } from "./types";
import { createResendClient } from "./client";
import { ContactEmail, generateEmailText } from "./templates/contact-email";
import { formTypeLabels } from "./types";
import { generateCalendarLink } from "./utils/calendar";
import { generateReferenceId } from "./utils/reference-id";

export interface SendEmailOptions {
  formData: ContactFormData;
  recipientEmail?: string;
  fromEmail?: string;
}

export interface SendEmailResult {
  success: boolean;
  error?: string;
  referenceId: string;
  calendarLink?: string;
  emailId?: string;
}

/**
 * Send a contact form email via Resend
 */
export async function sendContactEmail(
  options: SendEmailOptions,
): Promise<SendEmailResult> {
  const {
    formData,
    recipientEmail = "lauren@amaxaimpact.org",
    fromEmail = process.env.RESEND_FROM_EMAIL ?? "contact@amaxaimpact.org",
  } = options;

  const referenceId = generateReferenceId();
  const subject = `${formTypeLabels[formData.formType]} - ${formData.name}`;
  const emailBodyText = generateEmailText(formData, referenceId);
  const calendarLink = generateCalendarLink(formData, referenceId);

  try {
    const resend = createResendClient();

    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: recipientEmail,
      subject,
      react: <ContactEmail formData={formData} referenceId={referenceId} />,
      text: emailBodyText,
      replyTo: formData.email,
      tags: [
        { name: "form_type", value: formData.formType },
        { name: "category", value: "contact_form" },
      ],
    });

    if (error) {
      return {
        success: false,
        error: error.message,
        referenceId,
        calendarLink: calendarLink ?? undefined,
      };
    }

    return {
      success: true,
      referenceId,
      calendarLink: calendarLink ?? undefined,
      emailId: data.id,
    };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
      referenceId,
      calendarLink: calendarLink ?? undefined,
    };
  }
}
