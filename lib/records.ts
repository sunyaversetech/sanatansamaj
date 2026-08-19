import { getDb } from "@/lib/mongodb";
import { membershipPlans } from "@/lib/site-data";
import type { MembershipApplication } from "@/lib/membership-schema";
import type { Donation } from "@/lib/donation-schema";

export type MembershipRecord = MembershipApplication & {
  membershipId: string;
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

type CounterDoc = { _id: string; seq: number };

// Atomically reserves the next sequential number for a plan's ID prefix
// (e.g. AMS, AMF, LF) and formats it as "PREFIX-00001".
export async function getNextMembershipId(
  planTier: MembershipApplication["planTier"],
): Promise<string> {
  const plan = membershipPlans.find((p) => p.key === planTier);
  const prefix = plan?.idPrefix ?? "MEM";

  const db = await getDb();
  const doc = await db.collection<CounterDoc>("counters").findOneAndUpdate(
    { _id: prefix },
    { $inc: { seq: 1 } },
    { upsert: true, returnDocument: "after" },
  );

  const seq = doc?.seq ?? 1;
  return `${prefix}-${String(seq).padStart(5, "0")}`;
}

export async function saveMembershipApplication(record: MembershipRecord) {
  const db = await getDb();
  await db.collection<MembershipRecord>("membership_applications").insertOne(record);
}

// Used for webhook idempotency (skip re-processing a retried delivery) and
// by the success page to look up the ID assigned to a just-completed payment.
export async function getMembershipBySessionId(stripeSessionId: string) {
  const db = await getDb();
  return db
    .collection<MembershipRecord>("membership_applications")
    .findOne({ stripeSessionId });
}

export async function saveDonation(record: DonationRecord) {
  const db = await getDb();
  await db.collection<DonationRecord>("donations").insertOne(record);
}
