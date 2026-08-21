import mongoose, { Schema, type InferSchemaType } from "mongoose";

const MembershipSchema = new Schema(
  {
    // Stable per-person identifier (e.g. "AMS-00001"). Shared across every
    // purchase made by the same email — a repeat purchase is recorded as a
    // new document but reuses this same id rather than incrementing.
    // Not known yet when the row is first inserted at checkout time (status
    // "pending") — it's assigned once payment is verified.
    membershipId: { type: String, index: true },

    fullName: { type: String, required: true },
    telephone: { type: String, required: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true },
    occupation: { type: String },

    planTier: { type: String, enum: ["single", "family", "life"], required: true },

    familyMember1Name: { type: String },
    familyMember1Relation: { type: String },
    familyMember2Name: { type: String },
    familyMember2Relation: { type: String },
    familyMember3Name: { type: String },
    familyMember3Relation: { type: String },

    address: { type: String, required: true },
    specialInterests: { type: String },
    signOffDate: { type: String, required: true },

    amountPaid: { type: Number, required: true },
    currency: { type: String, required: true },

    // True when this purchase reused an existing membershipId because the
    // email already had one on file, rather than being assigned a fresh id.
    isRenewal: { type: Boolean, required: true, default: false },

    // "pending" is written as soon as checkout starts (before payment);
    // "paid" is written once Stripe confirms payment and fulfillment runs.
    status: { type: String, enum: ["pending", "paid"], default: "pending", index: true },

    stripeSessionId: { type: String, required: true, unique: true },
    stripePaymentIntentId: { type: String, default: null },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export type MembershipDoc = InferSchemaType<typeof MembershipSchema>;

export const Membership =
  mongoose.models.Membership || mongoose.model("Membership", MembershipSchema);
