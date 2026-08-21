"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { orgInfo } from "@/lib/site-data";

type VerifyResult =
  | { status: "loading" }
  | {
      status: "success";
      data: { fullName: string; amount: number; currency: string; email: string };
    }
  | { status: "error"; error: string };

function DonateSuccessLoading() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl bg-card p-10 text-center shadow-md">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-foreground/70">Confirming your donation…</p>
      </div>
    </section>
  );
}

export default function DonateSuccessPage() {
  return (
    <Suspense fallback={<DonateSuccessLoading />}>
      <DonateSuccessContent />
    </Suspense>
  );
}

function DonateSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [result, setResult] = useState<VerifyResult>({ status: "loading" });

  useEffect(() => {
    if (!sessionId) {
      setResult({ status: "error", error: "No payment reference was provided." });
      return;
    }

    let cancelled = false;
    fetch(`/api/donate/verify?session_id=${encodeURIComponent(sessionId)}`)
      .then((res) => res.json())
      .then((json) => {
        if (cancelled) return;
        if (json.success) {
          setResult({ status: "success", data: json.data });
        } else {
          setResult({ status: "error", error: json.error || "Something went wrong." });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setResult({
            status: "error",
            error: "We couldn't reach the server to confirm your donation.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (result.status === "loading") {
    return <DonateSuccessLoading />;
  }

  if (result.status === "error") {
    return (
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl bg-card p-10 text-center shadow-md">
          <AlertCircle className="size-12 text-destructive" />
          <h1 className="text-2xl">Something went wrong</h1>
          <p className="text-foreground/70">{result.error}</p>
          <p className="text-sm text-foreground/55">
            If you were charged, don&apos;t worry — please contact us at{" "}
            <a href={`mailto:${orgInfo.email}`} className="text-gold-700 underline">
              {orgInfo.email}
            </a>{" "}
            or {orgInfo.phone} with your payment receipt so we can sort this out.
          </p>
          <Button asChild size="lg" className="mt-2">
            <Link href="/donate/give">Back to Donation</Link>
          </Button>
        </div>
      </section>
    );
  }

  const { data } = result;
  const firstName = data.fullName.trim().split(/\s+/)[0] || data.fullName;

  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl bg-card p-10 text-center shadow-md">
        <span className="flex size-16 items-center justify-center rounded-full bg-primary/15">
          <CheckCircle2 className="size-9 text-primary" />
        </span>
        <div className="font-heading text-sm text-gold-700">
          &quot;दानं परमो धर्मः&quot; — Giving is the highest virtue
        </div>
        <h1 className="text-3xl">Thank you{firstName ? `, ${firstName}` : ""}!</h1>
        <p className="max-w-md text-foreground/75">
          Your donation of{" "}
          <strong>
            ${data.amount.toFixed(2)} {data.currency.toUpperCase()}
          </strong>{" "}
          to {orgInfo.name} has been received. It means a great deal to our community.
        </p>
        {data.email && (
          <p className="text-sm text-foreground/55">
            A confirmation email has been sent to {data.email}.
          </p>
        )}
        <div className="mt-4 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link href="/">Back to Home</Link>
          </Button>
          <Button asChild size="lg" variant="outline">
            <Link href="/events">See Upcoming Events</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
