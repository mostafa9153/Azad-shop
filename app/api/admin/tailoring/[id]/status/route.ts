import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { TailoringStatus } from "@/lib/types";

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { status, tailor } = body;

    const updated = await db.updateTailoringStatus(id, status as TailoringStatus, tailor);
    if (!updated) {
      return NextResponse.json({ error: "Tailoring job not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job: updated });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
