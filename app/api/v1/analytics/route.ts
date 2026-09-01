import { NextResponse } from "next/server";
import { kpi, channelSummaries, dailyMetrics } from "@/lib/demo/data";

export async function GET() {
  return NextResponse.json({
    data: { kpi, channels: channelSummaries, series: dailyMetrics },
    meta: { demo: true },
  });
}
