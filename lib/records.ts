import { getDb } from "@/lib/mongodb";
import type { MembershipApplication } from "@/lib/membership-schema";
import type { Donation } from "@/lib/donation-schema";

export type MembershipRecord = MembershipApplication & {
  amountPaid: number;
  currency: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  createdAt: Date;
};

export type DonationRecord = Donation & {
  currency: string;
  stripeSessionId: string;
  stripePaymentIntentId: string | null;
  createdAt: Date;
};

export async function saveMembershipApplication(record: MembershipRecord) {
  const db = await getDb();
  await db.collection<MembershipRecord>("membership_applications").insertOne(record);
}

export async function saveDonation(record: DonationRecord) {
  const db = await getDb();
  await db.collection<DonationRecord>("donations").insertOne(record);
}
