import { Resend } from "resend";

let resendClient: Resend | null = null;

export function getResend() {
  if (resendClient) return resendClient;

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to .env.local (see .env.example).",
    );
  }

  resendClient = new Resend(apiKey);
  return resendClient;
}

// Verified sending address. Until a custom domain is verified in Resend,
// this must stay "onboarding@resend.dev" (Resend's shared sandbox sender).
export const EMAIL_FROM =
  process.env.RESEND_FROM_EMAIL || "Sanatan Samaj Australia <onboarding@resend.dev>";
