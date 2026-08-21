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
      data: {
        membershipId: string;
        isRenewal: boolean;
        fullName: string;
        planLabel: string;
        amount: number;
        currency: string;
        email: string;
      };
    }
  | { status: "error"; error: string };

function MembershipApplySuccessLoading() {
  return (
    <section className="px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-4 rounded-3xl bg-card p-10 text-center shadow-md">
        <Loader2 className="size-10 animate-spin text-primary" />
        <p className="text-foreground/70">Confirming your payment and membership…</p>
      </div>
    </section>
  );
}

export default function MembershipApplySuccessPage() {
  return (
    <Suspense fallback={<MembershipApplySuccessLoading />}>
      <MembershipApplySuccessContent />
    </Suspense>
  );
}

function MembershipApplySuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [result, setResult] = useState<VerifyResult>({ status: "loading" });

  useEffect(() => {
    if (!sessionId) {
      setResult({ status: "error", error: "No payment reference was provided." });
      return;
    }

    let cancelled = false;
    fetch(`/api/membership/verify?session_id=${encodeURIComponent(sessionId)}`)
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
            error: "We couldn't reach the server to confirm your registration.",
          });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  if (result.status === "loading") {
    return <MembershipApplySuccessLoading />;
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
            <Link href="/membership/apply">Back to Application</Link>
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
        <div className="font-heading text-sm text-gold-700">{orgInfo.mantra}</div>
        <h1 className="text-3xl">
          {data.isRenewal ? `Thank you, ${firstName}!` : `Welcome to the family, ${firstName}!`}
        </h1>
        <p className="max-w-md text-foreground/75">
          {data.isRenewal
            ? `Your payment for a ${data.planLabel} membership has been received against your existing membership.`
            : `Thank you for becoming a ${data.planLabel} member of ${orgInfo.name}.`}{" "}
          Your payment of{" "}
          <strong>
            ${data.amount.toFixed(2)} {data.currency.toUpperCase()}
          </strong>{" "}
          has been received and your membership is active.
        </p>
        <div className="rounded-2xl border border-gold-300 bg-gold-100 px-6 py-3">
          <div className="text-xs text-foreground/55">Your Membership ID</div>
          <div className="font-heading text-xl tracking-wide text-gold-800">
            {data.membershipId}
          </div>
        </div>
        {data.email && (
          <p className="text-sm text-foreground/55">
            A confirmation email with your membership card has been sent to {data.email}.
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
