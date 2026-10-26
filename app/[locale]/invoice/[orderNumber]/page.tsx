import { notFound } from "next/navigation";
import { Locale, formatPrice } from "@/lib/i18n";
import { db } from "@/lib/db";
import { brandConfig } from "@/config/brand.config";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default async function InvoicePage({
  params,
}: {
  params: Promise<{ locale: string; orderNumber: string }>;
}) {
  const { locale: rawLocale, orderNumber } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const order = await db.getOrderByNumber(orderNumber);
  if (!order) {
    notFound();
  }

  const invoiceDate = new Date(order.created_at).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <div className="min-h-screen bg-white text-[#1C1B18] p-4 sm:p-8 print:p-0">
      {/* Print Action Bar (Hidden during print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link
          href={`/${locale}/track`}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-[#14372E] hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>{locale === "bn" ? "অর্ডার ট্র্যাকিং-এ ফিরুন" : "Back to Tracking"}</span>
        </Link>

        <button
          onClick={() => {
            if (typeof window !== "undefined") window.print();
          }}
          className="px-5 py-2.5 rounded-xl bg-[#14372E] text-white text-xs font-bold shadow-md hover:bg-[#14372E]/90 flex items-center gap-2 cursor-pointer"
        >
          <Printer className="w-4 h-4" />
          <span>{locale === "bn" ? "প্রিন্ট চালান / ডাউনলোড PDF" : "Print Invoice / Save PDF"}</span>
        </button>
      </div>

      {/* Printable Invoice Card */}
      <div className="max-w-4xl mx-auto bg-white border border-[#CCCCCC] p-8 sm:p-12 shadow-sm print:border-none print:p-0 print:shadow-none">
        {/* Top Header */}
        <div className="flex justify-between items-start border-b-2 border-[#14372E] pb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <svg width="28" height="12" viewBox="0 0 34 14" fill="none" className="text-[#A8834A]">
                <path d="M1 13C1 7 8 1 17 1C26 1 33 7 33 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="17" cy="1" r="1.5" fill="currentColor" />
              </svg>
              <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-wide text-[#14372E]">
                {brandConfig.name.en}
              </h1>
            </div>
            <p className="text-xs text-[#555555] font-serif italic">{brandConfig.tagline.en}</p>
            <p className="text-[11px] text-[#666666] mt-2 max-w-sm">
              {brandConfig.shop.address.en}
              <br />
              Kolkata, West Bengal - {brandConfig.shop.pincode}
              <br />
              Email: {brandConfig.contact.email} | Phone: {brandConfig.contact.phone}
            </p>
          </div>

          <div className="text-right space-y-1">
            <span className="inline-block px-3 py-1 bg-[#14372E] text-white font-bold text-xs uppercase tracking-wider rounded">
              TAX INVOICE
            </span>
            <p className="text-xs font-mono font-bold text-[#14372E] mt-2">
              INV: {order.order_number}
            </p>
            <p className="text-xs text-[#666666]">Date: {invoiceDate}</p>
            <p className="text-[10px] text-[#777777] font-mono">GSTIN: 19AAHCA9000A1Z5</p>
          </div>
        </div>

        {/* Bill To & Ship To Details */}
        <div className="grid grid-cols-2 gap-8 py-6 border-b border-[#EEEEEE] text-xs">
          <div>
            <h4 className="font-bold text-[#14372E] uppercase tracking-wider text-[11px] mb-2">
              Billed To:
            </h4>
            <p className="font-bold text-sm text-[#1C1B18]">{order.customer_name}</p>
            <p className="text-[#555555] mt-1 leading-relaxed">
              {order.shipping_address.address_line1}
              {order.shipping_address.address_line2 && `, ${order.shipping_address.address_line2}`}
              <br />
              {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
              <br />
              Phone: {order.customer_phone}
              {order.customer_email && `<br />Email: ${order.customer_email}`}
            </p>
          </div>

          <div>
            <h4 className="font-bold text-[#14372E] uppercase tracking-wider text-[11px] mb-2">
              Shipping & Payment:
            </h4>
            <p className="text-[#555555] leading-relaxed">
              <strong>Payment Method:</strong> {order.payment_method.toUpperCase()}
              <br />
              <strong>Payment Status:</strong> {order.payment_status.toUpperCase()}
              <br />
              <strong>Order Status:</strong> {order.order_status.toUpperCase()}
              <br />
              <strong>Courier:</strong> {order.shipping_method}
              {order.tracking_number && <><br /><strong>AWB No:</strong> {order.tracking_number}</>}
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="py-6">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b-2 border-[#14372E] text-[#14372E] font-bold">
                <th className="py-2.5">#</th>
                <th className="py-2.5">Item Description</th>
                <th className="py-2.5">HSN Code</th>
                <th className="py-2.5">Size / Color</th>
                <th className="py-2.5 text-center">Qty</th>
                <th className="py-2.5 text-right">Unit Rate</th>
                <th className="py-2.5 text-right">Taxable Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#EEEEEE]">
              {order.items?.map((item, idx) => (
                <tr key={item.id} className="text-[#333333]">
                  <td className="py-3 font-mono">{idx + 1}</td>
                  <td className="py-3">
                    <p className="font-bold text-[#14372E]">{item.title_en}</p>
                    <p className="text-[10px] text-[#777777]">{item.title_bn}</p>
                    {item.is_custom_size && (
                      <span className="text-[10px] font-bold text-[#A8834A]">[Custom Tailored]</span>
                    )}
                  </td>
                  <td className="py-3 font-mono text-[11px]">6204</td>
                  <td className="py-3">
                    {item.size} • {item.color_en}
                  </td>
                  <td className="py-3 text-center font-bold">{item.quantity}</td>
                  <td className="py-3 text-right">{formatPrice(item.price_paise, "en")}</td>
                  <td className="py-3 text-right font-bold text-[#14372E]">
                    {formatPrice(item.total_paise, "en")}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Calculation Breakdown & GST Summary */}
        <div className="border-t-2 border-[#14372E] pt-4 flex justify-between items-start">
          <div className="max-w-xs space-y-2 text-[11px] text-[#666666]">
            <p>
              <strong>GST Notice:</strong> Goods and Services Tax inclusive under Section 9 of the CGST Act 2017. Apparel up to ₹2,500 attracts 5% GST; above ₹2,500 attracts 18% GST.
            </p>
            <p>
              <strong>Declaration:</strong> We declare that this invoice shows the actual price of the goods described and that all particulars are true and correct.
            </p>
          </div>

          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-[#555555]">
              <span>Items Total:</span>
              <span>{formatPrice(order.items_total_paise, "en")}</span>
            </div>

            {order.custom_size_fee_paise > 0 && (
              <div className="flex justify-between text-[#555555]">
                <span>Custom Tailoring Fee:</span>
                <span>+{formatPrice(order.custom_size_fee_paise, "en")}</span>
              </div>
            )}

            {order.discount_total_paise > 0 && (
              <div className="flex justify-between text-green-700 font-bold">
                <span>Coupon Discount:</span>
                <span>-{formatPrice(order.discount_total_paise, "en")}</span>
              </div>
            )}

            <div className="flex justify-between text-[#555555]">
              <span>Shipping Fee:</span>
              <span>{order.shipping_fee_paise === 0 ? "FREE" : formatPrice(order.shipping_fee_paise, "en")}</span>
            </div>

            {order.cod_fee_paise > 0 && (
              <div className="flex justify-between text-[#555555]">
                <span>COD Convenience Fee:</span>
                <span>+{formatPrice(order.cod_fee_paise, "en")}</span>
              </div>
            )}

            <div className="flex justify-between text-[11px] text-[#777777] pt-1 border-t border-[#EEEEEE]">
              <span>Included CGST (2.5%):</span>
              <span>{formatPrice(Math.round(order.gst_total_paise / 2), "en")}</span>
            </div>
            <div className="flex justify-between text-[11px] text-[#777777]">
              <span>Included SGST (2.5%):</span>
              <span>{formatPrice(Math.round(order.gst_total_paise / 2), "en")}</span>
            </div>

            <div className="flex justify-between text-base font-bold text-[#14372E] border-t-2 border-[#14372E] pt-2">
              <span>Grand Total:</span>
              <span>{formatPrice(order.total_paise, "en")}</span>
            </div>
          </div>
        </div>

        {/* Authorized Signatory Footer */}
        <div className="mt-12 pt-6 border-t border-[#DDDDDD] flex justify-between items-end text-xs text-[#555555]">
          <div>
            <p className="font-bold text-[#14372E]">AZAD HAYA (আজাদ হায়া)</p>
            <p className="text-[10px]">Thank you for supporting ethical modest fashion in Bengal.</p>
          </div>
          <div className="text-center">
            <div className="w-32 border-b border-[#1C1B18] mb-1" />
            <p className="text-[10px] uppercase font-bold text-[#14372E]">Authorized Signatory</p>
          </div>
        </div>
      </div>
    </div>
  );
}
