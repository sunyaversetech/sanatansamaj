import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { membershipApplicationSchema } from "@/lib/membership-schema";
import { membershipPlans } from "@/lib/site-data";

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

  const parsed = membershipApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid application data", issues: parsed.error.flatten() },
      { status: 400 },
    );
  }
  const data = parsed.data;

  const plan = membershipPlans.find((p) => p.key === data.planTier);
  if (!plan) {
    return NextResponse.json(
      { error: "Unknown membership plan" },
      { status: 400 },
    );
  }

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
            unit_amount: plan.amount * 100,
            product_data: {
              name: `${plan.label} Membership`,
              description: "Sanatan Samaj Australia membership fee",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        kind: "membership",
        fullName: data.fullName,
        telephone: data.telephone,
        email: data.email,
        occupation: data.occupation ?? "",
        planTier: data.planTier,
        familyMember1Name: data.familyMember1Name ?? "",
        familyMember1Relation: data.familyMember1Relation ?? "",
        familyMember2Name: data.familyMember2Name ?? "",
        familyMember2Relation: data.familyMember2Relation ?? "",
        familyMember3Name: data.familyMember3Name ?? "",
        familyMember3Relation: data.familyMember3Relation ?? "",
        address: data.address,
        specialInterests: data.specialInterests ?? "",
        signOffDate: data.signOffDate,
      },
      return_url: `${origin}/membership/apply/success?session_id={CHECKOUT_SESSION_ID}`,
    });

    if (!session.client_secret) {
      return NextResponse.json(
        { error: "Could not start checkout" },
        { status: 502 },
      );
    }

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    return NextResponse.json(
      { error: "Payment setup failed. Please try again shortly." },
      { status: 502 },
    );
  }
}
