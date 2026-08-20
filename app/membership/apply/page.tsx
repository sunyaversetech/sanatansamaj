"use client";

import { useState } from "react";
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
import { CheckoutDialog } from "@/components/checkout-dialog";
import { membershipPlans, orgInfo } from "@/lib/site-data";
import {
  membershipApplicationSchema,
  type MembershipApplication,
} from "@/lib/membership-schema";

const familyMemberFields = [
  {
    name: "familyMember1Name",
    relation: "familyMember1Relation",
    label: "Family Member 1",
  },
  {
    name: "familyMember2Name",
    relation: "familyMember2Relation",
    label: "Family Member 2 (optional)",
  },
  {
    name: "familyMember3Name",
    relation: "familyMember3Relation",
    label: "Family Member 3 (optional)",
  },
] as const;

export default function MembershipApplyPage() {
  const today = new Date().toISOString().slice(0, 10);

  const form = useForm<MembershipApplication>({
    resolver: zodResolver(membershipApplicationSchema),
    defaultValues: {
      fullName: "",
      telephone: "",
      email: "",
      occupation: "",
      planTier: "single",
      familyMember1Name: "",
      familyMember1Relation: "",
      familyMember2Name: "",
      familyMember2Relation: "",
      familyMember3Name: "",
      familyMember3Relation: "",
      address: "",
      specialInterests: "",
      signOffDate: today,
    },
  });

  const planTier = form.watch("planTier");
  const isFamilyPlan = planTier === "family";
  const selectedPlan = membershipPlans.find((p) => p.key === planTier);
  const isSubmitting = form.formState.isSubmitting;

  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);

  async function onSubmit(values: MembershipApplication) {
    try {
      const res = await fetch("/api/membership/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok || !data.clientSecret) {
        throw new Error(data.error || "Could not start checkout");
      }

      setClientSecret(data.clientSecret);
      setCheckoutOpen(true);
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
            Membership Application · Association Number{" "}
            {orgInfo.associationNumber}
          </div>
        </div>
      </div>

      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
                  <FormField
                    control={form.control}
                    name="occupation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Occupation</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="e.g. Software Engineer"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
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
                          className="gap-3">
                          {membershipPlans.map((plan) => (
                            <label
                              key={plan.key}
                              className="flex cursor-pointer items-center gap-3">
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
                  <h3 className="text-cocoa-700">3. Family Members</h3>
                  {familyMemberFields.map((f) => (
                    <div
                      key={f.name}
                      className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <FormField
                        control={form.control}
                        name={f.name}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{f.label} — Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Priya Sharma"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name={f.relation}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{f.label} — Relationship</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="e.g. Spouse, Son, Daughter"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-4 rounded-2xl bg-card p-5 shadow-sm">
                <h3 className="text-cocoa-700">
                  {isFamilyPlan ? "4. Location Profile" : "3. Location Profile"}
                </h3>
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
                      Opening secure checkout…
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

      <CheckoutDialog
        open={checkoutOpen}
        onOpenChange={setCheckoutOpen}
        clientSecret={clientSecret}
      />
    </>
  );
}
