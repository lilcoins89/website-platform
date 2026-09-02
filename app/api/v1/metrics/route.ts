import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { campaigns, dailyMetrics } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const [metricRows, campaignRows] = await Promise.all([
    db.select().from(dailyMetrics),
    db.select().from(campaigns),
  ]);
  const totals = campaignRows.reduce((sum, row) => ({
    adSpend: sum.adSpend + Number(row.spend),
    revenue: sum.revenue + Number(row.revenue),
    conversions: sum.conversions + row.conversions,
    impressions: sum.impressions + row.impressions,
    clicks: sum.clicks + row.clicks,
  }), { adSpend: 0, revenue: 0, conversions: 0, impressions: 0, clicks: 0 });
  const revenue = metricRows.length ? metricRows.reduce((sum, row) => sum + Number(row.revenue), 0) : totals.revenue;
  const adSpend = metricRows.length ? metricRows.reduce((sum, row) => sum + Number(row.spend), 0) : totals.adSpend;
  return NextResponse.json({ data: { ...totals, adSpend, revenue, roas: adSpend ? revenue / adSpend : 0, cpa: totals.conversions ? adSpend / totals.conversions : 0 }, meta: { live: true } });
}
