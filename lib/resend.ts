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

// The Resend SDK resolves (doesn't reject) even when the API rejects the
// request — it returns { data, error }. Wrapping it so failures actually
// throw means Promise.allSettled can be trusted to report them.
export async function sendEmail(payload: {
  from: string;
  to: string;
  subject: string;
  html: string;
}) {
  const resend = getResend();
  const { data, error } = await resend.emails.send(payload);
  if (error) {
    throw new Error(`Resend error (${error.name}): ${error.message}`);
  }
  return data;
}
