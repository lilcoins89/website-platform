import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { campaigns } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(campaigns).orderBy(desc(campaigns.updatedAt));
  return NextResponse.json({ data: rows, meta: { count: rows.length, demo: false } });
}
