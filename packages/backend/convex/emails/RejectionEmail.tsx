import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface RejectionEmailProps {
  applicantName: string;
  formTitle: string;
}

export function RejectionEmail({
  applicantName,
  formTitle,
}: RejectionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Update on your application</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={heading}>Application Update</Heading>
          </Section>

          <Section style={contentSection}>
            <Text style={paragraph}>Hi {applicantName},</Text>

            <Text style={paragraph}>
              Thank you for taking the time to apply to {formTitle}. We truly
              appreciate your interest and the effort you put into your
              application.
            </Text>

            <Text style={paragraph}>
              After careful consideration, we regret to inform you that we will
              not be moving forward with your application at this time. This was
              a difficult decision, as we received many strong applications.
            </Text>

            <Text style={paragraph}>
              We encourage you to apply again in our next batch. We would love
              to see how you've grown and what new experiences you bring.
            </Text>

            <Text style={paragraph}>
              We wish you the best in your future endeavors and hope to hear
              from you again.
            </Text>

            <Hr style={hr} />

            <Text style={footerText}>
              If you have any questions, please feel free to reply to this
              email.
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
  background: "linear-gradient(135deg, #94a3b8 0%, #64748b 100%)",
  padding: "30px",
};

const heading = {
  color: "#f8fafc",
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

export default RejectionEmail;
