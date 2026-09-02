import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  const rows = await db.select().from(customers).orderBy(desc(customers.createdAt));
  return NextResponse.json({ data: rows, meta: { count: rows.length, demo: false } });
}
