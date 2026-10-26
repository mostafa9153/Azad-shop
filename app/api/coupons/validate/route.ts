import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { code, itemsTotalPaise } = await request.json();

    if (!code) {
      return NextResponse.json({ valid: false, message: "Please provide a coupon code" }, { status: 400 });
    }

    const result = await db.validateCoupon(code, itemsTotalPaise || 0);

    return NextResponse.json(result);
  } catch (err: any) {
    return NextResponse.json({ valid: false, message: err.message }, { status: 500 });
  }
}
