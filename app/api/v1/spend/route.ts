import { NextResponse } from "next/server";
import { dailyMetrics, kpi } from "@/lib/demo/data";

export async function GET() {
  return NextResponse.json({
    data: {
      total: kpi.adSpend,
      series: dailyMetrics.map((d) => ({
        date: d.date,
        spend: d.spend,
        meta: d.metaSpend,
        tiktok: d.tiktokSpend,
      })),
    },
    meta: { demo: true },
  });
}
