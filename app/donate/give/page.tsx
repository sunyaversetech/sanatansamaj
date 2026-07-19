"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
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

const formSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  amount: z.coerce.number().positive("Enter a donation amount"),
  isAnonymous: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

export default function DonateGivePage() {
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      amount: 0,
      isAnonymous: false,
    },
  });

  const selectedAmount = form.watch("amount");

  function onSubmit(values: FormValues) {
    console.log("Donation submitted:", values);
    toast.success("Thank you for your generosity", {
      description: `Your $${values.amount} donation has been recorded.`,
    });
    form.reset();
    router.push("/donate");
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
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your first name" {...field} />
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
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your last name" {...field} />
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

              <Button type="submit" size="lg" className="w-full">
                Donate Now
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
