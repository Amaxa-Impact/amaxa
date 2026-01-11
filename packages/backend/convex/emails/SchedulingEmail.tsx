import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface SchedulingEmailProps {
  applicantName: string;
  formTitle: string;
  schedulingUrl: string;
}

export function SchedulingEmail({
  applicantName,
  formTitle,
  schedulingUrl,
}: SchedulingEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Schedule your interview</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={heading}>Interview Invitation</Heading>
          </Section>

          <Section style={contentSection}>
            <Text style={paragraph}>Hi {applicantName},</Text>

            <Text style={paragraph}>
              Congratulations! We're excited to move forward with your
              application.
            </Text>

            <Text style={paragraph}>
              Please click the button below to select a time slot that works
              best for your interview.
            </Text>

            <Section style={buttonContainer}>
              <Button href={schedulingUrl} style={button}>
                Schedule Your Interview
              </Button>
            </Section>

            <Text style={linkText}>
              If the button doesn't work, copy and paste this link into your
              browser:
              <br />
              <Link href={schedulingUrl} style={link}>
                {schedulingUrl}
              </Link>
            </Text>

            <Hr style={hr} />

            <Text style={footerText}>
              If you have any questions, please reply to this email.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerBrand}>Amaxa Team</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

// Colors derived from globals.css oklch values
// Primary: oklch(0.65 0.18 132) → #22c55e
// Primary light: oklch(0.77 0.2 131) → #4ade80
// Primary dark: oklch(0.53 0.14 132) → #16a34a
// Foreground: oklch(0.141 0.005 285.823) → #1e1b2e
// Muted foreground: oklch(0.552 0.016 285.938) → #71717a
// Border: oklch(0.92 0.004 286.32) → #e4e4e7

const main = {
  backgroundColor: "#f4f4f5",
  fontFamily:
    '"JetBrains Mono Variable", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, monospace',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "0",
  maxWidth: "600px",
  borderRadius: "8px",
  overflow: "hidden" as const,
};

const headerSection = {
  background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
  padding: "30px",
};

const heading = {
  color: "#f0fdf4",
  fontSize: "24px",
  fontWeight: "600" as const,
  margin: "0",
};

const contentSection = {
  padding: "30px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "1.6",
  color: "#1e1b2e",
  marginBottom: "20px",
};

const buttonContainer = {
  textAlign: "center" as const,
  margin: "30px 0",
};

const button = {
  background: "linear-gradient(135deg, #4ade80 0%, #22c55e 100%)",
  color: "#166534",
  padding: "14px 32px",
  borderRadius: "8px",
  fontWeight: "600" as const,
  fontSize: "16px",
  textDecoration: "none",
  display: "inline-block",
};

const linkText = {
  fontSize: "14px",
  color: "#71717a",
  marginTop: "24px",
};

const link = {
  color: "#22c55e",
  wordBreak: "break-all" as const,
};

const hr = {
  borderColor: "#e4e4e7",
  margin: "30px 0",
};

const footerText = {
  fontSize: "14px",
  color: "#71717a",
  margin: "0",
};

const footer = {
  textAlign: "center" as const,
  padding: "20px",
  color: "#a1a1aa",
};

const footerBrand = {
  fontSize: "12px",
  color: "#a1a1aa",
  margin: "0",
};

export default SchedulingEmail;
