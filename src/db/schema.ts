import {
  pgTable,
  uuid,
  text,
  bigint,
  integer,
  boolean,
  numeric,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

// NOTE: bigint columns are modelled as `bigint({mode:"number"})` for ergonomics.
// Amounts in NGN are whole naira (no kobo fractions at campaign level).

export const campaigns = pgTable("campaigns", {
  id: uuid("id").defaultRandom().primaryKey(),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  category: text("category").notNull(), // ENDOWMENT | SCHOLARSHIP | INFRASTRUCTURE | RESEARCH | ALUMNI_CLASS
  shortDescription: text("short_description").notNull().default(""),
  description: text("description").notNull().default(""),
  imageUrl: text("image_url"),
  targetAmountNgn: bigint("target_amount_ngn", { mode: "number" }).notNull().default(0),
  amountRaisedNgn: bigint("amount_raised_ngn", { mode: "number" }).notNull().default(0),
  donorCount: integer("donor_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  namingTiers: jsonb("naming_tiers").notNull().default([]),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow(),
});

export const donations = pgTable("donations", {
  id: uuid("id").defaultRandom().primaryKey(),
  campaignId: uuid("campaign_id").references(() => campaigns.id, { onDelete: "set null" }),
  donorName: text("donor_name").notNull(),
  donorEmail: text("donor_email").notNull(),
  organization: text("organization"),
  amount: numeric("amount", { precision: 14, scale: 2 }).notNull(),
  currency: text("currency").notNull().default("NGN"),
  amountNgnEquivalent: bigint("amount_ngn_equivalent", { mode: "number" }).notNull().default(0),
  isAlumni: boolean("is_alumni").notNull().default(false),
  graduationYear: integer("graduation_year"),
  displayOnDonorWall: boolean("display_on_donor_wall").notNull().default(false),
  paymentStatus: text("payment_status").notNull().default("PENDING"), // PENDING | VERIFIED | FAILED
  paymentGateway: text("payment_gateway").notNull().default("PAYSTACK"), // PAYSTACK | STRIPE | BANK_WIRE
  gatewayReference: text("gateway_reference").unique(),
  pledgeReference: text("pledge_reference").unique(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  verifiedAt: timestamp("verified_at", { withTimezone: true }),
});

export const leadershipMembers = pgTable("leadership_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  credentials: text("credentials"),
  role: text("role").notNull(),
  category: text("category").notNull().default("TRUSTEE"), // TRUSTEE | DIRECTORATE | HERITAGE
  group: text("group").notNull().default("BOARD_OF_TRUSTEES"), // BOARD_OF_TRUSTEES | DIRECTORATE | PAST_DIRECTORS
  bio: text("bio").notNull().default(""),
  tenure: text("tenure"),
  imageUrl: text("image_url"),
  displayOrder: integer("display_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const stewardshipReports = pgTable("stewardship_reports", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: text("title").notNull(),
  fiscalYear: text("fiscal_year").notNull(),
  reportType: text("report_type").notNull(),
  fileUrl: text("file_url").notNull(),
  fileSize: text("file_size"),
  summary: text("summary").default(""),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const alumniSubmissions = pgTable("alumni_submissions", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  graduationYear: integer("graduation_year").notNull(),
  department: text("department").notNull(),
  faculty: text("faculty"),
  city: text("city"),
  country: text("country"),
  industry: text("industry"),
  chapterInterest: text("chapter_interest"),
  phone: text("phone"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: uuid("id").defaultRandom().primaryKey(),
  fullName: text("full_name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  organization: text("organization"),
  category: text("category").notNull().default("GENERAL"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("NEW"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export type Campaign = typeof campaigns.$inferSelect;
export type NewCampaign = typeof campaigns.$inferInsert;
export type Donation = typeof donations.$inferSelect;
export type LeadershipMember = typeof leadershipMembers.$inferSelect;
export type StewardshipReport = typeof stewardshipReports.$inferSelect;
export type AlumniSubmission = typeof alumniSubmissions.$inferSelect;
export type Inquiry = typeof inquiries.$inferSelect;
