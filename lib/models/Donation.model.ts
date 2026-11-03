import mongoose, { Schema, type InferSchemaType } from "mongoose";

const DonationSchema = new Schema(
  {
    fullName: { type: String, required: true },
    // Always present on Stripe donations. Optional only on ones an admin
    // recorded by hand, since a cash donor may not leave an email.
    email: {
      type: String,
      required: function (this: { paymentMethod?: string }) {
        return this.paymentMethod === "stripe";
      },
      lowercase: true,
      trim: true,
      index: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    isAnonymous: { type: Boolean, required: true, default: false },

    // "pending" is written as soon as checkout starts (before payment);
    // "paid" is written once Stripe confirms payment and fulfillment runs.
    status: { type: String, enum: ["pending", "paid"], default: "pending", index: true },

    // Donations recorded by an admin never went through Stripe, so they hold a
    // generated "manual_<uuid>" placeholder to satisfy the required/unique index.
    stripeSessionId: { type: String, required: true, unique: true },
    stripePaymentIntentId: { type: String, default: null },

    // How the donation was paid. Documents written before this field existed
    // don't have it, and those were all paid through Stripe.
    paymentMethod: {
      type: String,
      enum: ["stripe", "cash", "bank_transfer", "other"],
      default: "stripe",
    },

    // The day an admin-recorded donation was actually given ("YYYY-MM-DD"),
    // which can be earlier than createdAt. Stripe donations don't set this.
    donatedOn: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export type DonationDoc = InferSchemaType<typeof DonationSchema>;

export const Donation =
  mongoose.models.Donation || mongoose.model("Donation", DonationSchema);
