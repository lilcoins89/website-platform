import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(campaigns).orderBy(desc(campaigns.updatedAt));
  const data = rows.map((row) => ({ campaignId: row.id, source: row.source, name: row.name, conversions: row.conversions, value: Number(row.revenue) }));
  return NextResponse.json({ data, meta: { count: data.length, live: true } });
}
