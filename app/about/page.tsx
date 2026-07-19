import Image from "next/image";
import { Users } from "lucide-react";
import { objectives, team } from "@/lib/site-data";

export default function AboutPage() {
  return (
    <>
      <div className="bg-card px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h6 className="mb-1 text-xs font-semibold tracking-widest text-gold-700 uppercase">
            Our Story
          </h6>
          <h1>About Sanatan Samaj Australia</h1>
        </div>
      </div>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 md:grid-cols-2">
          <div className="washed relative h-105 overflow-hidden rounded-3xl shadow-md">
            <Image
              src="/dashain.webp"
              alt="Community gathering"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <h2>Who We Are</h2>
            <p className="text-foreground/80">
              Sanatan Samaj Australia (SSA) was legally incorporated as an
              association by the ACT Government on 4th May 2020 under the
              Associations Incorporation Act 1991. We are a community of
              devotees dedicated to nurturing Sanatan Dharma in the heart of
              Canberra.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6">Our Objectives</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {objectives.map((obj) => (
              <div
                key={obj.n}
                className="flex items-start gap-3 rounded-2xl bg-card p-5 shadow-sm"
              >
                <div className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary font-heading text-[15px] text-primary-foreground">
                  {obj.n}
                </div>
                <p className="m-0 text-sm text-foreground/80">{obj.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h2 className="mb-6">Our Committee</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {team.map((role) => (
              <div key={role}>
                <div className="mb-3 flex size-30 items-center justify-center rounded-full bg-cocoa-200">
                  <Users className="size-10 text-cocoa-600" />
                </div>
                <div className="font-semibold">{role}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
