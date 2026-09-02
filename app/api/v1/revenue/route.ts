import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { dailyMetrics } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(dailyMetrics).orderBy(desc(dailyMetrics.metricDate));
  return NextResponse.json({ data: { total: rows.reduce((sum, row) => sum + Number(row.revenue), 0), series: rows.map((row) => ({ date: row.metricDate, revenue: Number(row.revenue) })) }, meta: { live: true } });
}
