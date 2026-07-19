"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const formSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    telephone: z.string().min(6, "A valid telephone number is required"),
    email: z.string().email("Please enter a valid email address"),
    planTier: z.enum(["single", "family", "life"]),
    spouseName: z.string().optional(),
    spouseTelephone: z.string().optional(),
    spouseEmail: z.string().optional(),
    familyMember1: z.string().optional(),
    familyMember2: z.string().optional(),
    familyMember3: z.string().optional(),
    address: z.string().min(5, "Residential address is required"),
    specialInterests: z.string().optional(),
    paymentMethod: z.enum(["Direct Deposit (Bank Transfer)", "Cash", "Cheque"]),
    transferReference: z.string().optional(),
    amount: z.coerce.number().positive("Enter the amount remitted"),
    signOffDate: z.string().min(1, "Please provide the sign-off date"),
  })
  .superRefine((data, ctx) => {
    if (data.planTier === "family") {
      if (!data.spouseName) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Spouse name is required for a family membership",
          path: ["spouseName"],
        });
      }
      if (data.paymentMethod === "Direct Deposit (Bank Transfer)" && !data.transferReference) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Reference name is required",
          path: ["transferReference"],
        });
      }
    }
  });

type FormValues = z.infer<typeof formSchema>;

export default function MembershipApplyPage() {
  const router = useRouter();
  const today = new Date().toISOString().slice(0, 10);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
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
      paymentMethod: "Direct Deposit (Bank Transfer)",
      transferReference: "",
      amount: 15,
      signOffDate: today,
    },
  });

  const planTier = form.watch("planTier");
  const isFamilyPlan = planTier === "family";

  useEffect(() => {
    const plan = membershipPlans.find((p) => p.key === planTier);
    if (plan) form.setValue("amount", plan.amount);
  }, [planTier, form]);

  function onSubmit(values: FormValues) {
    console.log("Membership application submitted:", values);
    toast.success("Application submitted", {
      description: "Thank you — our Secretary will be in touch shortly.",
    });
    form.reset();
    router.push("/membership");
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

              {/* Payment */}
              <div className="space-y-4 rounded-2xl bg-card p-5 shadow-sm">
                <h3 className="text-cocoa-700">5. Payment Details</h3>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Mechanism Used</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="w-full">
                            <SelectValue />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Direct Deposit (Bank Transfer)">
                            Direct Deposit (Bank Transfer)
                          </SelectItem>
                          <SelectItem value="Cash">Cash</SelectItem>
                          <SelectItem value="Cheque">Cheque</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="rounded-xl border border-border p-4 text-sm">
                  <div className="mb-2 font-semibold">
                    Please transfer the membership fee to this account:
                  </div>
                  <div>
                    <strong>Account Name:</strong> Sanatan Samaj Australia
                  </div>
                  <div>
                    <strong>BSB:</strong> 032713
                  </div>
                  <div>
                    <strong>Account Number:</strong> 508265
                  </div>
                  <div className="mt-3">
                    <FormField
                      control={form.control}
                      name="transferReference"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            Your Transfer Account Name Reference
                          </FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Total Remitted Amount ($)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
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

              <div className="flex justify-end border-t border-border pt-6">
                <Button type="submit" size="lg">
                  Submit Application Record
                </Button>
              </div>
            </form>
          </Form>
        </div>
      </section>
    </>
  );
}
