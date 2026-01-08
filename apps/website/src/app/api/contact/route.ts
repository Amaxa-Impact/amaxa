import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { z } from "zod";
import { formatTimezone } from "~/lib/timezones";

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
    // All form submissions go to lauren@amaxaimpact.org
    const recipientEmail = "lauren@amaxaimpact.org";
    
    // Email configuration
    // Using verified domain amaxaimpact.org
    const fromEmail = process.env.RESEND_FROM_EMAIL || "contact@amaxaimpact.org";

    // Removed validation - users can submit even if their email matches recipient
    // This allows testing and doesn't block legitimate use cases

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
    let emailBodyText = `New ${formTypeLabels[validatedData.formType]} from ámaxa Contact Form\n\n`;
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
        // Parse date string (format: YYYY-MM-DD) as local date to avoid timezone issues
        const [year, month, day] = dateString.split("-").map(Number);
        // month is 0-indexed in Date constructor, so subtract 1
        const date = new Date(year, month - 1, day);
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

    // Generate Google Calendar link for demo requests
    const generateCalendarLink = () => {
      if (validatedData.formType !== "demo" || !validatedData.preferredDate || !validatedData.preferredTime) {
        return null;
      }

      try {
        // Parse date and time - handle timezone if provided
        const dateStr = validatedData.preferredDate; // Format: YYYY-MM-DD
        const timeStr = validatedData.preferredTime; // Format: HH:MM
        const userTimezone = validatedData.timezone || "America/New_York"; // Default to EST if not provided
        
        // Convert user's selected time (in their timezone) to UTC for Google Calendar
        // User selects 7pm in their timezone, we need to find what UTC time that is
        const [year, month, day] = dateStr.split("-").map(Number);
        const [hours, minutes] = timeStr.split(":").map(Number);
        
        // Create a date representing the user's selected time
        // We'll interpret this as being in the user's timezone
        const userLocalDate = new Date(`${dateStr}T${timeStr}:00`);
        
        // Get what this time is in UTC by comparing with timezone-aware formatting
        // Format the same moment in both UTC and user's timezone to find the offset
        const utcFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: "UTC",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        
        const userTzFormatter = new Intl.DateTimeFormat("en-US", {
          timeZone: userTimezone,
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
        
        // Find a UTC time that, when displayed in user's timezone, equals their selected time
        // We'll use binary search or approximation
        // Simpler: calculate offset at this date
        if (
          typeof year !== "number" ||
          typeof month !== "number" ||
          typeof day !== "number" ||
          typeof hours !== "number" ||
          typeof minutes !== "number"
        ) {
          throw new Error("Invalid date or time components");
        }

        const testUtc = new Date(Date.UTC(year, month - 1, day, hours, minutes));
        const userDisplay = userTzFormatter.format(testUtc);
        const utcDisplay = utcFormatter.format(testUtc);

        // Parse the formatted strings to get actual values
        const userParts = userTzFormatter.formatToParts(testUtc);
        const userMonth = parseInt(userParts.find(p => p.type === "month")?.value || "1");
        const userDay = parseInt(userParts.find(p => p.type === "day")?.value || "1");
        const userHour = parseInt(userParts.find(p => p.type === "hour")?.value || "0");
        const userMin = parseInt(userParts.find(p => p.type === "minute")?.value || "0");
        
        // Calculate the difference
        const targetMonth = month;
        const targetDay = day;
        const targetHour = hours;
        const targetMin = minutes;
        
        // Calculate offset in hours
        const hourDiff = targetHour - userHour;
        const dayDiff = targetDay - userDay;
        const totalHourDiff = hourDiff + (dayDiff * 24);
        
        // Adjust UTC time
        const adjustedUtc = new Date(testUtc.getTime() + totalHourDiff * 60 * 60 * 1000);
        const endUtc = new Date(adjustedUtc.getTime() + 60 * 60 * 1000); // Add 1 hour
        
        // Format for Google Calendar in UTC (YYYYMMDDTHHMMSSZ)
        const formatGoogleDateUTC = (date: Date) => {
          const y = date.getUTCFullYear();
          const m = String(date.getUTCMonth() + 1).padStart(2, "0");
          const d = String(date.getUTCDate()).padStart(2, "0");
          const h = String(date.getUTCHours()).padStart(2, "0");
          const min = String(date.getUTCMinutes()).padStart(2, "0");
          return `${y}${m}${d}T${h}${min}00Z`;
        };

        const startTime = formatGoogleDateUTC(adjustedUtc);
        const endTime = formatGoogleDateUTC(endUtc);

        // Convert time to Eastern Time (EST/EDT) for Lauren
        // User selects time in their timezone, we convert to EST
        const convertToEasternTime = (dateStr: string, timeStr: string, userTimezone: string | undefined) => {
          try {
            if (!userTimezone) return null;
            
            // Parse the date and time
            const [year, month, day] = dateStr.split("-").map(Number);
            const [hours, minutes] = timeStr.split(":").map(Number);
            
            // Create a date representing the user's selected time in their timezone
            // We need to find what UTC time corresponds to this local time in user's TZ
            const userLocalDateStr = `${dateStr}T${timeStr}:00`;
            
            // Create a date object - this will be interpreted in server's local time
            // We need to convert it properly
            const tempDate = new Date(userLocalDateStr);
            
            // Get the UTC time that represents this moment
            // Then format it in Eastern Time
            const utcTime = tempDate.getTime();
            
            // Format in Eastern Time (America/New_York handles EST/EDT automatically)
            const easternTime = new Intl.DateTimeFormat("en-US", {
              timeZone: "America/New_York",
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              hour12: true,
            }).formatToParts(new Date(utcTime));
            
            const monthET = easternTime.find(p => p.type === "month")?.value;
            const dayET = easternTime.find(p => p.type === "day")?.value;
            const hourET = easternTime.find(p => p.type === "hour")?.value;
            const minuteET = easternTime.find(p => p.type === "minute")?.value;
            const ampmET = easternTime.find(p => p.type === "dayPeriod")?.value?.toUpperCase();
            
            return `${monthET}/${dayET} at ${hourET}:${minuteET} ${ampmET} ET`;
          } catch {
            return null;
          }
        };

        // Build event details with improved formatting
        const eventTitle = `ámaxa Demo/Intro Call - ${validatedData.name}`;
        
        let eventDetails = `Reference ID: ${referenceId}\n\n`;
        eventDetails += `Demo/Intro Call Request\n\n`;
        eventDetails += `${validatedData.name}\n`;
        eventDetails += `${validatedData.email}\n`;
        if (validatedData.phone) {
          eventDetails += `${validatedData.phone}\n`;
        }
        if (validatedData.organization) {
          eventDetails += `Organization: ${validatedData.organization}\n`;
        }
        if (validatedData.preferredDate && validatedData.preferredTime) {
          const userTimeStr = `${formatDate(validatedData.preferredDate)} at ${formatTime(validatedData.preferredTime)}`;
          const easternTimeStr = convertToEasternTime(validatedData.preferredDate, validatedData.preferredTime, validatedData.timezone);
          if (easternTimeStr) {
            eventDetails += `\nPreferred Time:\n${userTimeStr} (${formatTimezone(validatedData.timezone || "")})\n${easternTimeStr}\n`;
          } else {
            eventDetails += `\nPreferred Time: ${userTimeStr} (${formatTimezone(validatedData.timezone || "")})\n`;
          }
        }
        eventDetails += `\n${validatedData.name.split(' ')[0]}'s Message:\n\n${validatedData.message}\n`;

        // Properly encode all URL parameters
        const params = new URLSearchParams({
          action: 'TEMPLATE',
          text: eventTitle,
          dates: `${startTime}/${endTime}`,
          details: eventDetails,
          add: validatedData.email, // Add user's email as guest
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
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 300; letter-spacing: 2px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">ámaxa</h1>
              <div style="margin-top: 8px; height: 4px; width: 120px; background-color: #ffffff; border-radius: 2px;"></div>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 40px;">
              <!-- Inquiry Type Badge -->
              <div style="display: inline-block; background-color: #ffffff; color: #000000; padding: 8px 18px; border-radius: 20px; border: 1px solid #000000; font-size: 11px; font-weight: 600; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 20px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                ${formTypeLabels[validatedData.formType]}
              </div>
              
              <!-- Reference ID -->
              <div style="margin-bottom: 32px; padding: 16px 20px; background-color: #f0f0f0; border-radius: 4px; border-left: 3px solid #000000;">
                <strong style="color: #000000; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; display: block; margin-bottom: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">Reference ID</strong>
                <span style="color: #000000; font-size: 18px; font-weight: 600; font-family: 'Courier New', 'Monaco', monospace; letter-spacing: 0.5px;">${referenceId}</span>
              </div>
              
              <h2 style="margin: 0 0 32px; color: #000000; font-size: 26px; font-weight: 400; line-height: 1.5; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; letter-spacing: 0.3px;">
                New Contact Form Submission
              </h2>
              
              ${calendarLink ? `
              <!-- Google Calendar Link for Demo Requests -->
              <div style="margin-bottom: 30px; padding: 20px; background-color: #ffffff; border: 1px solid #000000; border-radius: 8px; text-align: center;">
                <h3 style="margin: 0 0 14px; color: #000000; font-size: 20px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; letter-spacing: 0.4px;">Schedule This Call</h3>
                <p style="margin: 0 0 18px; color: #000000; font-size: 15px; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                  Click below to add this demo/intro call to your Google Calendar with all contact information included.
                </p>
                <a href="${calendarLink}" target="_blank" rel="noopener noreferrer" style="display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 14px 36px; border-radius: 4px; border: 1px solid #000000; font-size: 15px; font-weight: 600; margin-top: 8px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; letter-spacing: 0.3px;">
                  Add to Google Calendar
                </a>
              </div>
              ` : ""}
              
              <!-- Contact Information -->
              <div style="margin-bottom: 32px; padding: 20px; background-color: #f9f9f9; border-left: 3px solid #000000; border-radius: 4px;">
                <div style="color: #000000; font-size: 18px; font-weight: 500; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.8; margin-bottom: 16px;">
                  ${validatedData.name}
                </div>
                <div style="margin-bottom: 12px;">
                  <a href="mailto:${validatedData.email}" style="color: #000000; font-size: 17px; text-decoration: none; border-bottom: 1px solid #000000; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6;">${validatedData.email}</a>
                </div>
                ${validatedData.phone ? `
                <div style="margin-bottom: 12px;">
                  <a href="tel:${validatedData.phone}" style="color: #000000; font-size: 17px; text-decoration: none; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6;">${validatedData.phone}</a>
                </div>
                ` : ""}
                ${validatedData.organization ? `
                <div style="margin-bottom: 12px;">
                  <strong style="color: #000000; font-size: 12px; display: block; margin-bottom: 4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; text-transform: uppercase; letter-spacing: 0.5px;">Organization</strong>
                  <span style="color: #000000; font-size: 17px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6;">${validatedData.organization}</span>
                </div>
                ` : ""}
                ${validatedData.preferredDate && validatedData.preferredTime ? (() => {
                  const userTimeStr = `${formatDate(validatedData.preferredDate)} at ${formatTime(validatedData.preferredTime)}`;
                  try {
                    const [year, month, day] = validatedData.preferredDate.split("-").map(Number);
                    const [hours, minutes] = validatedData.preferredTime.split(":").map(Number);
                    const dateInUserTz = new Date(`${validatedData.preferredDate}T${validatedData.preferredTime}:00`);
                    const easternTime = new Intl.DateTimeFormat("en-US", {
                      timeZone: "America/New_York",
                      year: "numeric",
                      month: "2-digit",
                      day: "2-digit",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: true,
                    }).formatToParts(dateInUserTz);
                    const monthET = easternTime.find(p => p.type === "month")?.value;
                    const dayET = easternTime.find(p => p.type === "day")?.value;
                    const hourET = easternTime.find(p => p.type === "hour")?.value;
                    const minuteET = easternTime.find(p => p.type === "minute")?.value;
                    const ampmET = easternTime.find(p => p.type === "dayPeriod")?.value?.toUpperCase();
                    const easternTimeStr = `${monthET}/${dayET} at ${hourET}:${minuteET} ${ampmET} ET`;
                    return `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e0e0e0;">
                  <div style="color: #000000; font-size: 17px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; margin-bottom: 4px;">
                    ${userTimeStr} (${formatTimezone(validatedData.timezone || "")})
                  </div>
                  <div style="color: #666666; font-size: 15px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.5;">
                    ${easternTimeStr}
                  </div>
                </div>
                    `;
                  } catch {
                    return `
                <div style="margin-top: 16px; padding-top: 16px; border-top: 1px solid #e0e0e0;">
                  <div style="color: #000000; font-size: 17px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6;">
                    ${userTimeStr} (${formatTimezone(validatedData.timezone || "")})
                  </div>
                </div>
                    `;
                  }
                })() : ""}
              </div>
              
              <!-- Message -->
              <div style="margin-top: 0;">
                <strong style="color: #000000; font-size: 14px; display: block; margin-bottom: 16px; font-weight: 600; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; letter-spacing: 0.2px;">${validatedData.name.split(' ')[0]}'s Message:</strong>
                <div style="background-color: #f9f9f9; padding: 24px; border-radius: 4px; border-left: 3px solid #000000; color: #000000; font-size: 16px; line-height: 1.8; white-space: pre-wrap; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">${validatedData.message.replace(/\n/g, "<br>")}</div>
              </div>
              
              <!-- Reply Button -->
              <table role="presentation" cellspacing="0" cellpadding="0" border="0" width="100%" style="margin-top: 30px;">
                <tr>
                  <td align="center">
                    <a href="mailto:${validatedData.email}?subject=${encodeURIComponent(`Re: ${subject}`)}" style="display: inline-block; background-color: #ffffff; color: #000000; text-decoration: none; padding: 15px 38px; border-radius: 4px; border: 1px solid #000000; font-size: 15px; font-weight: 600; margin-top: 24px; letter-spacing: 0.4px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                      Reply to ${validatedData.name.split(' ')[0]}
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="padding: 30px 40px; background-color: #f9f9f9; border-radius: 0 0 8px 8px; border-top: 1px solid #e5e5e5;">
              <p style="margin: 0; color: #000000; font-size: 13px; text-align: center; line-height: 1.7; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                This email was sent from the ámaxa Contact Form.
              </p>
              <p style="margin: 14px 0 0; color: #666666; font-size: 12px; text-align: center; line-height: 1.6; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
                If any links appear blocked by your email provider, this is a temporary security measure. All links are safe and verified. As a nonprofit organization, we take your security and privacy seriously. If needed, you can copy and paste URLs directly into your browser.
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
        tracking: {
          clicks: false,
          opens: false, // Disabled - open tracking can hurt deliverability and is often inaccurate
        },
        // Removed priority headers - they can actually trigger spam filters
        // SPF, DKIM, and DMARC (via domain verification) are the proper way to ensure deliverability
      });

      console.log("📥 Resend API Response:", JSON.stringify(emailResult, null, 2));

      if (emailResult.error) {
        console.error("❌ Resend API Error:", emailResult.error);
        console.error("❌ FROM address used:", fromEmail);
        console.error("❌ TO address used:", recipientEmail);
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

