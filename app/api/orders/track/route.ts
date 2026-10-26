import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const { orderNumber, phone } = await request.json();

    if (!orderNumber || !phone) {
      return NextResponse.json(
        { error: "Order number and phone number are required" },
        { status: 400 }
      );
    }

    const order = await db.getOrderByNumber(orderNumber, phone);
    if (!order) {
      return NextResponse.json(
        { error: "Order not found. Please verify your order number and mobile number." },
        { status: 404 }
      );
    }

    // Also fetch tailoring job status if custom
    const tailoringQueue = await db.getTailoringQueue();
    const tailoringJobs = tailoringQueue.filter((j) => j.order_id === order.id);

    return NextResponse.json({ order, tailoringJobs });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
