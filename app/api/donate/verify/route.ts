import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { fulfillDonation, FulfillmentError } from "@/lib/services/donation-service";

export async function GET(req: NextRequest) {
  const sessionId = req.nextUrl.searchParams.get("session_id");
  if (!sessionId) {
    return NextResponse.json({ success: false, error: "Missing session_id" }, { status: 400 });
  }

  let session;
  try {
    const stripe = getStripe();
    session = await stripe.checkout.sessions.retrieve(sessionId);
  } catch (err) {
    console.error("GET /api/donate/verify: failed to retrieve checkout session:", err);
    return NextResponse.json(
      { success: false, error: "We couldn't find that payment. Please contact us." },
      { status: 404 },
    );
  }

  if (session.payment_status !== "paid") {
    return NextResponse.json(
      { success: false, error: "This payment hasn't been completed yet." },
      { status: 402 },
    );
  }

  const logoUrl = `${req.nextUrl.origin}/logo.png`;

  try {
    const result = await fulfillDonation(session, logoUrl);
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    const message =
      err instanceof FulfillmentError
        ? err.message
        : "We hit an unexpected system error recording your donation. Please contact us with your payment receipt.";
    console.error("GET /api/donate/verify: fulfillment failed:", err);
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
