import { NextResponse } from "next/server";
import { attributions } from "@/lib/demo/data";

export async function GET() {
  return NextResponse.json({
    data: attributions,
    meta: { count: attributions.length, demo: true },
  });
}
