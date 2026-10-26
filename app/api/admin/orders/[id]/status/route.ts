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

    const updates: any = {};
    if (order_status) updates.order_status = order_status as OrderStatus;
    if (payment_status) updates.payment_status = payment_status as PaymentStatus;
    if (tracking_number !== undefined) updates.tracking_number = tracking_number;

    let updated = null;
    if (order_status === "cancelled") {
      updated = await db.cancelOrder(id, "Cancelled by Admin", "admin");
      if (payment_status) {
        updated = await db.updatePaymentStatus(id, payment_status as PaymentStatus);
      }
    } else {
      updated = await db.updateOrder(id, updates);
    }

    if (!updated) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
