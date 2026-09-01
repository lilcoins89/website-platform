import { NextResponse } from "next/server";
import { campaigns } from "@/lib/demo/data";

export async function GET() {
  const data = campaigns.map((c) => ({
    campaignId: c.id,
    source: c.source,
    name: c.name,
    conversions: c.conversions,
    value: c.revenue,
  }));
  return NextResponse.json({ data, meta: { count: data.length, demo: true } });
}
