import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const phone = searchParams.get("phone") || "";

  if (!phone) {
    return NextResponse.json({ orders: [] });
  }

  const allOrders = await db.getOrders();
  const cleanPhone = phone.replace(/[^0-9]/g, "");
  const userOrders = allOrders.filter((o) => {
    const p = o.customer_phone.replace(/[^0-9]/g, "");
    return p.endsWith(cleanPhone) || cleanPhone.endsWith(p);
  });

  return NextResponse.json({ orders: userOrders });
}
