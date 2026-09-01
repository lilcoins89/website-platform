import { NextResponse } from "next/server";
import { orders } from "@/lib/demo/data";

export async function GET() {
  return NextResponse.json({
    data: orders,
    meta: { count: orders.length, demo: true },
  });
}
