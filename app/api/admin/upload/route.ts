import { NextResponse } from "next/server";
import { processAndSaveImage } from "@/lib/image-pipeline";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const files = formData.getAll("file") as File[];

    if (!files || files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadedResults = [];
    for (const file of files) {
      const buffer = Buffer.from(await file.arrayBuffer());
      const result = await processAndSaveImage(buffer, file.name, "products");
      uploadedResults.push(result);
    }

    return NextResponse.json({ success: true, uploaded: uploadedResults });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
