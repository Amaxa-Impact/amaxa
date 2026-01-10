import {
  Body,
  Button,
  Container,
  Head,
  Html,
  Link,
  Preview,
  render,
  Section,
  Tailwind,
  Text,
} from "@react-email/components";

import type { ContactFormData } from "../types";
import { formTypeLabels } from "../types";
import { generateCalendarLink } from "../utils/calendar";
import { formatDate, formatTime, formatTimezone } from "../utils/formatting";

interface ContactEmailProps {
  formData: ContactFormData;
  referenceId: string;
}

export function ContactEmail({ formData, referenceId }: ContactEmailProps) {
  const calendarLink = generateCalendarLink(formData, referenceId);

  let easternTimeDisplay: string | null = null;
  if (formData.preferredDate && formData.preferredTime) {
    try {
      const dateInUserTz = new Date(
        `${formData.preferredDate}T${formData.preferredTime}:00`,
      );
      const easternTime = new Intl.DateTimeFormat("en-US", {
        timeZone: "America/New_York",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }).formatToParts(dateInUserTz);

      const monthET = easternTime.find((p) => p.type === "month")?.value;
      const dayET = easternTime.find((p) => p.type === "day")?.value;
      const hourET = easternTime.find((p) => p.type === "hour")?.value;
      const minuteET = easternTime.find((p) => p.type === "minute")?.value;
      const ampmET = easternTime
        .find((p) => p.type === "dayPeriod")
        ?.value.toUpperCase();

      easternTimeDisplay = `${monthET}/${dayET} at ${hourET}:${minuteET} ${ampmET} ET`;
    } catch {
      // Silently fail - will just show user's time without conversion
    }
  }

  const previewText = `New ${formTypeLabels[formData.formType]} from ${formData.name}`;

  return (
    <Html lang="en">
      <Head />
      <Preview>{previewText}</Preview>
      <Tailwind>
        <Body className="mx-auto my-0 bg-gray-100 p-0 font-sans">
          <Container className="mx-auto my-10 max-w-[600px] px-5">
            <Section className="overflow-hidden rounded-lg bg-white shadow-md">
              {/* Header */}
              <Section className="rounded-t-lg bg-black px-10 py-10">
                <Text className="my-0 text-[32px] font-light tracking-[2px] text-white">
                  ámaxa
                </Text>
                <div
                  style={{
                    marginTop: "8px",
                    height: "4px",
                    width: "120px",
                    backgroundColor: "#ffffff",
                    borderRadius: "2px",
                  }}
                />
              </Section>

              {/* Content */}
              <Section className="px-10 py-10">
                {/* Inquiry Type Badge */}
                <div
                  style={{
                    display: "inline-block",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    padding: "8px 18px",
                    borderRadius: "20px",
                    border: "1px solid #000000",
                    fontSize: "11px",
                    fontWeight: "600",
                    textTransform: "uppercase",
                    letterSpacing: "1px",
                    marginBottom: "20px",
                  }}
                >
                  {formTypeLabels[formData.formType]}
                </div>

                {/* Reference ID */}
                <Section
                  style={{
                    marginBottom: "32px",
                    padding: "16px 20px",
                    backgroundColor: "#f0f0f0",
                    borderRadius: "4px",
                    borderLeft: "3px solid #000000",
                  }}
                >
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: "10px",
                      textTransform: "uppercase",
                      letterSpacing: "1px",
                      margin: "0 0 8px 0",
                      fontWeight: "bold",
                    }}
                  >
                    Reference ID
                  </Text>
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: "18px",
                      fontWeight: "600",
                      fontFamily: "'Courier New', 'Monaco', monospace",
                      letterSpacing: "0.5px",
                      margin: 0,
                    }}
                  >
                    {referenceId}
                  </Text>
                </Section>

                <Text className="mt-0 mb-8 text-[26px] leading-[1.5] font-normal tracking-[0.3px] text-black">
                  New Contact Form Submission
                </Text>

                {/* Google Calendar Link for Demo Requests */}
                {calendarLink && (
                  <Section
                    style={{
                      marginBottom: "30px",
                      padding: "20px",
                      backgroundColor: "#ffffff",
                      border: "1px solid #000000",
                      borderRadius: "8px",
                      textAlign: "center",
                    }}
                  >
                    <Text className="mt-0 mb-3.5 text-[20px] font-medium tracking-[0.4px] text-black">
                      Schedule This Call
                    </Text>
                    <Text className="mt-0 mb-4 text-[15px] leading-[1.7] text-black">
                      Click below to add this demo/intro call to your Google
                      Calendar with all contact information included.
                    </Text>
                    <Button
                      href={calendarLink}
                      style={{
                        backgroundColor: "#ffffff",
                        color: "#000000",
                        textDecoration: "none",
                        padding: "14px 36px",
                        borderRadius: "4px",
                        border: "1px solid #000000",
                        fontSize: "15px",
                        fontWeight: "600",
                        marginTop: "8px",
                        letterSpacing: "0.3px",
                        display: "inline-block",
                      }}
                    >
                      Add to Google Calendar
                    </Button>
                  </Section>
                )}

                {/* Contact Information */}
                <Section
                  style={{
                    marginBottom: "32px",
                    padding: "20px",
                    backgroundColor: "#f9f9f9",
                    borderLeft: "3px solid #000000",
                    borderRadius: "4px",
                  }}
                >
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: "18px",
                      fontWeight: "500",
                      lineHeight: "1.8",
                      marginBottom: "16px",
                      marginTop: 0,
                    }}
                  >
                    {formData.name}
                  </Text>

                  <Text style={{ marginBottom: "12px", marginTop: 0 }}>
                    <Link
                      href={`mailto:${formData.email}`}
                      style={{
                        color: "#000000",
                        fontSize: "17px",
                        textDecoration: "none",
                        borderBottom: "1px solid #000000",
                        lineHeight: "1.6",
                      }}
                    >
                      {formData.email}
                    </Link>
                  </Text>

                  {formData.phone && (
                    <Text style={{ marginBottom: "12px", marginTop: 0 }}>
                      <Link
                        href={`tel:${formData.phone}`}
                        style={{
                          color: "#000000",
                          fontSize: "17px",
                          textDecoration: "none",
                          lineHeight: "1.6",
                        }}
                      >
                        {formData.phone}
                      </Link>
                    </Text>
                  )}

                  {formData.organization && (
                    <div style={{ marginBottom: "12px" }}>
                      <Text
                        style={{
                          color: "#000000",
                          fontSize: "12px",
                          display: "block",
                          marginBottom: "4px",
                          textTransform: "uppercase",
                          letterSpacing: "0.5px",
                          marginTop: 0,
                          fontWeight: "bold",
                        }}
                      >
                        Organization
                      </Text>
                      <Text
                        style={{
                          color: "#000000",
                          fontSize: "17px",
                          lineHeight: "1.6",
                          margin: 0,
                        }}
                      >
                        {formData.organization}
                      </Text>
                    </div>
                  )}

                  {formData.preferredDate && formData.preferredTime && (
                    <div
                      style={{
                        marginTop: "16px",
                        paddingTop: "16px",
                        borderTop: "1px solid #e0e0e0",
                      }}
                    >
                      <Text
                        style={{
                          color: "#000000",
                          fontSize: "17px",
                          lineHeight: "1.6",
                          marginBottom: "4px",
                          marginTop: 0,
                        }}
                      >
                        {formatDate(formData.preferredDate)} at{" "}
                        {formatTime(formData.preferredTime)} (
                        {formatTimezone(formData.timezone)})
                      </Text>
                      {easternTimeDisplay && (
                        <Text
                          style={{
                            color: "#666666",
                            fontSize: "15px",
                            lineHeight: "1.5",
                            margin: 0,
                          }}
                        >
                          {easternTimeDisplay}
                        </Text>
                      )}
                    </div>
                  )}
                </Section>

                {/* Message */}
                <div style={{ marginTop: 0 }}>
                  <Text
                    style={{
                      color: "#000000",
                      fontSize: "14px",
                      display: "block",
                      marginBottom: "16px",
                      fontWeight: "600",
                      letterSpacing: "0.2px",
                      marginTop: 0,
                    }}
                  >
                    {formData.name.split(" ")[0]}'s Message:
                  </Text>
                  <div
                    style={{
                      backgroundColor: "#f9f9f9",
                      padding: "24px",
                      borderRadius: "4px",
                      borderLeft: "3px solid #000000",
                      color: "#000000",
                      fontSize: "16px",
                      lineHeight: "1.8",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {formData.message}
                  </div>
                </div>

                {/* Reply Button */}
                <Section style={{ marginTop: "30px", textAlign: "center" }}>
                  <Button
                    href={`mailto:${formData.email}?subject=${encodeURIComponent(`Re: ${formTypeLabels[formData.formType]} - ${formData.name}`)}`}
                    style={{
                      backgroundColor: "#ffffff",
                      color: "#000000",
                      textDecoration: "none",
                      padding: "15px 38px",
                      borderRadius: "4px",
                      border: "1px solid #000000",
                      fontSize: "15px",
                      fontWeight: "600",
                      marginTop: "24px",
                      letterSpacing: "0.4px",
                      display: "inline-block",
                    }}
                  >
                    Reply to {formData.name.split(" ")[0]}
                  </Button>
                </Section>
              </Section>

              {/* Footer */}
              <Section
                style={{
                  padding: "30px 40px",
                  backgroundColor: "#f9f9f9",
                  borderRadius: "0 0 8px 8px",
                  borderTop: "1px solid #e5e5e5",
                }}
              >
                <Text
                  style={{
                    margin: 0,
                    color: "#000000",
                    fontSize: "13px",
                    textAlign: "center",
                    lineHeight: "1.7",
                  }}
                >
                  This email was sent from the ámaxa Contact Form.
                </Text>
                <Text
                  style={{
                    margin: "14px 0 0",
                    color: "#666666",
                    fontSize: "12px",
                    textAlign: "center",
                    lineHeight: "1.6",
                  }}
                >
                  If any links appear blocked by your email provider, this is a
                  temporary security measure. All links are safe and verified.
                  As a nonprofit organization, we take your security and privacy
                  seriously. If needed, you can copy and paste URLs directly
                  into your browser.
                </Text>
              </Section>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
}

/**
 * Render the email component to HTML string (optional - Resend can handle React components directly)
 * This is kept for cases where you need the HTML string directly (e.g., preview, testing)
 */
export async function generateEmailHtml(
  formData: ContactFormData,
  referenceId: string,
): Promise<string> {
  return await render(
    <ContactEmail formData={formData} referenceId={referenceId} />,
  );
}

/**
 * Generate plain text version of the email
 */
export function generateEmailText(
  formData: ContactFormData,
  referenceId: string,
): string {
  let emailBodyText = `New ${formTypeLabels[formData.formType]} from ámaxa Contact Form\n\n`;
  emailBodyText += `Reference ID: ${referenceId}\n\n`;
  emailBodyText += `Name: ${formData.name}\n`;
  emailBodyText += `Email: ${formData.email}\n`;

  if (formData.phone) {
    emailBodyText += `Phone: ${formData.phone}\n`;
  }

  if (formData.organization) {
    emailBodyText += `Organization: ${formData.organization}\n`;
  }

  if (formData.preferredDate) {
    emailBodyText += `Preferred Date: ${formData.preferredDate}\n`;
  }

  if (formData.preferredTime) {
    emailBodyText += `Preferred Time: ${formData.preferredTime}`;
    if (formData.timezone) {
      emailBodyText += ` (${formData.timezone})`;
    }
    emailBodyText += `\n`;
  }

  emailBodyText += `\nMessage:\n${formData.message}\n`;

  return emailBodyText;
}

// Export the component as default for preview purposes
export default ContactEmail;
