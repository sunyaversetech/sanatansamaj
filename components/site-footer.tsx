import Link from "next/link";
import Image from "next/image";
import { orgInfo, socials } from "@/lib/site-data";

const quickLinks = [
  { href: "/about", label: "About Us" },
  { href: "/events", label: "Events" },
  { href: "/gallery", label: "Gallery" },
  { href: "/membership", label: "Membership" },
];

const communityLinks = [
  { href: "/contact", label: "Contact Us" },
  { href: "/donate", label: "Donate" },
];

export function SiteFooter() {
  return (
    <footer className="mt-auto bg-sand-900 px-4 py-12 text-sand-200 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <div className="mb-3 flex items-center gap-2">
            <Image
              src="/logo.png"
              alt={orgInfo.name}
              width={32}
              height={32}
              className="rounded-full object-contain"
            />
            <h4 className="m-0 font-heading text-lg text-background">
              {orgInfo.name}
            </h4>
          </div>
          <p className="text-sand-400">
            Preserving and celebrating Sanatan Dharma and Hindu culture in
            Australia.
          </p>
        </div>

        <div>
          <h6 className="mb-3 text-xs font-semibold tracking-widest text-gold-300 uppercase">
            Quick Links
          </h6>
          <div className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sand-200 hover:text-gold-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h6 className="mb-3 text-xs font-semibold tracking-widest text-gold-300 uppercase">
            Community
          </h6>
          <div className="flex flex-col gap-2">
            {communityLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sand-200 hover:text-gold-300"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h6 className="mb-3 text-xs font-semibold tracking-widest text-gold-300 uppercase">
            Follow Us
          </h6>
          <div className="flex flex-col gap-2 text-sand-300">
            {socials.map((s) => (
              <span key={s.label}>{s.label}</span>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto mt-8 max-w-7xl border-t border-sand-700 pt-4 text-xs text-sand-500">
        © 2026 {orgInfo.name}. All rights reserved.
      </div>
    </footer>
  );
}
