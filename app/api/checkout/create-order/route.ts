import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      customer_name,
      customer_email,
      customer_phone,
      shipping_address,
      items,
      payment_method,
      payment_status,
      shipping_fee_paise,
      cod_fee_paise,
      coupon_code,
      notes,
    } = body;

    if (!customer_name || !customer_phone || !shipping_address || !items || items.length === 0) {
      return NextResponse.json(
        { error: "Missing required order information" },
        { status: 400 }
      );
    }

    const order = await db.createOrder({
      customer_name,
      customer_email: customer_email || "",
      customer_phone,
      shipping_address,
      items,
      payment_method: payment_method || "demo_upi",
      payment_status: payment_status || "paid",
      shipping_fee_paise: shipping_fee_paise || 0,
      cod_fee_paise: cod_fee_paise || 0,
      coupon_code,
      notes,
    });

    return NextResponse.json({ success: true, order });
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json({ error: err.message || "Failed to create order" }, { status: 500 });
  }
}
