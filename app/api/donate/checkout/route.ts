import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { donationSchema } from "@/lib/donation-schema";
import { connectToDb } from "@/lib/db";
import { Donation } from "@/lib/models/Donation.model";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body" },
      { status: 400 },
    );
  }

  const parsed = donationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid donation data", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const origin = req.nextUrl.origin;

  try {
    const stripe = getStripe();
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      ui_mode: "embedded_page",
      customer_email: data.email,
      line_items: [
        {
          price_data: {
            currency: "aud",
            unit_amount: data.amount * 100,
            product_data: {
              name: "Donation to Sanatan Samaj Australia",
              description: data.isAnonymous
                ? "Anonymous donation"
                : `Donation from ${data.fullName}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        kind: "donation",
        fullName: data.fullName,
        email: data.email,
        amount: String(data.amount),
        isAnonymous: String(data.isAnonymous),
      },
      return_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      return NextResponse.json(
        { error: "Could not start checkout" },
        { status: 502 },
      );
    }

    try {
      await connectToDb();
      await Donation.create({
        fullName: data.fullName,
        email: data.email,
        amount: data.amount,
        currency: "aud",
        isAnonymous: data.isAnonymous,
        status: "pending",
        stripeSessionId: session.id,
      });
    } catch (err) {
      // Non-fatal: the checkout has already been created with Stripe, and
      // /api/donate/verify will insert the final record on success if this
      // pending row didn't make it in. Logged so it can be traced.
      console.error("POST /api/donate/checkout: failed to write pending record:", err);
    }

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error(
      "POST /api/donate/checkout: Stripe session creation failed:",
      err,
    );
    return NextResponse.json(
      { error: "Payment setup failed. Please try again shortly." },
      { status: 502 },
    );
  }
}
