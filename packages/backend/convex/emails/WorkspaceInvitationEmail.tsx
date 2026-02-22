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

interface WorkspaceInvitationEmailProps {
  workspaceName: string;
  inviteUrl: string;
  role: "admin" | "member";
}

export function WorkspaceInvitationEmail({
  workspaceName,
  inviteUrl,
  role,
}: WorkspaceInvitationEmailProps) {
  const roleText = role === "admin" ? "an admin" : "a member";

  return (
    <Html>
      <Head />
      <Preview>You've been invited to join {workspaceName}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={headerSection}>
            <Heading style={heading}>Workspace Invitation</Heading>
          </Section>

          <Section style={contentSection}>
            <Text style={paragraph}>Hi there,</Text>

            <Text style={paragraph}>
              You've been invited to join <strong>{workspaceName}</strong> as{" "}
              {roleText} on the Amaxa platform.
            </Text>

            <Text style={paragraph}>
              Click the button below to accept the invitation and join the
              workspace.
            </Text>

            <Section style={buttonContainer}>
              <Button href={inviteUrl} style={button}>
                Accept Invitation
              </Button>
            </Section>

            <Text style={linkText}>
              If the button doesn't work, copy and paste this link into your
              browser:
              <br />
              <Link href={inviteUrl} style={link}>
                {inviteUrl}
              </Link>
            </Text>

            <Hr style={hr} />

            <Text style={footerText}>
              This invitation will expire in 7 days. If you didn't expect this
              invitation, you can safely ignore this email.
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

export default WorkspaceInvitationEmail;
