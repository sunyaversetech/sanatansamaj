import Image from "next/image";
import Link from "next/link";
import { pastEvents } from "@/lib/site-data";

export default function GalleryPage() {
  return (
    <>
      <div className="bg-card px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h6 className="mb-1 text-xs font-semibold tracking-widest text-gold-700 uppercase">
            Moments We&apos;ve Shared
          </h6>
          <h1>Gallery</h1>
          <p className="max-w-xl text-foreground/75">
            A look back at the festivals and gatherings our community has
            celebrated together.
          </p>
        </div>
      </div>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          {pastEvents.map((event) => (
            <Link
              key={event.slug}
              href={`/gallery/${event.slug}`}
              className="flex items-center gap-4 rounded-2xl bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="relative size-16 shrink-0 overflow-hidden rounded-2xl">
                <Image
                  src={event.cover}
                  alt={event.title}
                  fill
                  className="washed object-cover"
                />
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-cocoa-900/55 text-background">
                  <span className="font-heading text-xl leading-none">
                    {event.day}
                  </span>
                  <span className="text-[10px] tracking-wide">
                    {event.month}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <div className="font-heading text-lg">{event.title}</div>
                <div className="text-xs text-foreground/55">
                  {event.location}
                </div>
              </div>
              <span className="font-heading text-sm text-primary">
                View Gallery
              </span>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
