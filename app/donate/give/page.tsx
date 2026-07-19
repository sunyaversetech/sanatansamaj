"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { cn } from "@/lib/utils";
import { donationAmounts } from "@/lib/site-data";
import { donationSchema, type Donation } from "@/lib/donation-schema";

export default function DonateGivePage() {
  const form = useForm<Donation>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      fullName: "",
      email: "",
      amount: 0,
      isAnonymous: false,
    },
  });

  const selectedAmount = form.watch("amount");
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: Donation) {
    try {
      const res = await fetch("/api/donate/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok || !data.url) {
        throw new Error(data.error || "Could not start checkout");
      }

      window.location.href = data.url;
    } catch (err) {
      console.error("Checkout error:", err);
      toast.error("Something went wrong", {
        description: "We couldn't start the payment. Please try again.",
      });
    }
  }

  return (
    <>
      <div className="bg-card px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/donate">Back</Link>
          </Button>
          <h1>Make a Donation</h1>
        </div>
      </div>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Your full name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email Address</FormLabel>
                    <FormControl>
                      <Input placeholder="your@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Donation Amount</FormLabel>
                    <div className="grid grid-cols-4 gap-2">
                      {donationAmounts.map((amt) => (
                        <button
                          type="button"
                          key={amt}
                          onClick={() => field.onChange(amt)}
                          className={cn(
                            "rounded-full border py-2 font-heading text-sm transition-colors",
                            selectedAmount === amt
                              ? "border-gold-400 bg-primary text-primary-foreground"
                              : "border-gold-400 text-gold-700 hover:bg-gold-100",
                          )}
                        >
                          ${amt}
                        </button>
                      ))}
                    </div>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Or enter custom amount"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="isAnonymous"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-center gap-2 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className="cursor-pointer font-normal">
                      Make this donation anonymous
                    </FormLabel>
                  </FormItem>
                )}
              />

              <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Redirecting to payment…
                  </>
                ) : (
                  "Donate Now"
                )}
              </Button>
              <p className="text-center text-xs text-foreground/55">
                Your donation is secure and processed through our trusted
                payment partner.
              </p>
            </form>
          </Form>
        </div>
      </section>
    </>
  );
}
