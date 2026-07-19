import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { membershipApplicationSchema } from "@/lib/membership-schema";
import { membershipPlans } from "@/lib/site-data";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
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
    return NextResponse.json({ error: "Unknown membership plan" }, { status: 400 });
  }

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
        planTier: data.planTier,
        spouseName: data.spouseName ?? "",
        spouseTelephone: data.spouseTelephone ?? "",
        spouseEmail: data.spouseEmail ?? "",
        familyMember1: data.familyMember1 ?? "",
        familyMember2: data.familyMember2 ?? "",
        familyMember3: data.familyMember3 ?? "",
        address: data.address,
        specialInterests: data.specialInterests ?? "",
        signOffDate: data.signOffDate,
      },
      success_url: `${origin}/membership/apply/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/membership/apply`,
    });

    if (!session.url) {
      return NextResponse.json({ error: "Could not start checkout" }, { status: 502 });
    }

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout session creation failed:", err);
    return NextResponse.json(
      { error: "Payment setup failed. Please try again shortly." },
      { status: 502 },
    );
  }
}
