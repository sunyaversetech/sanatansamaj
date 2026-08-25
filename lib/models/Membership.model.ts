import mongoose, { Schema, type InferSchemaType } from "mongoose";

const MembershipSchema = new Schema(
  {
    // Stable per-person identifier (e.g. "AMS-00001"), assigned once on a
    // person's first paid membership and reused on every renewal (renewals
    // update this same document rather than inserting a new one). Not known
    // yet when the row is first inserted at checkout time (status
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

    // Either a 4-digit calendar year (e.g. "2026") for annual plans — always
    // the year the payment was made in, never a rolling 12-month date — or
    // the literal string "Lifetime" for life members. Not known yet at
    // checkout time (status "pending"); assigned once payment is verified.
    validTill: { type: String },

    // True when this purchase reused an existing membershipId because the
    // email already had one on file, rather than being assigned a fresh id.
    isRenewal: { type: Boolean, required: true, default: false },

    // "pending" is written as soon as checkout starts (before payment);
    // "paid" is written once Stripe confirms payment and fulfillment runs.
    status: { type: String, enum: ["pending", "paid"], default: "pending", index: true },

    // There is one document per email — a renewal updates this same document
    // in place (new validTill, latest stripeSessionId) rather than inserting
    // a new row. stripeSessionId therefore only ever reflects the latest
    // checkout; every session id that has actually been fulfilled is kept
    // here too, so revisiting an old success-page link is recognized as
    // already-processed instead of quietly re-running fulfillment again.
    stripeSessionId: { type: String, required: true, unique: true },
    stripePaymentIntentId: { type: String, default: null },
    fulfilledSessionIds: { type: [String], default: [] },
  },
  { timestamps: { createdAt: true, updatedAt: true } },
);

export type MembershipDoc = InferSchemaType<typeof MembershipSchema>;

export const Membership =
  mongoose.models.Membership || mongoose.model("Membership", MembershipSchema);
