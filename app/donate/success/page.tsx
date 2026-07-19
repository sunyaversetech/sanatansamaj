import Link from "next/link";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getStripe } from "@/lib/stripe";
import { orgInfo } from "@/lib/site-data";

export default async function DonateSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  let paid = false;
  let fullName = "";
  let amount = 0;
  let currency = "aud";
  let email = "";

  if (session_id) {
    try {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.retrieve(session_id);
      paid = session.payment_status === "paid";
      fullName = session.metadata?.fullName ?? "";
      email = session.metadata?.email ?? session.customer_details?.email ?? "";
      amount = (session.amount_total ?? 0) / 100;
      currency = session.currency ?? "aud";
    } catch (err) {
      console.error("Failed to retrieve checkout session:", err);
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
            <Link href="/donate/give">Back to Donation</Link>
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
        <div className="font-heading text-sm text-gold-700">
          &quot;दानं परमो धर्मः&quot; — Giving is the highest virtue
        </div>
        <h1 className="text-3xl">
          Thank you{firstName ? `, ${firstName}` : ""}!
        </h1>
        <p className="max-w-md text-foreground/75">
          Your donation of{" "}
          <strong>
            ${amount.toFixed(2)} {currency.toUpperCase()}
          </strong>{" "}
          to {orgInfo.name} has been received. It means a great deal to our
          community.
        </p>
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
