export type Currency = "NGN" | "USD" | "GBP" | "EUR";
export type CampaignCategory =
  | "ENDOWMENT"
  | "SCHOLARSHIP"
  | "INFRASTRUCTURE"
  | "RESEARCH"
  | "ALUMNI_CLASS";
export type PaymentStatus = "PENDING" | "VERIFIED" | "FAILED";
export type PaymentGateway = "PAYSTACK" | "STRIPE" | "BANK_WIRE";
export type ReportType =
  | "ANNUAL_IMPACT"
  | "AUDITED_FINANCIAL"
  | "QUARTERLY"
  | "ENDOWMENT_STATEMENT";
export type InquiryCategory =
  | "MAJOR_GIFT"
  | "CORPORATE_CSR"
  | "SCHOLARSHIP"
  | "ALUMNI_CHAPTER"
  | "GENERAL";

export interface NamingTier {
  tier: string;
  min_ngn: number;
  benefit: string;
}

export interface CampaignDTO {
  id: string;
  slug: string;
  title: string;
  category: CampaignCategory;
  shortDescription: string;
  description: string;
  imageUrl: string | null;
  targetAmountNgn: number;
  amountRaisedNgn: number;
  donorCount: number;
  isActive: boolean;
  isFeatured: boolean;
  namingTiers: NamingTier[];
  createdAt: string;
  updatedAt: string;
}

export interface DonorWallEntry {
  id: string;
  donorName: string;
  organization: string | null;
  amountNgnEquivalent: number;
  currency: Currency;
  campaignTitle: string | null;
  createdAt: string;
}

export interface LeadershipDTO {
  id: string;
  fullName: string;
  role: string;
  category: "TRUSTEE" | "DIRECTORATE";
  bio: string;
  tenure: string | null;
  imageUrl: string | null;
  displayOrder: number;
}

export interface StewardshipReportDTO {
  id: string;
  title: string;
  fiscalYear: string;
  reportType: ReportType;
  fileUrl: string;
  fileSize: string | null;
  summary: string | null;
  createdAt: string;
}

// Supabase-shaped rows (for supabase/migrations parity + admin tooling)
export interface Database {
  campaigns: CampaignDTO;
  donations: {
    id: string;
    campaign_id: string | null;
    donor_name: string;
    donor_email: string;
    organization: string | null;
    amount: string;
    currency: Currency;
    amount_ngn_equivalent: number;
    is_alumni: boolean;
    graduation_year: number | null;
    display_on_donor_wall: boolean;
    payment_status: PaymentStatus;
    payment_gateway: PaymentGateway;
    gateway_reference: string | null;
    pledge_reference: string | null;
    created_at: string;
    verified_at: string | null;
  };
}
