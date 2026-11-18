import { asc, desc, eq, and } from "drizzle-orm";
import { db } from "@/db";
import {
  campaigns,
  donations,
  leadershipMembers,
  stewardshipReports,
} from "@/db/schema";
import type {
  CampaignCategory,
  CampaignDTO,
  DonorWallEntry,
  LeadershipDTO,
  NamingTier,
  StewardshipReportDTO,
} from "@/types/database";
import { FALLBACK_CAMPAIGNS, FALLBACK_LEADERSHIP, FALLBACK_REPORTS, FALLBACK_WALL } from "./fallback";

function toCampaignDTO(row: typeof campaigns.$inferSelect): CampaignDTO {
  let tiers: NamingTier[] = [];
  try {
    const raw = row.namingTiers as unknown;
    if (Array.isArray(raw)) tiers = raw as NamingTier[];
  } catch {
    tiers = [];
  }
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    category: row.category as CampaignDTO["category"],
    shortDescription: row.shortDescription,
    description: row.description,
    imageUrl: row.imageUrl,
    targetAmountNgn: Number(row.targetAmountNgn ?? 0),
    amountRaisedNgn: Number(row.amountRaisedNgn ?? 0),
    donorCount: row.donorCount ?? 0,
    isActive: row.isActive ?? true,
    isFeatured: row.isFeatured ?? false,
    namingTiers: tiers,
    createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
    updatedAt: row.updatedAt?.toISOString() ?? new Date().toISOString(),
  };
}

export async function getCampaigns(category?: CampaignCategory | "ALL"): Promise<CampaignDTO[]> {
  try {
    const rows =
      !category || category === "ALL"
        ? await db.select().from(campaigns).orderBy(desc(campaigns.isFeatured), asc(campaigns.title))
        : await db
            .select()
            .from(campaigns)
            .where(and(eq(campaigns.isActive, true), eq(campaigns.category, category)))
            .orderBy(desc(campaigns.isFeatured), asc(campaigns.title));
    if (!rows.length) return FALLBACK_CAMPAIGNS.filter((c) => !category || category === "ALL" || c.category === category);
    return rows.map(toCampaignDTO);
  } catch {
    return FALLBACK_CAMPAIGNS.filter((c) => !category || category === "ALL" || c.category === category);
  }
}

export async function getFeaturedCampaigns(limit = 3): Promise<CampaignDTO[]> {
  const all = await getCampaigns("ALL");
  return all.filter((c) => c.isFeatured).slice(0, limit);
}

export async function getCampaignBySlug(slug: string): Promise<CampaignDTO | null> {
  try {
    const rows = await db.select().from(campaigns).where(eq(campaigns.slug, slug)).limit(1);
    if (rows[0]) return toCampaignDTO(rows[0]);
  } catch {
    // fall through
  }
  return FALLBACK_CAMPAIGNS.find((c) => c.slug === slug) ?? null;
}

export async function getLeadership(): Promise<LeadershipDTO[]> {
  try {
    const rows = await db
      .select()
      .from(leadershipMembers)
      .where(eq(leadershipMembers.isActive, true))
      .orderBy(asc(leadershipMembers.displayOrder));
    if (!rows.length) return FALLBACK_LEADERSHIP;
    return rows.map((r) => ({
      id: r.id,
      fullName: r.fullName,
      role: r.role,
      category: (r.category === "DIRECTORATE" ? "DIRECTORATE" : "TRUSTEE") as LeadershipDTO["category"],
      bio: r.bio,
      tenure: r.tenure,
      imageUrl: r.imageUrl,
      displayOrder: r.displayOrder ?? 0,
    }));
  } catch {
    return FALLBACK_LEADERSHIP;
  }
}

export async function getReports(): Promise<StewardshipReportDTO[]> {
  try {
    const rows = await db
      .select()
      .from(stewardshipReports)
      .orderBy(desc(stewardshipReports.createdAt));
    if (!rows.length) return FALLBACK_REPORTS;
    return rows.map((r) => ({
      id: r.id,
      title: r.title,
      fiscalYear: r.fiscalYear,
      reportType: r.reportType as StewardshipReportDTO["reportType"],
      fileUrl: r.fileUrl,
      fileSize: r.fileSize,
      summary: r.summary,
      createdAt: r.createdAt?.toISOString() ?? new Date().toISOString(),
    }));
  } catch {
    return FALLBACK_REPORTS;
  }
}

export async function getDonorWall(limit = 30): Promise<DonorWallEntry[]> {
  try {
    const rows = await db
      .select({
        id: donations.id,
        donorName: donations.donorName,
        organization: donations.organization,
        amountNgnEquivalent: donations.amountNgnEquivalent,
        currency: donations.currency,
        campaignTitle: campaigns.title,
        createdAt: donations.createdAt,
      })
      .from(donations)
      .leftJoin(campaigns, eq(donations.campaignId, campaigns.id))
      .where(and(eq(donations.paymentStatus, "VERIFIED"), eq(donations.displayOnDonorWall, true)))
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .orderBy(desc(donations.verifiedAt as any))
      .limit(limit);
    if (!rows.length) return FALLBACK_WALL;
    return rows.map((r) => ({
      id: r.id,
      donorName: r.donorName,
      organization: r.organization,
      amountNgnEquivalent: Number(r.amountNgnEquivalent ?? 0),
      currency: (r.currency ?? "NGN") as DonorWallEntry["currency"],
      campaignTitle: r.campaignTitle,
      createdAt: r.createdAt?.toISOString() ?? new Date().toISOString(),
    }));
  } catch {
    return FALLBACK_WALL;
  }
}

export async function getStats(): Promise<{
  totalRaisedNgn: number;
  totalDonors: number;
  activeCampaigns: number;
}> {
  try {
    const all = await getCampaigns("ALL");
    return {
      totalRaisedNgn: all.reduce((s, c) => s + c.targetAmountNgn * 0 + c.amountRaisedNgn, 0),
      totalDonors: all.reduce((s, c) => s + c.donorCount, 0),
      activeCampaigns: all.filter((c) => c.isActive).length,
    };
  } catch {
    return { totalRaisedNgn: 2321500000, totalDonors: 1684, activeCampaigns: 4 };
  }
}
