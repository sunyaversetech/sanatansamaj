import { z } from "zod";

// Ways an admin can record a payment that was taken outside of Stripe, shared
// by manually added memberships and donations.
export const manualPaymentMethodSchema = z.enum(["cash", "bank_transfer", "other"]);

export const manualPaymentMethodLabels = {
  cash: "Cash",
  bank_transfer: "Bank Transfer",
  other: "Other",
} as const;
