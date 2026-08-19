import { z } from "zod";

export const membershipApplicationSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    telephone: z.string().min(6, "A valid telephone number is required"),
    email: z.string().email("Please enter a valid email address"),
    occupation: z.string().optional(),
    planTier: z.enum(["single", "family", "life"]),
    familyMember1Name: z.string().optional(),
    familyMember1Relation: z.string().optional(),
    familyMember2Name: z.string().optional(),
    familyMember2Relation: z.string().optional(),
    familyMember3Name: z.string().optional(),
    familyMember3Relation: z.string().optional(),
    address: z.string().min(5, "Residential address is required"),
    specialInterests: z.string().optional(),
    signOffDate: z.string().min(1, "Please provide the sign-off date"),
  })
  .superRefine((data, ctx) => {
    if (data.planTier === "family") {
      if (!data.familyMember1Name) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one family member's name is required",
          path: ["familyMember1Name"],
        });
      }
      if (!data.familyMember1Relation) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "At least one family member's relationship is required",
          path: ["familyMember1Relation"],
        });
      }
    }
  });

export type MembershipApplication = z.infer<typeof membershipApplicationSchema>;
