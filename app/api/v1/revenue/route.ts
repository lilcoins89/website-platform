import { NextResponse } from "next/server";
import { dailyMetrics, kpi } from "@/lib/demo/data";

export async function GET() {
  return NextResponse.json({
    data: {
      total: kpi.revenue,
      series: dailyMetrics.map((d) => ({ date: d.date, revenue: d.revenue })),
    },
    meta: { demo: true },
  });
}
