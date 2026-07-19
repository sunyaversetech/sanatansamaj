import { z } from "zod";

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
