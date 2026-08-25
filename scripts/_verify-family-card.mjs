import { fulfillMembership } from "../lib/services/membership-service.ts";

const sessionId = "cs_test_a1DVin3DHAfXQtqLz9NasyIvieuSOQGEC4NKSpohdT5QvTcwGLmzkUMZaH";

const fakeSession = {
  id: sessionId,
  payment_status: "paid",
  amount_total: 1000,
  currency: "aud",
  payment_intent: "pi_test_cardfix",
  metadata: {
    kind: "membership",
    fullName: "Card Fix Test",
    telephone: "0412345678",
    email: "cardfixtest@example.com",
    occupation: "",
    planTier: "family",
    familyMember1Name: "Priya Sharma",
    familyMember1Relation: "Spouse",
    familyMember2Name: "",
    familyMember2Relation: "",
    familyMember3Name: "",
    familyMember3Relation: "",
    address: "1 Test St, Sydney NSW 2000",
    specialInterests: "",
    signOffDate: "2026-08-21",
  },
  customer_details: { email: "cardfixtest@example.com" },
};

try {
  const result = await fulfillMembership(fakeSession, "http://localhost:3000/logo.png");
  console.log("FULFILL OK (card rendered without error):", result);
  process.exit(0);
} catch (err) {
  console.error("FULFILL FAILED:", err.message);
  process.exit(1);
}
