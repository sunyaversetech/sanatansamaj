import Link from "next/link";
import { Button } from "@/components/ui/button";
import { benefits, orgInfo } from "@/lib/site-data";

export default function MembershipPage() {
  return (
    <>
      <div className="bg-card px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h6 className="mb-1 text-xs font-semibold tracking-widest text-gold-700 uppercase">
            Join Our Samaj
          </h6>
          <h1>Become a Member</h1>
          <p className="max-w-xl text-foreground/75">
            Join a community dedicated to Sanatan Dharma, culture, and mutual
            support here in Australia.
          </p>
        </div>
      </div>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-2">
          <div>
            <h2 className="mb-6">Why Join Us</h2>
            {benefits.map((b) => (
              <div key={b} className="mb-3 flex gap-3">
                <div className="mt-2 size-2 shrink-0 rounded-full bg-primary" />
                <p className="m-0">{b}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-col gap-3 rounded-3xl bg-card p-6 shadow-md">
            <div className="font-heading text-xl">How to Apply</div>
            <p className="text-sm text-foreground/75">
              Fill in the membership form online, or download the SSA
              Membership Application Form and send the completed form to our
              Secretary.
            </p>
            <div className="text-xs text-foreground/55">
              Secretary: {orgInfo.email}
            </div>
            <Button asChild size="lg" className="mt-2 w-full">
              <Link href="/membership/apply">Apply Now</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
