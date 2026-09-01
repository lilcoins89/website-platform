import { NextResponse } from "next/server";
import { channelSummaries } from "@/lib/demo/data";

export async function GET() {
  return NextResponse.json({ data: channelSummaries, meta: { demo: true } });
}
