"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { membershipPlans, orgInfo } from "@/lib/site-data";
import {
  membershipApplicationSchema,
  type MembershipApplication,
} from "@/lib/membership-schema";

export default function MembershipApplyPage() {
  const today = new Date().toISOString().slice(0, 10);

  const form = useForm<MembershipApplication>({
    resolver: zodResolver(membershipApplicationSchema),
    defaultValues: {
      fullName: "",
      telephone: "",
      email: "",
      planTier: "single",
      spouseName: "",
      spouseTelephone: "",
      spouseEmail: "",
      familyMember1: "",
      familyMember2: "",
      familyMember3: "",
      address: "",
      specialInterests: "",
      signOffDate: today,
    },
  });

  const planTier = form.watch("planTier");
  const isFamilyPlan = planTier === "family";
  const selectedPlan = membershipPlans.find((p) => p.key === planTier);
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: MembershipApplication) {
    try {
      const res = await fetch("/api/membership/checkout", {
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
      <div className="bg-card px-4 py-10 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <Button asChild variant="outline" className="mb-6">
            <Link href="/membership">Back</Link>
          </Button>
          <h1 className="text-[30px] tracking-wide">{orgInfo.name}</h1>
          <div className="font-heading text-sm text-gold-700">
            {orgInfo.mantra}
          </div>
          <div className="mt-1 text-xs text-foreground/55">
            Membership Application · Association Number {orgInfo.associationNumber}
          </div>
        </div>
      </div>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* 1. Applicant Details */}
              <div className="space-y-4 rounded-2xl bg-card p-5 shadow-sm">
                <h3 className="text-cocoa-700">1. Applicant Details</h3>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                          <Input placeholder="John Doe" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Telephone</FormLabel>
                        <FormControl>
                          <Input placeholder="04XXXXXXXX" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email Address</FormLabel>
                      <FormControl>
                        <Input placeholder="name@domain.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* 2. Membership Plan */}
              <div className="space-y-4 rounded-2xl border border-gold-300 bg-gold-100 p-5">
                <h3 className="text-gold-800">2. Select Membership Plan</h3>
                <FormField
                  control={form.control}
                  name="planTier"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="gap-3"
                        >
                          {membershipPlans.map((plan) => (
                            <label
                              key={plan.key}
                              className="flex cursor-pointer items-center gap-3"
                            >
                              <RadioGroupItem value={plan.key} />
                              <span>
                                {plan.label} ({plan.price})
                              </span>
                            </label>
                          ))}
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {isFamilyPlan && (
                <div className="space-y-4 rounded-2xl bg-card p-5 shadow-sm">
                  <h3 className="text-cocoa-700">3. Spouse Details</h3>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="spouseName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spouse Name</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="spouseTelephone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Spouse Telephone</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={form.control}
                    name="spouseEmail"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spouse Email</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}

              <div className="space-y-4 rounded-2xl bg-card p-5 shadow-sm">
                <h3 className="text-cocoa-700">
                  {isFamilyPlan ? "4. Family & Location Profile" : "3. Location Profile"}
                </h3>
                {isFamilyPlan && (
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="familyMember1"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Family Member 1 — Name &amp; Relationship
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Aarav Sharma, Son"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="familyMember2"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Family Member 2 — Name &amp; Relationship
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="e.g. Priya Sharma, Daughter"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
                {isFamilyPlan && (
                  <FormField
                    control={form.control}
                    name="familyMember3"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>
                          Family Member 3 — Name &amp; Relationship
                        </FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Rina Sharma, Mother" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Residential Address</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Street, Suburb, State Postcode"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="specialInterests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Special Interests for Volunteering</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g. Cultural Events, Food Prep, Audio/Visual"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="rounded-2xl bg-card p-5 shadow-sm">
                <FormField
                  control={form.control}
                  name="signOffDate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Applicant Sign-Off Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex flex-col items-end gap-2 border-t border-border pt-6">
                <p className="text-sm text-foreground/60">
                  You&apos;ll pay securely via Stripe on the next step
                  {selectedPlan ? ` — ${selectedPlan.price} AUD` : ""}.
                </p>
                <Button type="submit" size="lg" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Redirecting to payment…
                    </>
                  ) : (
                    `Continue to Payment${selectedPlan ? ` — ${selectedPlan.price}` : ""}`
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </>
  );
}
