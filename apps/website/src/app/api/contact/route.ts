import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";

// Schema for contact form submissions
const contactFormSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  message: z.string().min(1, "Message is required"),
  formType: z.enum([
    "internship",
    "high-school",
    "general",
    "demo",
  ]),
  organization: z.string().optional(),
  phone: z.string().optional(),
  preferredDate: z.string().optional(),
  preferredTime: z.string().optional(),
  timezone: z.string().optional(),
});

// Generate a unique reference ID for tracking
function generateReferenceId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `AMX-${timestamp}-${random}`;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = contactFormSchema.parse(body);

    // Get email recipient based on form type
    // TESTING: Changed to jyang.scholar@gmail.com for testing
    const recipientEmail = "jyang.scholar@gmail.com";
    
    // Email configuration
    // TODO: Once you verify a domain in Resend, change this to your verified domain
    // Example: "Ámaxa Contact Form <contact@amaxaimpact.org>"
    // For now, using Resend's testing domain (only works for verified email addresses)
    const fromEmail = process.env.RESEND_FROM_EMAIL || "Ámaxa Contact Form <onboarding@resend.dev>";

    // Validate that user's email is different from recipient email
    if (validatedData.email.toLowerCase().trim() === recipientEmail.toLowerCase().trim()) {
      return NextResponse.json(
        { 
          success: false, 
          error: "Invalid email address",
          message: "You cannot use the recipient email address. Please use your own email address to receive confirmation.",
          code: "INVALID_EMAIL_RECIPIENT"
        },
        { status: 400 }
      );
    }

    // Generate unique reference ID for this submission
    const referenceId = generateReferenceId();

    // Format the email subject based on form type
    const formTypeLabels = {
      internship: "Internship Inquiry",
      "high-school": "High School Program Inquiry",
      general: "General Inquiry",
      demo: "Demo/Intro Call Request",
    };

    const subject = `${formTypeLabels[validatedData.formType]} - ${validatedData.name}`;

    // Format plain text email body (fallback)
    let emailBodyText = `New ${formTypeLabels[validatedData.formType]} from Ámaxa Contact Form\n\n`;
    emailBodyText += `Reference ID: ${referenceId}\n\n`;
    emailBodyText += `Name: ${validatedData.name}\n`;
    emailBodyText += `Email: ${validatedData.email}\n`;
    
    if (validatedData.phone) {
      emailBodyText += `Phone: ${validatedData.phone}\n`;
    }
    
    if (validatedData.organization) {
      emailBodyText += `Organization: ${validatedData.organization}\n`;
    }
    
    if (validatedData.preferredDate) {
      emailBodyText += `Preferred Date: ${validatedData.preferredDate}\n`;
    }
    
    if (validatedData.preferredTime) {
      emailBodyText += `Preferred Time: ${validatedData.preferredTime}`;
      if (validatedData.timezone) {
        emailBodyText += ` (${validatedData.timezone})`;
      }
      emailBodyText += `\n`;
    }
    
    emailBodyText += `\nMessage:\n${validatedData.message}\n`;

    // Create professional HTML email template
    const formatDate = (dateString: string) => {
      if (!dateString) return "";
      try {
        const date = new Date(dateString);
        return date.toLocaleDateString("en-US", { 
          weekday: "long", 
          year: "numeric", 
          month: "long", 
          day: "numeric" 
        });
      } catch {
        return dateString;
      }
    };

    const formatTime = (timeString: string | undefined) => {
      if (!timeString) return "";
      try {
        const [hours, minutes] = timeString.split(":");
        if (!hours || !minutes) return timeString;
        const hour = parseInt(hours, 10);
        const ampm = hour >= 12 ? "PM" : "AM";
        const displayHour = hour % 12 || 12;
        return `${displayHour}:${minutes} ${ampm}`;
      } catch {
        return timeString;
      }
    };

    const formatTimezone = (tz: string | undefined) => {
      if (!tz) return "";
      const tzMap: Record<string, string> = {
        "America/Denver": "Mountain Time (MT)",
        "America/New_York": "Eastern Time (ET)",
        "America/Chicago": "Central Time (CT)",
        "America/Los_Angeles": "Pacific Time (PT)",
        "America/Phoenix": "Arizona Time (MST)",
        "America/Anchorage": "Alaska Time (AKT)",
        "Pacific/Honolulu": "Hawaii Time (HST)",
        "UTC": "UTC",
        "Europe/London": "London (GMT)",
        "Europe/Paris": "Paris (CET)",
        "Asia/Tokyo": "Tokyo (JST)",
        "Asia/Shanghai": "Shanghai (CST)",
        "Australia/Sydney": "Sydney (AEST)",
      };
      return tzMap[tz] || tz;
    };

    // Generate Google Calendar link for demo requests
    const generateCalendarLink = () => {
      if (validatedData.formType !== "demo" || !validatedData.preferredDate || !validatedData.preferredTime) {
        return null;
      }

      try {
        // Parse date and time - handle timezone if provided
        const dateStr = validatedData.preferredDate; // Format: YYYY-MM-DD
        const timeStr = validatedData.preferredTime; // Format: HH:MM
        
        // Create date object in local timezone
        const date = new Date(`${dateStr}T${timeStr}:00`);
        
        // If timezone is provided, adjust accordingly (for now, use local time)
        // Note: Google Calendar will use the user's timezone when they open the link
        
        // Create end time (1 hour later)
        const endDate = new Date(date);
        endDate.setHours(endDate.getHours() + 1);

        // Format for Google Calendar (YYYYMMDDTHHMMSSZ for UTC, or without Z for local)
        // Using UTC format for better compatibility
        const formatGoogleDate = (d: Date) => {
          const year = d.getFullYear();
          const month = String(d.getMonth() + 1).padStart(2, "0");
          const day = String(d.getDate()).padStart(2, "0");
          const hour = String(d.getHours()).padStart(2, "0");
          const min = String(d.getMinutes()).padStart(2, "0");
          const sec = "00";
          // Use UTC format for better compatibility across timezones
          return `${year}${month}${day}T${hour}${min}${sec}`;
        };

        const startTime = formatGoogleDate(date);
        const endTime = formatGoogleDate(endDate);

        // Build event details
        const eventTitle = `Ámaxa Demo/Intro Call - ${validatedData.name}`;
        
        let eventDetails = `Demo/Intro Call Request\n\n`;
        eventDetails += `Contact Information:\n`;
        eventDetails += `Name: ${validatedData.name}\n`;
        eventDetails += `Email: ${validatedData.email}\n`;
        if (validatedData.phone) {
          eventDetails += `Phone: ${validatedData.phone}\n`;
        }
        if (validatedData.organization) {
          eventDetails += `Organization: ${validatedData.organization}\n`;
        }
        if (validatedData.timezone) {
          eventDetails += `Timezone: ${formatTimezone(validatedData.timezone)}\n`;
        }
        eventDetails += `\nMessage:\n${validatedData.message}\n`;
        eventDetails += `\nReference ID: ${referenceId}`;

        const location = validatedData.organization || "TBD";
        
        // Properly encode all URL parameters
        const params = new URLSearchParams({
          action: 'TEMPLATE',
          text: eventTitle,
          dates: `${startTime}/${endTime}`,
          details: eventDetails,
          location: location,
        });
        
        const calendarUrl = `https://calendar.google.com/calendar/render?${params.toString()}`;

        return calendarUrl;
      } catch (error) {
        console.error("Error generating calendar link:", error);
        return null;
      }
    };

    const calendarLink = generateCalendarLink();

    const emailBodyHtml = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formTypeLabels[validatedData.formType]}</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f5f5f5;">
  <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="background-color: #f5f5f5; padding: 40px 20px;">
    <tr>
      <td align="center">
        <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="600" style="max-width: 600px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <!-- Header -->
          <tr>
            <td style="padding: 40px 40px 30px; background-color: #000000; border-radius: 8px 8px 0 0;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 300; letter-spacing: 1px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">ámaxa</h1>
              <div style="margin-top: 8px; height: 4px; width: 120px; background-color: #ffffff; border-radius: 2px;"></div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <!-- Inquiry Type Badge -->
              <div style="display: inline-block; background-color: #ffffff; color: #000000; padding: 6px 16px; border-radius: 20px; border: 1px solid #000000; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                ${formTypeLabels[validatedData.formType]}
              </div>
              
              <!-- Reference ID -->
              <div style="margin-bottom: 24px; padding: 12px 16px; background-color: #f0f0f0; border-radius: 4px; border-left: 3px solid #000000;">
                <strong style="color: #000000; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; display: block; margin-bottom: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">Reference ID</strong>
                <span style="color: #000000; font-size: 16px; font-weight: 600; font-family: monospace;">${referenceId}</span>
              </div>
              
              <h2 style="margin: 0 0 30px; color: #000000; font-size: 24px; font-weight: 400; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                New Contact Form Submission
              </h2>
              
              ${calendarLink ? `
              <!-- Google Calendar Link for Demo Requests -->
              <div style="margin-bottom: 30px; padding: 20px; background-color: #ffffff; border: 1px solid #000000; border-radius: 8px; text-align: center;">
                <h3 style="margin: 0 0 12px; color: #000000; font-size: 18px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">Schedule This Call</h3>
                <p style="margin: 0 0 16px; color: #000000; font-size: 14px; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  Click below to add this demo/intro call to your Google Calendar with all contact information included.
                </p>
                <a href="${calendarLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 12px 32px; border-radius: 4px; border: 1px solid #000000; font-size: 14px; font-weight: 600; margin-top: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  Add to Google Calendar
                </a>
                <p style="margin: 12px 0 0; color: #666666; font-size: 11px; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  If the button doesn't work, copy and paste this link into your browser:<br>
                  <span style="color: #000000; word-break: break-all; font-family: monospace; font-size: 10px;">${calendarLink}</span>
                </p>
              </div>
              ` : ""}
              
              <!-- Contact Information -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-bottom: 30px;">
                <tr>
                  <td style="padding: 16px; background-color: #f9f9f9; border-left: 3px solid #000000; border-radius: 4px;">
                    <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%">
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <strong style="color: #000000; font-size: 14px; display: block; margin-bottom: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">Name</strong>
                          <span style="color: #000000; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${validatedData.name}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <strong style="color: #000000; font-size: 14px; display: block; margin-bottom: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">Email</strong>
                          <a href="mailto:${validatedData.email}" style="color: #000000; font-size: 16px; text-decoration: none; border-bottom: 1px solid #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${validatedData.email}</a>
                        </td>
                      </tr>
                      ${validatedData.phone ? `
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <strong style="color: #000000; font-size: 14px; display: block; margin-bottom: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">Phone</strong>
                          <a href="tel:${validatedData.phone}" style="color: #000000; font-size: 16px; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${validatedData.phone}</a>
                        </td>
                      </tr>
                      ` : ""}
                      ${validatedData.organization ? `
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <strong style="color: #000000; font-size: 14px; display: block; margin-bottom: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">Organization</strong>
                          <span style="color: #000000; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${validatedData.organization}</span>
                        </td>
                      </tr>
                      ` : ""}
                      ${validatedData.preferredDate ? `
                      <tr>
                        <td style="padding-bottom: 12px;">
                          <strong style="color: #000000; font-size: 14px; display: block; margin-bottom: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">Preferred Date</strong>
                          <span style="color: #000000; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${formatDate(validatedData.preferredDate)}</span>
                        </td>
                      </tr>
                      ` : ""}
                      ${validatedData.preferredTime ? `
                      <tr>
                        <td>
                          <strong style="color: #000000; font-size: 14px; display: block; margin-bottom: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">Preferred Time</strong>
                          <span style="color: #000000; font-size: 16px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                            ${formatTime(validatedData.preferredTime)}
                            ${validatedData.timezone ? ` (${formatTimezone(validatedData.timezone)})` : ""}
                          </span>
                        </td>
                      </tr>
                      ` : ""}
                    </table>
                  </td>
                </tr>
              </table>
              
              <!-- Message -->
              <div style="margin-top: 30px;">
                <strong style="color: #000000; font-size: 14px; display: block; margin-bottom: 12px; text-transform: uppercase; letter-spacing: 0.5px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">Message</strong>
                <div style="background-color: #f9f9f9; padding: 20px; border-radius: 4px; border-left: 3px solid #000000; color: #000000; font-size: 15px; line-height: 1.6; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${validatedData.message.replace(/\n/g, "<br>")}</div>
              </div>
              
              <!-- Reply Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${validatedData.email}?subject=${encodeURIComponent(`Re: ${subject}`)}&body=${encodeURIComponent(`Hi ${validatedData.name.split(' ')[0]},\n\nThank you for your inquiry. I'll get back to you soon.\n\nBest regards,\nLauren`)}" style="display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 14px 36px; border-radius: 4px; border: 1px solid #000000; font-size: 15px; font-weight: 600; margin-top: 20px; letter-spacing: 0.3px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                      Reply to ${validatedData.name.split(' ')[0]}
                    </a>
                    <p style="margin: 12px 0 0; color: #666666; font-size: 11px; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                      If the button doesn't work, you can reply directly to: <a href="mailto:${validatedData.email}" style="color: #000000; text-decoration: underline;">${validatedData.email}</a>
                    </p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; color: #000000; font-size: 12px; text-align: center; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                This email was sent from the Ámaxa Contact Form.<br>
                Visit our <a href="https://www.amaxaimpact.org/" style="color: #000000; text-decoration: underline;">website</a>: <a href="https://www.amaxaimpact.org/" style="color: #000000; text-decoration: underline;">https://www.amaxaimpact.org/</a>
              </p>
              <p style="margin: 12px 0 0; color: #666666; font-size: 10px; text-align: center; line-height: 1.4; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                Note: If links appear blocked by your email provider, this is a temporary security measure. All links are safe. Copy and paste the URLs directly into your browser if needed.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `.trim();

    // Try to send email using Resend if available
    let emailSent = false;
    let emailError: string | null = null;

    try {
      // Check if Resend is available (requires: pnpm add resend)
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const { Resend } = await import("resend");
      
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const resendApiKey = process.env.RESEND_API_KEY;
      
      if (!resendApiKey) {
        throw new Error("RESEND_API_KEY environment variable is not set");
      }

      const resend = new Resend(resendApiKey);
      
      console.log("📤 Attempting to send email to:", recipientEmail);
      console.log("📤 Subject:", subject);
      console.log("📤 From:", fromEmail);
      
      const emailResult = await resend.emails.send({
        from: fromEmail,
        to: recipientEmail,
        subject: subject,
        html: emailBodyHtml,
        text: emailBodyText,
        replyTo: validatedData.email,
        // Removed priority headers - they can actually trigger spam filters
        // SPF, DKIM, and DMARC (via domain verification) are the proper way to ensure deliverability
      });

      console.log("📥 Resend API Response:", JSON.stringify(emailResult, null, 2));

      if (emailResult.error) {
        console.error(" Resend API Error:", emailResult.error);
        throw new Error(emailResult.error.message || "Failed to send email");
      }

      if (!emailResult.data) {
        console.warn("⚠️ No data in response, but no error either");
      }

      emailSent = true;
      console.log("✅ Email sent successfully to:", recipientEmail);
      console.log("✅ Email ID:", emailResult.data?.id);
      console.log("✅ Full response data:", emailResult.data);
    } catch (error) {
      emailError = error instanceof Error ? error.message : "Unknown error";
      console.error(" Email sending failed:", emailError);
      
      // Log the email details for debugging
      console.log("\n📧 Email Details (not sent):");
      console.log("To:", recipientEmail);
      console.log("Subject:", subject);
      console.log("Body (text):", emailBodyText);
      console.log("\n💡 To enable email sending:");
      console.log("1. Install Resend: pnpm add resend");
      console.log("2. Get API key from https://resend.com");
      console.log("3. Add RESEND_API_KEY to your .env file");
    }

    // Return success even if email service isn't configured (for testing)
    // In production, you might want to return an error if email fails
    return NextResponse.json(
      { 
        success: true, 
        message: emailSent 
          ? "Your message has been sent successfully!" 
          : "Your message was received! (Email service not configured - check console for details)",
        emailSent,
        emailError: emailError || undefined,
        referenceId: referenceId,
        calendarLink: calendarLink || undefined,
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

    console.error("Error sending email:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message. Please try again." },
      { status: 500 }
    );
  }
}

