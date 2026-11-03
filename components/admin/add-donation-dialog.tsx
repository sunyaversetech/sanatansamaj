"use client";

import { useState } from "react";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { HeartHandshake, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { manualPaymentMethodLabels } from "@/lib/manual-payment";
import {
  adminDonationSchema,
  type AdminDonationInput,
} from "@/lib/donation-schema";

function getDefaultValues(): AdminDonationInput {
  return {
    fullName: "",
    email: "",
    amount: Number.NaN,
    isAnonymous: false,
    paymentMethod: "cash",
    donatedOn: format(new Date(), "yyyy-MM-dd"),
    sendThankYouEmail: true,
  };
}

export function AddDonationDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AdminDonationInput>({
    resolver: zodResolver(adminDonationSchema),
    defaultValues: getDefaultValues(),
  });

  const hasEmail = Boolean(form.watch("email"));
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: AdminDonationInput) {
    try {
      const res = await fetch("/api/admin/donations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not add this donation");
      }

      toast.success("Donation recorded");
      if (data.emailFailed) {
        toast.warning("The thank-you email could not be sent", {
          description: "The donation was saved, but the donor hasn't been emailed.",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["admin-donations"] });
      onAdded();
      form.reset(getDefaultValues());
      setOpen(false);
    } catch (err) {
      console.error("Add donation error:", err);
      toast.error("Could not record donation", {
        description:
          err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <HeartHandshake className="h-4 w-4" />
          Add Donation
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90vh] w-full overflow-y-auto"
        onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Donation</DialogTitle>
          <DialogDescription>
            Record a donation received outside of Stripe. It&apos;s marked as
            paid and counted in the dashboard totals.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Full Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Donor's full name" {...field} />
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
                  <FormLabel>Email Address (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="name@domain.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Amount Received (AUD)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min={0}
                        step="0.01"
                        {...field}
                        value={Number.isNaN(field.value) ? "" : field.value}
                        onChange={(e) => field.onChange(e.target.valueAsNumber)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="paymentMethod"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Payment Method</FormLabel>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(manualPaymentMethodLabels).map(([key, label]) => (
                          <SelectItem key={key} value={key}>
                            {label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="donatedOn"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Donation Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="isAnonymous"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    The donor wants this donation to be anonymous
                  </FormLabel>
                </FormItem>
              )}
            />

            {hasEmail && (
              <FormField
                control={form.control}
                name="sendThankYouEmail"
                render={({ field }) => (
                  <FormItem className="flex items-center gap-2">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Email the donor a thank-you message
                    </FormLabel>
                  </FormItem>
                )}
              />
            )}

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Add Donation
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
