import mongoose, { Schema, type InferSchemaType } from "mongoose";

const DonationSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    isAnonymous: { type: Boolean, required: true, default: false },

    // "pending" is written as soon as checkout starts (before payment);
    // "paid" is written once Stripe confirms payment and fulfillment runs.
    status: { type: String, enum: ["pending", "paid"], default: "pending", index: true },

    stripeSessionId: { type: String, required: true, unique: true },
    stripePaymentIntentId: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export type DonationDoc = InferSchemaType<typeof DonationSchema>;

export const Donation =
  mongoose.models.Donation || mongoose.model("Donation", DonationSchema);
