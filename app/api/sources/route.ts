import { NextResponse } from "next/server";
import { desc } from "drizzle-orm";
import { db } from "@/lib/db";
import { sources } from "@/lib/db/schema";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await db.select().from(sources).orderBy(desc(sources.createdAt)));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to load sources" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (typeof body.provider !== "string" || typeof body.name !== "string") return NextResponse.json({ error: "Provider and name are required" }, { status: 400 });
    const [source] = await db.insert(sources).values({ id: crypto.randomUUID(), organizationId: "default", provider: body.provider, name: body.name, status: "pending", recordsImported: 0, createdAt: new Date() }).returning();
    return NextResponse.json(source, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to create source" }, { status: 500 });
  }
}
