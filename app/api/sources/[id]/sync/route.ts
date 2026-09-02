import { NextResponse } from "next/server";
import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sources, syncJobs } from "@/lib/db/schema";

export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const [source] = await db.select().from(sources).where(eq(sources.id, id)).limit(1);
    if (!source) return NextResponse.json({ error: "Source not found" }, { status: 404 });
    const now = new Date();
    await db.update(sources).set({ status: "syncing", lastSyncAt: now }).where(eq(sources.id, id));
    const [job] = await db.insert(syncJobs).values({ id: crypto.randomUUID(), kind: source.provider, status: "queued", message: `Sync queued for ${source.name}`, recordsSynced: 0, createdAt: now }).returning();
    return NextResponse.json(job, { status: 202 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to sync source" }, { status: 500 });
  }
}
