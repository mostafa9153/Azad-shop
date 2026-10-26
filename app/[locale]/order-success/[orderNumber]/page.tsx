import Link from "next/link";
import { notFound } from "next/navigation";
import { Locale, formatPrice } from "@/lib/i18n";
import { db } from "@/lib/db";
import { brandConfig } from "@/config/brand.config";
import { CheckCircle2, Package, FileText, ArrowRight, Truck, MessageCircle } from "lucide-react";

export default async function OrderSuccessPage({
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

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-20 text-center space-y-8">
      {/* Celebration Emblem */}
      <div className="w-20 h-20 rounded-full bg-[#14372E] text-[#C5A059] flex items-center justify-center mx-auto shadow-xl ring-8 ring-[#E9DDC9]">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div className="space-y-2">
        <span className="text-xs font-bold uppercase tracking-widest text-[#A8834A]">
          {locale === "bn" ? "মাশাআল্লাহ! অর্ডার সফল" : "Order Placed Successfully"}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14372E]">
          {locale === "bn" ? "আজাদ হায়া পরিবারে আপনাকে স্বাগতম" : "Thank You for Your Order!"}
        </h1>
        <p className="text-xs sm:text-sm text-[#1C1B18]/70 max-w-md mx-auto">
          {locale === "bn"
            ? "আপনার অর্ডারটি গ্রহণ করা হয়েছে এবং কলকাতার নিজস্ব কারখানায় সতর্কতার সাথে প্রস্তুত করা হচ্ছে।"
            : "Your modest wear order has been confirmed and is being prepared in our Bengal atelier."}
        </p>
      </div>

      {/* Order Details Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-md text-left space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-[#E9DDC9] gap-2">
          <div>
            <span className="text-xs text-[#1C1B18]/60">{locale === "bn" ? "অর্ডার নম্বর:" : "Order Number:"}</span>
            <h3 className="font-mono text-xl font-bold text-[#14372E]">{order.order_number}</h3>
          </div>
          <div className="text-right">
            <span className="text-xs text-[#1C1B18]/60">{locale === "bn" ? "সর্বমোট পরিশোধিত:" : "Total Paid:"}</span>
            <p className="font-serif text-xl font-bold text-[#14372E]">{formatPrice(order.total_paise, locale)}</p>
          </div>
        </div>

        {/* ETA */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-[#E9DDC9]/40 border border-[#A8834A]/30 text-xs">
          <Truck className="w-5 h-5 text-[#14372E] shrink-0" />
          <div>
            <strong className="text-[#14372E]">{locale === "bn" ? "সম্ভাব্য ডেলিভারি:" : "Estimated Delivery:"} </strong>
            <span>{locale === "bn" ? "১ থেকে ৩ কার্যদিবস (পশ্চিমবঙ্গ এক্সপ্রেস কুরিয়ার)" : "1–3 business days via Express Courier"}</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
          <Link
            href={`/${locale}/track`}
            className="w-full py-3 px-4 rounded-xl bg-[#14372E] text-white font-bold text-xs sm:text-sm hover:bg-[#14372E]/90 transition-all shadow-md flex items-center justify-center gap-2"
          >
            <Package className="w-4 h-4" />
            <span>{locale === "bn" ? "অর্ডারের লাইভ ট্র্যাকিং" : "Track Order Status"}</span>
          </Link>

          <Link
            href={`/${locale}/invoice/${order.order_number}`}
            target="_blank"
            className="w-full py-3 px-4 rounded-xl bg-white border border-[#14372E] text-[#14372E] font-bold text-xs sm:text-sm hover:bg-[#14372E]/5 transition-colors flex items-center justify-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>{locale === "bn" ? "জিএসটি ট্যাক্স চালান প্রিন্ট" : "Print Tax Invoice"}</span>
          </Link>
        </div>

        {/* WhatsApp update */}
        <div className="pt-2 text-center">
          <a
            href={`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(
              locale === "bn"
                ? `আসসালামু আলাইকুম, আমি অর্ডার ${order.order_number} সম্পন্ন করেছি।`
                : `Assalamu Alaikum, I placed order ${order.order_number}.`
            )}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#25D366] hover:underline"
          >
            <MessageCircle className="w-4 h-4" />
            <span>{locale === "bn" ? "হোয়াটসঅ্যাপে ডেলিভারি আপডেট চান?" : "Want WhatsApp delivery updates?"}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
