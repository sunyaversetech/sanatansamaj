import { z } from "zod";
import { manualPaymentMethodSchema } from "@/lib/manual-payment";

export const donationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  amount: z.coerce
    .number()
    .int("Enter a whole dollar amount")
    .min(1, "Enter a donation amount")
    .max(100000, "For donations over $100,000 please contact us directly"),
  isAnonymous: z.boolean(),
});

export type Donation = z.infer<typeof donationSchema>;

// A donation an admin records after the fact. Unlike the public form, cents are
// allowed (cash doesn't come in whole dollars) and email is optional, since
// someone handing over cash may not leave one.
export const adminDonationSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address").or(z.literal("")),
  amount: z
    .number({ invalid_type_error: "Please enter the amount received" })
    .min(0.01, "Please enter the amount received"),
  isAnonymous: z.boolean(),
  paymentMethod: manualPaymentMethodSchema,
  donatedOn: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Please provide the donation date"),
  sendThankYouEmail: z.boolean(),
});

export type AdminDonationInput = z.infer<typeof adminDonationSchema>;
