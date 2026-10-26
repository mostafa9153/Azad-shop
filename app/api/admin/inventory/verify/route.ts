import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const report = await db.verifyStockIntegrity();
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function POST() {
  try {
    const report = await db.verifyStockIntegrity();
    return NextResponse.json({ success: true, report });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
