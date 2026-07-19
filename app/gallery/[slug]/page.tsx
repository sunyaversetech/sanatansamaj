import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getPastEvent, pastEvents } from "@/lib/site-data";

export function generateStaticParams() {
  return pastEvents.map((event) => ({ slug: event.slug }));
}

export default async function GalleryDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const event = getPastEvent(slug);
  if (!event) notFound();

  return (
    <>
      <div className="relative h-[340px] w-full overflow-hidden">
        <Image src={event.cover} alt={event.title} fill className="washed object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-cocoa-900/80 via-cocoa-900/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-4 pb-6 sm:px-8">
          <h1 className="mb-1 text-background">{event.title}</h1>
          <div className="flex gap-4 text-sm text-gold-100">
            <span>{event.dateLabel}</span>
            <span>·</span>
            <span>{event.location}</span>
          </div>
        </div>
      </div>

      <div className="px-4 py-6 sm:px-8">
        <Button asChild variant="outline">
          <Link href="/gallery">Back to Gallery</Link>
        </Button>
      </div>

      <div className="px-4 pb-14 sm:px-8">
        <p className="max-w-2xl text-foreground/80">{event.desc}</p>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          {Array.from({ length: event.photoCount }, (_, i) => (
            <div
              key={i}
              className="flex aspect-square items-center justify-center rounded-2xl bg-cocoa-100"
            >
              <ImageIcon className="size-8 text-cocoa-400" />
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
