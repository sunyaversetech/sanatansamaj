"use client";
import Navbar from "@/components/navbar";
import Link from "next/link";
import { Heart, Target, Users, BookOpen } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";

export const donationSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  amount: z
    .number({ invalid_type_error: "Please enter a valid amount" })
    .positive("Donation amount must be greater than 0"),
  donationType: z.enum([
    "One-time Donation",
    "Monthly Recurring",
    "Annual Donation",
  ]),
  isAnonymous: z.boolean(),
});

export type DonationFormValues = z.infer<typeof donationSchema>;

export default function Donate() {
  const form = useForm<DonationFormValues>({
    resolver: zodResolver(donationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      amount: undefined,
      donationType: "One-time Donation",
      isAnonymous: false,
    },
  });

  // 2. Network Client submission action handler
  async function onSubmit(values: DonationFormValues) {
    try {
      const response = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });

      const result = await response.json();
      if (result.success) {
        alert("Thank you for your generous donation!");
        form.reset();
      } else {
        alert("Submission rejected: " + JSON.stringify(result.errors));
      }
    } catch (err) {
      console.error("Network error submitting donation details:", err);
    }
  }

  // Quick helper to safely override the amount field values via standard quick-buttons
  const setQuickAmount = (value: number) => {
    form.setValue("amount", value, { shouldValidate: true });
  };
  return (
    <>
      <Navbar />

      <div className="pt-20">
        {/* Hero Section */}
        <section className="bg-black text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl sm:text-6xl font-serif font-bold mb-6">
              Support Our Mission
            </h1>
            <p className="text-xl text-white/80">
              Your generosity helps us preserve and celebrate our rich cultural
              heritage
            </p>
          </div>
        </section>

        {/* Why Donate */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              Why Your Support Matters
            </h2>
            <div className="grid md:grid-cols-2 gap-8 mb-16">
              <div className="flex gap-4">
                <Users className="w-12 h-12 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-black mb-2">
                    Growing Community
                  </h3>
                  <p className="text-gray-700">
                    Your donations help us expand our programs and reach more
                    people seeking spiritual connection and cultural knowledge.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <BookOpen className="w-12 h-12 text-secondary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-black mb-2">
                    Educational Programs
                  </h3>
                  <p className="text-gray-700">
                    Support scholarships and free educational programs that
                    bring Hindu knowledge and philosophy to everyone.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Heart className="w-12 h-12 text-primary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-black mb-2">
                    Community Service
                  </h3>
                  <p className="text-gray-700">
                    Enable us to continue our seva (service) initiatives that
                    help those in need and strengthen community bonds.
                  </p>
                </div>
              </div>
              <div className="flex gap-4">
                <Target className="w-12 h-12 text-secondary flex-shrink-0" />
                <div>
                  <h3 className="text-xl font-serif font-bold text-black mb-2">
                    Cultural Events
                  </h3>
                  <p className="text-gray-700">
                    Organize meaningful festivals and cultural celebrations that
                    bring our community together.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Donation Levels */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-4">
              Donation Options
            </h2>
            <p className="text-center text-gray-700 mb-16 text-lg">
              Choose an amount that works for you, or make a custom donation
            </p>
            <div className="grid sm:grid-cols-2 md:grid-cols-4 gap-6 mb-12">
              {[
                { amount: "$25", impact: "Supports 1 Person's Program Access" },
                { amount: "$50", impact: "Funds Weekly Spiritual Program" },
                { amount: "$100", impact: "Supports Educational Workshop" },
                { amount: "$250", impact: "Enables Community Service Day" },
                { amount: "$500", impact: "Sponsors Cultural Event" },
                { amount: "$1000", impact: "Supports Full Scholarship" },
                { amount: "Custom", impact: "Make Your Own Donation" },
                { amount: "Monthly", impact: "Become a Sustaining Donor" },
              ].map((option, index) => (
                <button
                  key={index}
                  className="p-6 bg-white border-2 border-primary rounded-lg hover:shadow-lg transition-all hover:border-secondary group">
                  <h3 className="text-3xl font-bold text-primary mb-2 group-hover:text-secondary transition-colors">
                    {option.amount}
                  </h3>
                  <p className="text-sm text-gray-700">{option.impact}</p>
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Impact Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              Your Impact
            </h2>
            <div className="grid md:grid-cols-4 gap-8 text-center">
              {[
                { number: "2,500+", label: "Active Members" },
                { number: "50+", label: "Annual Events" },
                { number: "30+", label: "Volunteers" },
                { number: "$100K+", label: "Community Service" },
              ].map((stat, index) => (
                <div
                  key={index}
                  className="p-8 bg-gradient-to-br from-primary/10 to-transparent rounded-lg">
                  <h3 className="text-4xl font-serif font-bold text-primary mb-2">
                    {stat.number}
                  </h3>
                  <p className="text-gray-700 font-semibold">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How Donations Are Used */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-serif font-bold text-center text-black mb-16">
              How We Use Your Donations
            </h2>
            <div className="space-y-6">
              {[
                {
                  category: "Educational Programs",
                  percent: 35,
                  color: "from-primary",
                },
                {
                  category: "Community Events",
                  percent: 25,
                  color: "from-secondary",
                },
                {
                  category: "Facility & Operations",
                  percent: 20,
                  color: "from-primary",
                },
                {
                  category: "Community Service",
                  percent: 20,
                  color: "from-secondary",
                },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex justify-between mb-2">
                    <h3 className="font-semibold text-black">
                      {item.category}
                    </h3>
                    <span className="font-bold text-primary">
                      {item.percent}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
                    <div
                      className={`bg-gradient-to-r ${item.color} to-opacity-70 h-full rounded-full transition-all`}
                      style={{ width: `${item.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <p className="text-center text-gray-700 mt-12">
              We are a transparent organization committed to using your
              donations responsibly and effectively. Our financial reports are
              available upon request.
            </p>
          </div>
        </section>

        {/* Donation Form */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-3xl font-serif font-bold text-center text-black mb-12">
              Make Your Donation
            </h2>
            <div className="bg-gradient-to-br from-primary/5 to-secondary/5 p-8 rounded-lg border-2 border-primary/20">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6">
                  {/* Row: First and Last Name Fields */}
                  <div className="grid md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-black">
                            First Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your first name"
                              className="border-2 py-6 focus-visible:ring-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="lastName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold text-black">
                            Last Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              placeholder="Your last name"
                              className="border-2 py-6 focus-visible:ring-primary"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Email Input Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-black">
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="your@email.com"
                            className="border-2 py-6 focus-visible:ring-primary"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Amount Inputs with Preset Quick Pick Buttons */}
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-black">
                          Donation Amount
                        </FormLabel>
                        <div className="flex gap-3 mb-4">
                          {[25, 50, 100, 250].map((amt) => (
                            <Button
                              key={amt}
                              type="button"
                              variant="outline"
                              className="flex-1 py-5 border-2 border-primary text-primary font-medium hover:bg-primary hover:text-white transition-all"
                              onClick={() => setQuickAmount(amt)}>
                              ${amt}
                            </Button>
                          ))}
                        </div>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="Or enter custom amount"
                            className="border-2 py-6 focus-visible:ring-primary"
                            {...field}
                            value={field.value ?? ""}
                            onChange={(e) =>
                              field.onChange(
                                e.target.value === ""
                                  ? undefined
                                  : Number(e.target.value),
                              )
                            }
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Donation Recurrence Selector */}
                  <FormField
                    control={form.control}
                    name="donationType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold text-black">
                          Donation Type
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-2 h-12 focus:ring-primary">
                              <SelectValue placeholder="Select frequency plan" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="One-time Donation">
                              One-time Donation
                            </SelectItem>
                            <SelectItem value="Monthly Recurring">
                              Monthly Recurring
                            </SelectItem>
                            <SelectItem value="Annual Donation">
                              Annual Donation
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Anonymous Checkbox Block */}
                  <FormField
                    control={form.control}
                    name="isAnonymous"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="h-5 w-5 border-2 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="text-sm font-medium text-gray-700 cursor-pointer">
                            Make this donation anonymous
                          </FormLabel>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Final Submit Trigger */}
                  <Button
                    type="submit"
                    className="w-full py-6 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all transform hover:scale-[1.02]">
                    Donate Now
                  </Button>

                  <p className="text-center text-sm text-gray-600">
                    Your donation is secure and processed through our trusted
                    payment partner.
                  </p>
                </form>
              </Form>
            </div>
          </div>
        </section>

        {/* Corporate Partnerships */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50 to-white">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-serif font-bold text-black mb-6">
              Corporate Partnerships
            </h2>
            <p className="text-lg text-gray-700 mb-8">
              Are you a business interested in supporting our mission? We offer
              corporate partnership opportunities with meaningful benefits.
            </p>
            <Link
              href="/contact"
              className="inline-block px-8 py-4 bg-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all">
              Explore Partnership Opportunities
            </Link>
          </div>
        </section>

        {/* Tax Information */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
          <div className="max-w-4xl mx-auto bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-lg border-l-4 border-blue-500">
            <h3 className="text-2xl font-serif font-bold text-black mb-4">
              Tax Benefits
            </h3>
            <p className="text-gray-700 mb-4">
              Sanatansamaj is a registered 501(c)(3) nonprofit organization.
              Your donation is tax-deductible to the extent allowed by law.
            </p>
            <p className="text-gray-700">
              Tax ID: XX-XXXXXXX | Donations are deductible for federal income
              tax purposes.
            </p>
          </div>
        </section>

        {/* Thank You Section */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-black text-white">
          <div className="max-w-4xl mx-auto text-center">
            <Heart className="w-16 h-16 text-primary mx-auto mb-6" />
            <h2 className="text-4xl font-serif font-bold mb-6">
              Thank You for Your Support
            </h2>
            <p className="text-xl text-white/80 mb-8">
              Your generosity makes our mission possible and helps us serve our
              community better every day.
            </p>
          </div>
        </section>
      </div>
    </>
  );
}
