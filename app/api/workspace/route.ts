import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { campaigns, creators, syncJobs } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [campaignRows, creatorRows, jobRows] = await Promise.all([
      db.select().from(campaigns).where(eq(campaigns.organizationId, "default")).orderBy(desc(campaigns.updatedAt)),
      db.select().from(creators).orderBy(desc(creators.followers)).limit(12),
      db.select().from(syncJobs).orderBy(desc(syncJobs.createdAt)).limit(8),
    ]);
    const spend = campaignRows.reduce((sum, row) => sum + Number(row.spend), 0);
    const revenue = campaignRows.reduce((sum, row) => sum + Number(row.revenue), 0);
    const conversions = campaignRows.reduce((sum, row) => sum + row.conversions, 0);
    return NextResponse.json({ campaigns: campaignRows, creators: creatorRows, jobs: jobRows, kpi: { spend, revenue, conversions, roas: spend ? revenue / spend : 0 } });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load workspace" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.type === "campaign") {
      const [row] = await db.insert(campaigns).values({ id: crypto.randomUUID(), organizationId: "default", name: String(body.name), source: String(body.source ?? "organic"), status: "active", spend: "0", revenue: "0", roas: "0", cpa: "0", impressions: 0, clicks: 0, conversions: 0, currency: "USD", updatedAt: new Date(), createdAt: new Date() }).returning();
      return NextResponse.json(row, { status: 201 });
    }
    if (body.type === "sync") {
      const [row] = await db.insert(syncJobs).values({ id: crypto.randomUUID(), kind: String(body.kind ?? "workspace"), status: "queued", message: "Sync queued from workspace", recordsSynced: 0, createdAt: new Date() }).returning();
      return NextResponse.json(row, { status: 201 });
    }
    return NextResponse.json({ error: "Unsupported workspace action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to update workspace" }, { status: 500 });
  }
}
