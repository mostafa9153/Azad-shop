import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { product_id, customer_name, rating, comment } = body;

    if (!product_id || !customer_name || !rating || !comment) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const review = await db.addReview({
      product_id,
      customer_name,
      rating: parseInt(rating, 10),
      comment,
    });

    return NextResponse.json({ review });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
