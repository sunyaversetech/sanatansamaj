"use client";

import React from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { Check } from "lucide-react";

// shadcn components
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z.string().min(2, "Applicant name is required"),
  telephone: z.string().min(6, "Valid telephone number is required"),
  email: z.string().email("Invalid email address"),
  spouseName: z.string().optional(),
  spouseTelephone: z.string().optional(),
  spouseEmail: z.string().optional(),
  otherFamilyMembers: z.string().optional(),
  totalFamilyMembers: z
    .string()
    .min(1, "Total family member count is required"),
  address: z.string().min(5, "Full address is required"),
  specialInterests: z.string().optional(),

  // Membership choices based on the uploaded image layout
  membershipPlan: z.enum(["single_15", "family_25", "life_member"], {
    required_error: "Please select a membership plan",
  }),
  lifeMemberAmount: z.string().optional(),

  // Payment Methods matching the paper options
  paymentMethod: z.enum(["cheque_money_order", "direct_deposit", "cash"], {
    required_error: "Please select your payment method",
  }),
  paymentAmount: z.string().min(1, "Payment amount is required"),

  // Dependent fields based on payment method chosen
  directDepositAccountName: z.string().optional(),
  cashReceivedBy: z.string().optional(),

  applicantDate: z.string().min(1, "Application date is required"),
  spouseDate: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function MembershipFormDialog() {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      telephone: "",
      email: "",
      spouseName: "",
      spouseTelephone: "",
      spouseEmail: "",
      otherFamilyMembers: "",
      totalFamilyMembers: "1",
      address: "",
      specialInterests: "",
      membershipPlan: "single_15",
      lifeMemberAmount: "",
      paymentMethod: "direct_deposit",
      paymentAmount: "15",
      directDepositAccountName: "",
      cashReceivedBy: "",
      applicantDate: new Date().toISOString().split("T")[0],
      spouseDate: "",
    },
  });

  // Dynamically update default value rules based on plan changes
  const watchPlan = form.watch("membershipPlan");
  React.useEffect(() => {
    if (watchPlan === "single_15") form.setValue("paymentAmount", "15");
    if (watchPlan === "family_25") form.setValue("paymentAmount", "25");
  }, [watchPlan, form]);

  const watchPaymentMethod = form.watch("paymentMethod");

  function onSubmit(values: FormValues) {
    console.log("Form Submitted Successfully:", values);
    // Add logic here to sync to your database API endpoint
    alert("Application submitted successfully configuration cached!");
  }

  return (
    <>
      <Navbar />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6">
              Membership
            </h1>
            <p className="text-xl text-white/80">
              Join our vibrant community and become part of something meaningful
            </p>
          </div>
        </section>

        {/* Membership Benefits Info */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-12">
              Why Join Sanatansamaj?
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              {[
                "Access to all community events and programs",
                "Discounted rates on workshops and classes",
                "Exclusive member-only gatherings",
                "Networking opportunities with community leaders",
                "Educational resources and library access",
                "Priority registration for major festivals",
                "Community service opportunities",
                "Family and group membership options",
              ].map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Check className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-1" />
                  <span className="text-gray-700 text-lg">{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Form Dialog Interactive System Trigger */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white text-center border-t border-gray-100">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-serif font-bold mb-4">
              Apply Digitally
            </h2>
            <p className="text-gray-600 mb-8">
              Fill out your registration and setup your ecosystem profile safely
              via our automated interface.
            </p>

            <Dialog>
              <DialogTrigger asChild>
                <Button className="px-8 py-6 text-lg bg-emerald-700 hover:bg-emerald-800 text-white font-semibold rounded-lg shadow-lg transition-all transform hover:scale-105">
                  Become a Member Now
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:min-w-3xl! md:min-w-4xl! max-h-[90vh] overflow-y-auto bg-white p-6 sm:p-10">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-serif font-bold text-center text-gray-900">
                    SANATAN SAMAJ AUSTRALIA
                  </DialogTitle>
                  <DialogDescription className="text-center text-xs tracking-widest font-mono text-gray-500">
                    ॥ धर्मो रक्षति रक्षितः ॥ • Association Number A06140
                  </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6 mt-4">
                    {/* Primary Applicant Info */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-100">
                      <h3 className="font-serif font-bold text-md text-emerald-800">
                        1. Applicant Details
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="name"
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
                              <Input
                                type="email"
                                placeholder="name@domain.com"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Spouse Info */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-100">
                      <h3 className="font-serif font-bold text-md text-emerald-800">
                        2. Spouse Details (Optional)
                      </h3>
                      <div className="grid sm:grid-cols-2 gap-4">
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
                              <Input type="email" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Household / Household Demographics */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-100">
                      <h3 className="font-serif font-bold text-md text-emerald-800">
                        3. Family & Location Profile
                      </h3>
                      <div className="grid sm:grid-cols-3 gap-4">
                        <div className="sm:col-span-2">
                          <FormField
                            control={form.control}
                            name="otherFamilyMembers"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>
                                  Other Family Member Name(s)
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Separate names with commas"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="totalFamilyMembers"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total Count</FormLabel>
                              <FormControl>
                                <Input type="number" min="1" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Residential Address</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="51/20 Gifford Street, Coombs, ACT 2611"
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
                            <FormLabel>
                              Special Interests for Volunteering
                            </FormLabel>
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

                    {/* Membership Selection Block */}
                    <div className="bg-amber-50/50 p-4 rounded-lg space-y-4 border border-amber-200">
                      <h3 className="font-serif font-bold text-md text-amber-900">
                        4. Select Membership Plan
                      </h3>
                      <FormField
                        control={form.control}
                        name="membershipPlan"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Plan Tier</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose a structural option tier" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="single_15">
                                  Annual Member - Single ($15 pa)
                                </SelectItem>
                                <SelectItem value="family_25">
                                  Annual Member - Family ($25 pa)
                                </SelectItem>
                                <SelectItem value="life_member">
                                  Life Member
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchPlan === "life_member" && (
                        <FormField
                          control={form.control}
                          name="lifeMemberAmount"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Specified Contribution Amount ($)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter amount"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    {/* Payment Verification Handling */}
                    <div className="bg-gray-50 p-4 rounded-lg space-y-4 border border-gray-100">
                      <h3 className="font-serif font-bold text-md text-emerald-800">
                        5. Payment Details
                      </h3>

                      <FormField
                        control={form.control}
                        name="paymentMethod"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Payment Mechanism Used</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}>
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue placeholder="Choose payment method" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="direct_deposit">
                                  Direct Deposit (Bank Transfer)
                                </SelectItem>
                                <SelectItem value="cheque_money_order">
                                  Personal Cheque / Money Order
                                </SelectItem>
                                <SelectItem value="cash">
                                  Cash Contribution
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {watchPaymentMethod === "direct_deposit" && (
                        <div className="p-3 bg-white rounded border border-gray-200 text-xs text-gray-600 space-y-1">
                          <p className="font-semibold text-gray-800">
                            Please execute payment transfer to this banking
                            sequence:
                          </p>
                          <p>
                            <strong>Account Name:</strong> Sanatan Samaj
                            Australia
                          </p>
                          <p>
                            <strong>BSB:</strong> 032713
                          </p>
                          <p>
                            <strong>Account Number:</strong> 508265
                          </p>
                          <div className="pt-2">
                            <FormField
                              control={form.control}
                              name="directDepositAccountName"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel className="text-gray-700">
                                    Your Transfer Account Name Reference
                                  </FormLabel>
                                  <FormControl>
                                    <Input className="h-8" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      )}

                      {watchPaymentMethod === "cash" && (
                        <FormField
                          control={form.control}
                          name="cashReceivedBy"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Name of Committee Member Cash paid to
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Mr / Mrs Committee Representative"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="paymentAmount"
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

                    {/* Dates / Attestation Sign-offs */}
                    <div className="grid sm:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100">
                      <FormField
                        control={form.control}
                        name="applicantDate"
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
                      {form.watch("spouseName") && (
                        <FormField
                          control={form.control}
                          name="spouseDate"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Spouse Sign-Off Date</FormLabel>
                              <FormControl>
                                <Input type="date" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                      <Button
                        type="submit"
                        className="w-full sm:w-auto bg-emerald-700 hover:bg-emerald-800 text-white px-6">
                        Submit Application Record
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </section>

        {/* Financial Constraints Alternative Option */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-black mb-6">
              Financial Constraints?
            </h2>
            <p className="text-xl text-gray-700 mb-8">
              We believe everyone should have access to our community.
              Membership options are available on a sliding scale or through
              service contributions.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-black text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all">
              Contact Us About Options
            </Link>
          </div>
        </section>
      </div>
    </>
  );
}
