import { NextRequest, NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { campaignCreators, campaigns, creators } from "@/lib/db/schema";
import { getCreatorProfile, ScrapeCreatorsError } from "@/lib/scrapecreators/client";

export const dynamic = "force-dynamic";

function id(prefix: string) {
  return `${prefix}_${crypto.randomUUID()}`;
}

function numberValue(value: unknown, fallback = 0) {
  const n = Number(value);
  return Number.isFinite(n) ? n : fallback;
}

function normalizeProfile(platform: string, handle: string, raw: Record<string, unknown>) {
  const profile = (raw.profile ?? raw.data ?? raw) as Record<string, unknown>;
  const followers = numberValue(profile.followers ?? profile.followerCount ?? profile.fans);
  const likes = numberValue(profile.likes ?? profile.heartCount ?? profile.totalLikes);
  const posts = numberValue(profile.posts ?? profile.videoCount ?? profile.postCount, 1);
  const engagementRate = followers > 0 ? ((likes / Math.max(posts, 1)) / followers) * 100 : 0;
  return {
    handle: String(profile.handle ?? profile.username ?? profile.uniqueId ?? handle),
    platform,
    displayName: String(profile.displayName ?? profile.nickname ?? profile.name ?? handle),
    bio: profile.bio == null ? null : String(profile.bio),
    followers: Math.round(followers),
    engagementRate: engagementRate.toFixed(4),
    profileUrl: profile.profileUrl == null ? null : String(profile.profileUrl),
    rawData: JSON.stringify(raw),
    enrichedAt: new Date(),
  };
}

export async function GET(req: NextRequest) {
  const campaignId = req.nextUrl.searchParams.get("campaignId");
  const rows = campaignId
    ? await db.select({ link: campaignCreators, creator: creators }).from(campaignCreators).innerJoin(creators, eq(campaignCreators.creatorId, creators.id)).where(eq(campaignCreators.campaignId, campaignId))
    : await db.select({ link: campaignCreators, creator: creators }).from(campaignCreators).innerJoin(creators, eq(campaignCreators.creatorId, creators.id));
  return NextResponse.json({ data: rows });
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as { campaignId?: string; platform?: string; handle?: string; relationship?: string; attributedRevenue?: number; attributedConversions?: number };
    if (!body.campaignId || !body.platform || !body.handle) return NextResponse.json({ error: "campaignId, platform, and handle are required" }, { status: 400 });
    const [campaign] = await db.select({ id: campaigns.id }).from(campaigns).where(eq(campaigns.id, body.campaignId));
    if (!campaign) return NextResponse.json({ error: "Campaign not found" }, { status: 404 });
    const raw = await getCreatorProfile(body.platform as "tiktok" | "instagram" | "youtube" | "facebook", body.handle);
    const profile = normalizeProfile(body.platform, body.handle, raw);
    const [existing] = await db.select().from(creators).where(and(eq(creators.handle, profile.handle), eq(creators.platform, profile.platform)));
    const creator = existing ? (await db.update(creators).set(profile).where(eq(creators.id, existing.id)).returning())[0] : (await db.insert(creators).values({ id: id("creator"), ...profile }).returning())[0];
    const [link] = await db.insert(campaignCreators).values({ id: id("cc"), campaignId: body.campaignId, creatorId: creator.id, relationship: body.relationship ?? "organic", attributedRevenue: String(body.attributedRevenue ?? 0), attributedConversions: body.attributedConversions ?? 0, createdAt: new Date(), updatedAt: new Date() }).onConflictDoUpdate({ target: [campaignCreators.campaignId, campaignCreators.creatorId], set: { relationship: body.relationship ?? "organic", attributedRevenue: String(body.attributedRevenue ?? 0), attributedConversions: body.attributedConversions ?? 0, updatedAt: new Date() } }).returning();
    return NextResponse.json({ data: { link, creator }, meta: { provider: "scrapecreators", live: true } }, { status: 201 });
  } catch (error) {
    if (error instanceof ScrapeCreatorsError) return NextResponse.json({ error: error.message, status: error.status }, { status: error.status });
    console.error("[v0] campaign creator attach failed", error);
    return NextResponse.json({ error: "Unable to attach creator" }, { status: 500 });
  }
}
