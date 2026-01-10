import { Resend } from "resend";

export function createResendClient(): Resend {
  const resendApiKey = process.env.RESEND_API_KEY;

  if (!resendApiKey) {
    throw new Error("RESEND_API_KEY environment variable is not set");
  }

  return new Resend(resendApiKey);
}
