import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function DonatePage() {
  return (
    <>
      <div className="bg-card px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h6 className="mb-1 text-xs font-semibold tracking-widest text-gold-700 uppercase">
            Seva — Selfless Service
          </h6>
          <h1>Support Our Mission</h1>
          <p className="font-heading text-gold-700">
            &quot;दानं परमो धर्मः&quot; — Giving is the highest virtue
          </p>
        </div>
      </div>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2>Every Contribution Matters</h2>
          <p className="max-w-lg text-foreground/75">
            Donations can be made via bank transfer or online. Contact us for
            full payment details.
          </p>
          <Button asChild size="lg" className="mt-3">
            <Link href="/donate/give">Donate Now</Link>
          </Button>
        </div>
      </section>
    </>
  );
}
