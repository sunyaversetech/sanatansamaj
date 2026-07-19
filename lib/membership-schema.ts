import { z } from "zod";

export const membershipApplicationSchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    telephone: z.string().min(6, "A valid telephone number is required"),
    email: z.string().email("Please enter a valid email address"),
    planTier: z.enum(["single", "family", "life"]),
    spouseName: z.string().optional(),
    spouseTelephone: z.string().optional(),
    spouseEmail: z.string().optional(),
    familyMember1: z.string().optional(),
    familyMember2: z.string().optional(),
    familyMember3: z.string().optional(),
    address: z.string().min(5, "Residential address is required"),
    specialInterests: z.string().optional(),
    signOffDate: z.string().min(1, "Please provide the sign-off date"),
  })
  .superRefine((data, ctx) => {
    if (data.planTier === "family" && !data.spouseName) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Spouse name is required for a family membership",
        path: ["spouseName"],
      });
    }
  });

export type MembershipApplication = z.infer<typeof membershipApplicationSchema>;
