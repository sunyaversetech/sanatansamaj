import { yearEvents } from "@/lib/site-data";

export default function EventsPage() {
  return (
    <>
      <div className="bg-card px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h6 className="mb-1 text-xs font-semibold tracking-widest text-gold-700 uppercase">
            Mark Your Calendar — 2026
          </h6>
          <h1>Events Calendar</h1>
          <p className="max-w-xl text-foreground/75">
            All Sanatan Samaj Australia festivals and gatherings for the
            year, January through December 2026.
          </p>
        </div>
      </div>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-2xl bg-card shadow-sm">
          {yearEvents.map((ev, i) => (
            <div
              key={ev.name}
              className={`flex items-center gap-4 p-4 ${i !== yearEvents.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="w-36 shrink-0 font-heading text-gold-700 sm:w-40">
                {ev.date}
              </div>
              <div className="flex-1">
                <div className="font-semibold">{ev.name}</div>
                <div className="text-sm text-foreground/60">{ev.desc}</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
