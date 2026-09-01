import { NextResponse } from "next/server";
import { kpi } from "@/lib/demo/data";

export async function GET() {
  return NextResponse.json({ data: kpi, meta: { demo: true } });
}
