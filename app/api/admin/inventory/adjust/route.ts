import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { StockChangeType } from "@/lib/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { variantId, quantityChange, changeType, note, referenceId } = body;

    if (!variantId || quantityChange === undefined || !changeType) {
      return NextResponse.json(
        { error: "variantId, quantityChange, and changeType are required." },
        { status: 400 }
      );
    }

    const result = await db.adjustStock(
      variantId,
      Number(quantityChange),
      changeType as StockChangeType,
      note || "Admin manual adjustment",
      referenceId,
      "admin"
    );

    return NextResponse.json({ ...result });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
