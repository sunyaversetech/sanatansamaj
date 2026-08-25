import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";
import { membershipApplicationSchema } from "@/lib/membership-schema";
import { membershipPlans } from "@/lib/site-data";
import { connectToDb } from "@/lib/db";
import { Membership } from "@/lib/models/Membership.model";
import { checkRenewalEligibility } from "@/lib/services/membership-service";

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

  // Checked before Stripe is even asked to create a session, so someone who
  // isn't allowed to (re)purchase — a lifetime member, or an annual member
  // still within their current validTill year — is never charged.
  try {
    const eligibility = await checkRenewalEligibility(data.email);
    if (!eligibility.eligible) {
      return NextResponse.json({ error: eligibility.reason }, { status: 409 });
    }
  } catch (err) {
    console.error("POST /api/membership/checkout: eligibility check failed:", err);
    return NextResponse.json(
      { error: "We couldn't verify your membership status right now. Please try again shortly." },
      { status: 503 },
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

    try {
      await connectToDb();
      // One document per email: this either creates a brand-new pending row
      // or, on a renewal, marks the person's existing row pending again
      // against the new checkout session — without touching their existing
      // membershipId or validTill, which are only set on fulfillment.
      await Membership.updateOne(
        { email: data.email.toLowerCase().trim() },
        {
          $set: {
            fullName: data.fullName,
            telephone: data.telephone,
            email: data.email,
            occupation: data.occupation,
            planTier: data.planTier,
            familyMember1Name: data.familyMember1Name,
            familyMember1Relation: data.familyMember1Relation,
            familyMember2Name: data.familyMember2Name,
            familyMember2Relation: data.familyMember2Relation,
            familyMember3Name: data.familyMember3Name,
            familyMember3Relation: data.familyMember3Relation,
            address: data.address,
            specialInterests: data.specialInterests,
            signOffDate: data.signOffDate,
            amountPaid: plan.amount,
            currency: "aud",
            status: "pending",
            stripeSessionId: session.id,
          },
        },
        { upsert: true },
      );
    } catch (err) {
      // Non-fatal: the checkout has already been created with Stripe, and
      // /api/membership/verify will insert the final record on success if
      // this pending row didn't make it in. Logged so it can be traced.
      console.error(
        "POST /api/membership/checkout: failed to write pending record:",
        err,
      );
    }

    return NextResponse.json({ clientSecret: session.client_secret });
  } catch (err) {
    console.error(
      "POST /api/membership/checkout: Stripe session creation failed:",
      err,
    );
    return NextResponse.json(
      { error: "Payment setup failed. Please try again shortly." },
      { status: 502 },
    );
  }
}
