import { NextResponse } from "next/server";
import QRCode from "qrcode";
import { brandConfig } from "@/config/brand.config";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const amountPaise = parseInt(searchParams.get("amountPaise") || "0", 10);
    const amountRupees = (amountPaise / 100).toFixed(2);
    const orderRef = searchParams.get("ref") || `AH-${Date.now().toString().slice(-6)}`;

    const vpa = brandConfig.payments.demoUpiVpa;
    const name = encodeURIComponent(brandConfig.payments.upiMerchantName);
    const note = encodeURIComponent(`AZAD HAYA Order ${orderRef}`);

    const upiUri = `upi://pay?pa=${vpa}&pn=${name}&am=${amountRupees}&cu=INR&tn=${note}`;

    const qrDataUrl = await QRCode.toDataURL(upiUri, {
      margin: 2,
      width: 280,
      color: {
        dark: "#14372E",
        light: "#FBF7F0",
      },
    });

    return NextResponse.json({
      qrDataUrl,
      upiUri,
      vpa,
      amountRupees,
      orderRef,
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
