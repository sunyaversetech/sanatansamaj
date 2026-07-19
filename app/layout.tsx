import type { Metadata } from "next";
import { Caprasimo, Figtree } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-figtree",
});

const caprasimo = Caprasimo({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-caprasimo",
});

export const metadata: Metadata = {
  title: "Sanatan Samaj Australia",
  description:
    "Sanatan Samaj Australia (SSA) is a Canberra-based community dedicated to nurturing Sanatan Dharma, Hindu culture and mutual support in Australia.",
  generator: "whaustralia.com",
  icons: {
    icon: [
      { url: "/logo.png", media: "(prefers-color-scheme: light)" },
      { url: "/logo.png", media: "(prefers-color-scheme: dark)" },
    ],
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${figtree.variable} ${caprasimo.variable}`}>
      <body className="flex min-h-screen flex-col bg-background text-foreground antialiased">
        <SiteHeader />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Toaster position="top-center" richColors />
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
