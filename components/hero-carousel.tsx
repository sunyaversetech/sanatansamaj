"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { heroSlides } from "@/lib/site-data";

const AUTOPLAY_MS = 6000;

export function HeroCarousel() {
  const [active, setActive] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const restartTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((i) => (i + 1) % heroSlides.length);
    }, AUTOPLAY_MS);
  }, []);

  useEffect(() => {
    restartTimer();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [restartTimer]);

  const goTo = (index: number) => {
    setActive(((index % heroSlides.length) + heroSlides.length) % heroSlides.length);
    restartTimer();
  };

  return (
    <div className="relative h-[50vh] min-h-[440px] w-full overflow-hidden bg-sand-900">
      {heroSlides.map((slide, i) => (
        <div
          key={slide.source}
          className="absolute inset-0 transition-opacity duration-700 ease-out"
          style={{ opacity: i === active ? 1 : 0, pointerEvents: i === active ? "auto" : "none" }}
        >
          <Image
            src={slide.image}
            alt={slide.source}
            fill
            priority={i === 0}
            className="washed object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-cocoa-900/80 via-cocoa-900/35 to-cocoa-900/15" />
          <div className="absolute inset-x-0 bottom-0 flex flex-col items-start gap-3 px-6 pt-8 pb-10 sm:px-12 sm:pb-14">
            <span className="rounded-full bg-cocoa-500/40 px-3 py-1 text-xs tracking-wide text-cocoa-100 backdrop-blur-sm">
              SANATAN DHARMA · AUSTRALIA
            </span>
            <h1 className="max-w-3xl text-3xl text-background sm:text-4xl">
              {slide.sanskrit}
            </h1>
            <p className="max-w-xl text-lg text-gold-100">
              {slide.translation}{" "}
              <span className="text-sm opacity-70">— {slide.source}</span>
            </p>
            <div className="mt-2 flex gap-3">
              <Button asChild size="lg">
                <Link href="/membership/apply">Become a Member</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="border-gold-300 text-background hover:bg-background/10"
              >
                <Link href="/about">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      ))}

      <button
        aria-label="Previous slide"
        onClick={() => goTo(active - 1)}
        className="absolute top-1/2 left-4 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground hover:bg-background"
      >
        <ChevronLeft className="size-5" />
      </button>
      <button
        aria-label="Next slide"
        onClick={() => goTo(active + 1)}
        className="absolute top-1/2 right-4 z-10 flex size-9 -translate-y-1/2 items-center justify-center rounded-full bg-background/85 text-foreground hover:bg-background"
      >
        <ChevronRight className="size-5" />
      </button>

      <div className="absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2.5">
        {heroSlides.map((slide, i) => (
          <button
            key={slide.source}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => goTo(i)}
            className={cn(
              "h-2.5 rounded-full transition-all duration-300",
              i === active ? "w-6 bg-primary" : "w-2.5 bg-background/55",
            )}
          />
        ))}
      </div>
    </div>
  );
}
