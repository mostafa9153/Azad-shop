import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q") || "";

  if (!q.trim()) {
    return NextResponse.json({ products: [] });
  }

  const products = await db.getProducts({
    search: q.trim(),
    limit: 12,
  });

  return NextResponse.json({ products });
}
