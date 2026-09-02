import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { campaigns, dailyMetrics } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const [campaignRows, metricRows] = await Promise.all([
    db.select().from(campaigns).orderBy(desc(campaigns.updatedAt)),
    db.select().from(dailyMetrics).orderBy(dailyMetrics.metricDate),
  ]);
  const spend = campaignRows.reduce((sum, row) => sum + Number(row.spend), 0);
  const revenue = campaignRows.reduce((sum, row) => sum + Number(row.revenue), 0);
  const conversions = campaignRows.reduce((sum, row) => sum + row.conversions, 0);
  const clicks = campaignRows.reduce((sum, row) => sum + row.clicks, 0);
  const impressions = campaignRows.reduce((sum, row) => sum + row.impressions, 0);
  const orders = metricRows.reduce((sum, row) => sum + row.orders, 0);

  return NextResponse.json({
    data: {
      kpi: {
        spend,
        revenue,
        roas: spend ? revenue / spend : 0,
        conversions,
        orders,
        ctr: impressions ? clicks / impressions : 0,
        cvr: clicks ? conversions / clicks : 0,
        cpc: clicks ? spend / clicks : 0,
        cpa: conversions ? spend / conversions : 0,
      },
      campaigns: campaignRows,
      series: metricRows,
    },
    meta: { demo: false },
  });
}
