import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { OrderStatus, PaymentStatus } from "@/lib/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { order_status, payment_status, tracking_number } = body;

    let updated = null;
    if (order_status) {
      updated = await db.updateOrderStatus(id, order_status as OrderStatus);
    }
    if (payment_status) {
      updated = await db.updatePaymentStatus(id, payment_status as PaymentStatus);
    }

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
