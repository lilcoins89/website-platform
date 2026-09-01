import { NextResponse } from "next/server";
import { campaigns } from "@/lib/demo/data";

export async function GET() {
  return NextResponse.json({
    data: campaigns,
    meta: { count: campaigns.length, demo: true },
  });
}
