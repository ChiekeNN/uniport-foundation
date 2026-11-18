import { z } from "zod";

export const currencySchema = z.enum(["NGN", "USD", "GBP", "EUR"]);
export const categorySchema = z.enum([
  "ENDOWMENT",
  "SCHOLARSHIP",
  "INFRASTRUCTURE",
  "RESEARCH",
  "ALUMNI_CLASS",
]);

export const donationInitSchema = z.object({
  campaignSlug: z.string().min(1).max(160).nullable().optional(),
  amount: z.number().positive().max(1_000_000_000),
  currency: currencySchema,
  donorName: z.string().min(2).max(120),
  donorEmail: z.string().email().max(160),
  organization: z.string().max(160).optional().default(""),
  isAlumni: z.boolean().default(false),
  graduationYear: z.number().int().min(1975).max(2030).nullable().optional(),
  displayOnDonorWall: z.boolean().default(false),
  gateway: z.enum(["PAYSTACK", "STRIPE", "BANK_WIRE"]),
});

export const alumniSchema = z.object({
  fullName: z.string().min(2).max(140),
  email: z.string().email().max(160),
  graduationYear: z.number().int().min(1975).max(2030),
  department: z.string().min(2).max(140),
  faculty: z.string().max(140).optional().default(""),
  city: z.string().max(100).optional().default(""),
  country: z.string().max(100).optional().default(""),
  industry: z.string().max(120).optional().default(""),
  chapterInterest: z.string().max(120).optional().default(""),
  phone: z.string().max(40).optional().default(""),
});

export const inquirySchema = z.object({
  fullName: z.string().min(2).max(140),
  email: z.string().email().max(160),
  phone: z.string().max(40).optional().default(""),
  organization: z.string().max(160).optional().default(""),
  category: z.enum([
    "MAJOR_GIFT",
    "CORPORATE_CSR",
    "SCHOLARSHIP",
    "ALUMNI_CHAPTER",
    "GENERAL",
  ]),
  subject: z.string().max(180).optional().default(""),
  message: z.string().min(10).max(4000),
});

export const campaignUpsertSchema = z.object({
  slug: z
    .string()
    .min(3)
    .max(140)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(4).max(180),
  category: categorySchema,
  shortDescription: z.string().min(10).max(300),
  description: z.string().min(20).max(8000),
  targetAmountNgn: z.number().int().positive().max(100_000_000_000),
  isActive: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const adminLoginSchema = z.object({
  password: z.string().min(4).max(200),
});

export type DonationInitInput = z.infer<typeof donationInitSchema>;
export type AlumniInput = z.infer<typeof alumniSchema>;
export type InquiryInput = z.infer<typeof inquirySchema>;
