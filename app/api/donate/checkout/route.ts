import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { donationSchema } from "@/lib/donation-schema";

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
      success_url: `${origin}/donate/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/donate/give`,
    });

    if (!session.url) {
      return NextResponse.json(
        { error: "Could not start checkout" },
        { status: 502 },
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe donation checkout session creation failed:", err);
    return NextResponse.json(
      { error: "Payment setup failed. Please try again shortly." },
      { status: 502 },
    );
  }
}
