import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(campaigns);
  const grouped = new Map<string, { source: string; spend: number; revenue: number; conversions: number; impressions: number; clicks: number }>();
  for (const row of rows) {
    const current = grouped.get(row.source) ?? { source: row.source, spend: 0, revenue: 0, conversions: 0, impressions: 0, clicks: 0 };
    current.spend += Number(row.spend); current.revenue += Number(row.revenue); current.conversions += row.conversions; current.impressions += row.impressions; current.clicks += row.clicks;
    grouped.set(row.source, current);
  }
  const data = Array.from(grouped.values()).map((row) => ({ ...row, roas: row.spend ? row.revenue / row.spend : 0, ctr: row.impressions ? row.clicks / row.impressions : 0 }));
  return NextResponse.json({ data, meta: { count: data.length, live: true } });
}
