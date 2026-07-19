"use client";

import { FormEvent } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { orgInfo, socials } from "@/lib/site-data";

export default function ContactPage() {
  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    toast.success("Message sent", {
      description: "Thanks for reaching out — we'll reply soon.",
    });
    e.currentTarget.reset();
  }

  const mapQuery = encodeURIComponent(orgInfo.addressLines.join(", "));

  return (
    <>
      <div className="bg-card px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <h6 className="mb-1 text-xs font-semibold tracking-widest text-gold-700 uppercase">
            We&apos;d Love To Hear From You
          </h6>
          <h1>Get in Touch</h1>
        </div>
      </div>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-10 md:grid-cols-[0.9fr_1.1fr]">
          <div>
            <h3 className="mb-4">Contact Details</h3>
            <div className="mb-4">
              <h6 className="mb-0.5 text-xs font-semibold tracking-widest text-gold-700 uppercase">
                Phone
              </h6>
              <div>{orgInfo.phone}</div>
            </div>
            <div className="mb-4">
              <h6 className="mb-0.5 text-xs font-semibold tracking-widest text-gold-700 uppercase">
                Email
              </h6>
              <div>{orgInfo.email}</div>
            </div>
            <div className="mb-4">
              <h6 className="mb-0.5 text-xs font-semibold tracking-widest text-gold-700 uppercase">
                Address
              </h6>
              <div>
                {orgInfo.addressLines.map((line) => (
                  <div key={line}>{line}</div>
                ))}
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              {socials.map((s) => (
                <span
                  key={s.label}
                  aria-label={s.label}
                  className="flex size-9 items-center justify-center rounded-full border border-border font-heading text-sm"
                >
                  {s.initial}
                </span>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 rounded-3xl bg-card p-6 shadow-md"
          >
            <div className="flex flex-col gap-2">
              <Label htmlFor="name">Your Name</Label>
              <Input id="name" name="name" placeholder="Name" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">Your Email</Label>
              <Input id="email" name="email" type="email" placeholder="Email" required />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="message">Your Message</Label>
              <Textarea id="message" name="message" rows={5} placeholder="Message" required />
            </div>
            <Button type="submit" size="lg" className="w-full">
              Send Message
            </Button>
          </form>
        </div>
      </section>

      <section className="px-4 pb-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl overflow-hidden rounded-3xl shadow-md">
          <iframe
            title="SSA location map"
            src={`https://www.google.com/maps?q=${mapQuery}&output=embed`}
            className="h-75 w-full border-0"
            loading="lazy"
          />
        </div>
      </section>
    </>
  );
}
