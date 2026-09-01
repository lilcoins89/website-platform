import { NextResponse } from "next/server";
import { customers } from "@/lib/demo/data";

export async function GET() {
  return NextResponse.json({
    data: customers,
    meta: { count: customers.length, demo: true },
  });
}
