import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { getCreatorProfile } from "@/lib/scrapecreators/client";
import { db } from "@/lib/db";
import { creators } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const { platform, handle } = await request.json();
    if (typeof platform !== "string" || typeof handle !== "string" || !platform.trim() || !handle.trim()) {
      return NextResponse.json({ error: "Platform and handle are required" }, { status: 400 });
    }
    const profileData = (await getCreatorProfile(
      platform.trim() as Parameters<typeof getCreatorProfile>[0],
      handle.trim(),
    )) as Record<string, unknown>;
    const values = {
      id: crypto.randomUUID(),
      handle: handle.trim(),
      platform: platform.trim(),
      displayName: String(profileData.displayName ?? profileData.username ?? handle.trim()),
      bio: profileData.bio ? String(profileData.bio) : null,
      followers: Number(profileData.followers ?? profileData.followerCount ?? 0),
      engagementRate: String(Number(profileData.engagementRate ?? 0)),
      profileUrl: profileData.url ? String(profileData.url) : null,
      rawData: JSON.stringify(profileData),
      enrichedAt: new Date(),
    };
    const existing = await db.select({ id: creators.id }).from(creators).where(and(eq(creators.platform, values.platform), eq(creators.handle, values.handle))).limit(1);
    const [row] = existing.length
      ? await db.update(creators).set(values).where(eq(creators.id, existing[0].id)).returning()
      : await db.insert(creators).values(values).returning();
    return NextResponse.json(row);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Creator enrichment failed" }, { status: 502 });
  }
}
