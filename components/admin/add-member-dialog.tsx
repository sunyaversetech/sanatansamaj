"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2, UserPlus } from "lucide-react";
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
import { membershipPlans } from "@/lib/site-data";
import {
  adminMembershipSchema,
  manualPaymentMethodLabels,
  type AdminMembershipInput,
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

function getDefaultValues(): AdminMembershipInput {
  return {
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
    signOffDate: new Date().toISOString().slice(0, 10),
    amountPaid: membershipPlans[0].amount,
    paymentMethod: "cash",
    sendWelcomeEmail: true,
  };
}

export function AddMemberDialog({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();

  const form = useForm<AdminMembershipInput>({
    resolver: zodResolver(adminMembershipSchema),
    defaultValues: getDefaultValues(),
  });

  const isFamilyPlan = form.watch("planTier") === "family";
  const isSubmitting = form.formState.isSubmitting;

  async function onSubmit(values: AdminMembershipInput) {
    try {
      const res = await fetch("/api/admin/memberships", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Could not add this member");
      }

      toast.success(data.isRenewal ? "Membership renewed" : "Member added", {
        description: `Membership ID: ${data.membershipId}`,
      });
      if (data.emailFailed) {
        toast.warning("The welcome email could not be sent", {
          description: "The member was saved, but they haven't received their card.",
        });
      }

      await queryClient.invalidateQueries({ queryKey: ["admin-memberships"] });
      onAdded();
      form.reset(getDefaultValues());
      setOpen(false);
    } catch (err) {
      console.error("Add member error:", err);
      toast.error("Could not add member", {
        description:
          err instanceof Error ? err.message : "Please try again.",
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <UserPlus className="h-4 w-4" />
          Add Member
        </Button>
      </DialogTrigger>
      <DialogContent
        className="max-h-[90vh] w-full overflow-y-auto sm:max-w-2xl"
        onInteractOutside={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>Add Member</DialogTitle>
          <DialogDescription>
            Record a member who paid outside of Stripe. They&apos;re marked as
            paid and given a membership ID straight away.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input placeholder="e.g. Software Engineer" {...field} />
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
                    <Input placeholder="Street, Suburb, State Postcode" {...field} />
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

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="planTier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Membership Plan</FormLabel>
                    <Select
                      value={field.value}
                      onValueChange={(value: AdminMembershipInput["planTier"]) => {
                        field.onChange(value);
                        const plan = membershipPlans.find((p) => p.key === value);
                        if (plan) form.setValue("amountPaid", plan.amount);
                      }}>
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {membershipPlans.map((plan) => (
                          <SelectItem key={plan.key} value={plan.key}>
                            {plan.label} ({plan.price})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="signOffDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Sign-Off Date</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="amountPaid"
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

            {isFamilyPlan &&
              familyMemberFields.map((f) => (
                <div key={f.name} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <FormField
                    control={form.control}
                    name={f.name}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{f.label} — Name</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g. Priya Sharma" {...field} />
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
                          <Input placeholder="e.g. Spouse, Son, Daughter" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              ))}

            <FormField
              control={form.control}
              name="sendWelcomeEmail"
              render={({ field }) => (
                <FormItem className="flex items-center gap-2">
                  <FormControl>
                    <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                  </FormControl>
                  <FormLabel className="font-normal">
                    Email the member their welcome message and membership card
                  </FormLabel>
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Add Member
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
