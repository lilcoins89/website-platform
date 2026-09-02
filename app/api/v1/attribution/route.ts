import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(campaigns).orderBy(desc(campaigns.updatedAt));
  const data = rows.map((row) => ({ campaignId: row.id, campaign: row.name, source: row.source, spend: Number(row.spend), revenue: Number(row.revenue), conversions: row.conversions, roas: Number(row.roas) }));
  return NextResponse.json({ data, meta: { count: data.length, live: true } });
}
