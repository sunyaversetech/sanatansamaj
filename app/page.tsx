import Link from "next/link";
import { HeroCarousel } from "@/components/hero-carousel";
import { Button } from "@/components/ui/button";
import { features, upcomingFestivals } from "@/lib/site-data";

export default function Home() {
  return (
    <>
      <HeroCarousel />

      {/* Feature cards */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 sm:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="flex flex-col gap-2 rounded-2xl bg-card p-6 shadow-sm"
            >
              <div className="mb-1 size-11 rounded-full bg-cocoa-200" />
              <h3 className="font-heading text-lg">{f.title}</h3>
              <p className="text-sm text-foreground/75">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Upcoming festivals */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h6 className="mb-1 text-xs font-semibold tracking-widest text-gold-700 uppercase">
            Mark Your Calendar
          </h6>
          <h2 className="mb-6 text-3xl">Upcoming Festivals &amp; Events</h2>
          <div className="overflow-hidden rounded-2xl bg-card shadow-sm">
            {upcomingFestivals.map((ev, i) => (
              <div
                key={ev.name}
                className={`flex items-center gap-4 p-4 ${i !== upcomingFestivals.length - 1 ? "border-b border-border" : ""}`}
              >
                <div className="w-32 shrink-0 font-heading text-gold-700 sm:w-40">
                  {ev.date}
                </div>
                <div className="flex-1">
                  <div className="font-semibold">{ev.name}</div>
                  <div className="text-sm text-foreground/60">{ev.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <Button asChild variant="outline" className="mt-6">
            <Link href="/events">View All Events</Link>
          </Button>
        </div>
      </section>

      {/* Join CTA */}
      <section className="bg-gold-800 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-background">Ready to Join Us?</h2>
          <p className="max-w-lg text-gold-100">
            Become part of our growing community and experience the richness
            of Sanatan Dharma with us.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild size="lg">
              <Link href="/membership/apply">Become a Member</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-gold-300 text-background hover:bg-background/10"
            >
              <Link href="/events">View Upcoming Events</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
