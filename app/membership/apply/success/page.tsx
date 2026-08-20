import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStripe } from "@/lib/stripe";
import { membershipPlans, orgInfo } from "@/lib/site-data";
import { getMembershipBySessionId } from "@/lib/records";

export default async function MembershipApplySuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let paid = false;
  let fullName = "";
  let planLabel = "";
  let amount = 0;
  let currency = "aud";
  let email = "";
  let membershipId = "";

  if (session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      paid = session.payment_status === "paid";
      fullName = session.metadata?.fullName ?? "";
      email = session.metadata?.email ?? session.customer_details?.email ?? "";
      const plan = membershipPlans.find((p) => p.key === session.metadata?.planTier);
      planLabel = plan?.label ?? "";
      amount = (session.amount_total ?? 0) / 100;
      currency = session.currency ?? "aud";
    } catch (err) {
      console.error("Failed to retrieve checkout session:", err);
    }

    if (paid) {
      try {
        // The webhook assigns the membership ID asynchronously — it usually
        // lands before this page renders, but isn't guaranteed to.
        const record = await getMembershipBySessionId(session_id);
        // A "PENDING-..." id means assignment failed (e.g. the database was
        // briefly unreachable) — treat it the same as "not ready yet" rather
        // than showing the raw placeholder to the member.
        membershipId =
          record?.membershipId && !record.membershipId.startsWith("PENDING-")
            ? record.membershipId
            : "";
      } catch (err) {
        console.error("Failed to look up membership record:", err);
      }
    }
  }

  const firstName = fullName.trim().split(/\s+/)[0] || fullName;

  if (!paid) {
    return (
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl bg-card p-10 text-center shadow-md">
          <AlertCircle className="size-12 text-destructive" />
          <h1 className="text-2xl">We couldn&apos;t confirm this payment</h1>
          <p className="text-foreground/70">
            If you completed a payment, don&apos;t worry — we&apos;ll still receive it.
            If something looks wrong, please contact us at {orgInfo.email}.
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link href="/membership/apply">Back to Application</Link>
          </Button>
        </div>
      </section>
    );
  }

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl bg-card p-10 text-center shadow-md">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/15">
          <CheckCircle2 className="size-9 text-primary" />
        </span>
        <div className="font-heading text-sm text-gold-700">{orgInfo.mantra}</div>
        <h1 className="text-3xl">
          Welcome to the family{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="max-w-md text-foreground/75">
          Thank you for becoming a {planLabel || "member"} of {orgInfo.name}. Your
          payment of <strong>${amount.toFixed(2)} {currency.toUpperCase()}</strong>{" "}
          has been received and your membership is now active.
        </p>
        {membershipId ? (
          <div className="rounded-2xl border border-gold-300 bg-gold-100 px-6 py-3">
            <div className="text-xs text-foreground/55">Your Membership ID</div>
            <div className="font-heading text-xl tracking-wide text-gold-800">
              {membershipId}
            </div>
          </div>
        ) : (
          <p className="text-sm text-foreground/55">
            Your Membership ID will be included in your confirmation email.
          </p>
        )}
        {email && (
          <p className="text-sm text-foreground/55">
            A confirmation email has been sent to {email}.
          </p>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/events">See Upcoming Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
