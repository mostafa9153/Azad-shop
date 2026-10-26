"use client";

import { useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Locale, formatPrice } from "@/lib/i18n";
import { Order, TailoringJob } from "@/lib/types";
import { brandConfig } from "@/config/brand.config";
import {
  Search,
  Package,
  Clock,
  Scissors,
  Truck,
  CheckCircle2,
  FileText,
  AlertCircle,
  MessageCircle,
  Phone,
  RotateCcw,
} from "lucide-react";
import { toast } from "sonner";

export default function OrderTrackingPage() {
  const params = useParams();
  const locale = ((params?.locale as string) || "bn") as Locale;

  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<Order | null>(null);
  const [tailoringJobs, setTailoringJobs] = useState<TailoringJob[]>([]);
  const [errorMessage, setErrorMessage] = useState("");

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) return;

    setLoading(true);
    setErrorMessage("");
    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: orderNumber.trim(),
          phone: phone.trim(),
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrder(data.order);
        setTailoringJobs(data.tailoringJobs || []);
      } else {
        setOrder(null);
        setErrorMessage(
          data.error ||
            (locale === "bn"
              ? "অর্ডারটি পাওয়া যায়নি। অনুগ্রহ করে অর্ডার নম্বর ও ফোন নম্বর সঠিক কিনা যাচাই করুন।"
              : "Order not found. Please verify your order number and mobile number.")
        );
      }
    } catch (err) {
      setErrorMessage(locale === "bn" ? "সার্ভার সংযোগে সমস্যা হয়েছে।" : "Connection failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!order) return;
    const confirmMsg =
      locale === "bn"
        ? "আপনি কি নিশ্চিতভাবে এই অর্ডারটি বাতিল করতে চান?"
        : "Are you sure you want to cancel this order?";
    if (!confirm(confirmMsg)) return;

    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: order.id, reason: "Customer requested cancellation" }),
      });
      if (res.ok) {
        setOrder({ ...order, order_status: "cancelled" });
        toast.success(locale === "bn" ? "অর্ডারটি সফলভাবে বাতিল করা হয়েছে।" : "Order cancelled.");
      }
    } catch (e) {
      toast.error(locale === "bn" ? "বাতিল করতে সমস্যা হয়েছে।" : "Failed to cancel.");
    }
  };

  const steps = [
    { key: "pending", labelBn: "অর্ডার গৃহীত", labelEn: "Order Placed" },
    { key: "processing", labelBn: "প্রস্তুতি চলছে", labelEn: "Processing" },
    { key: "tailoring", labelBn: "দরজি সেলাই", labelEn: "Tailoring" },
    { key: "shipped", labelBn: "কুরিয়ারে প্রেরিত", labelEn: "Dispatched" },
    { key: "delivered", labelBn: "ডেলিভার্ড", labelEn: "Delivered" },
  ];

  const getStepIndex = (status: string) => {
    if (status === "cancelled") return -1;
    if (status === "returned") return -1;
    const idx = steps.findIndex((s) => s.key === status);
    return idx !== -1 ? idx : 1;
  };

  const currentStep = order ? getStepIndex(order.order_status) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* Page Header */}
      <div className="text-center space-y-2 mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#14372E]/10 text-xs font-bold text-[#14372E]">
          <Package className="w-3.5 h-3.5" />
          <span>{locale === "bn" ? "লগইন ছাড়া তাৎক্ষণিক ট্র্যাকিং" : "Instant Guest Tracking"}</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14372E]">
          {locale === "bn" ? "আপনার অর্ডারের বর্তমান অবস্থা জানুন" : "Track Your Order"}
        </h1>
        <p className="text-xs sm:text-sm text-[#1C1B18]/70 max-w-md mx-auto">
          {locale === "bn"
            ? "চেকআউটের পর পাওয়া অর্ডার নম্বর এবং আপনার মোবাইল নম্বর দিয়ে সরাসরি লাইভ স্ট্যাটাস দেখুন।"
            : "Enter your Order Number and Mobile Number to track delivery progress in real time."}
        </p>
      </div>

      {/* Tracking Form */}
      <form
        onSubmit={handleTrack}
        className="bg-white p-5 sm:p-6 rounded-2xl border border-[#E9DDC9] shadow-md flex flex-col sm:flex-row gap-3 items-center"
      >
        <div className="w-full sm:flex-1">
          <label className="block text-[11px] font-bold text-[#1C1B18] mb-1">
            {locale === "bn" ? "অর্ডার নম্বর (যেমন: AH-123456-78):" : "Order Number:"}
          </label>
          <input
            type="text"
            value={orderNumber}
            onChange={(e) => setOrderNumber(e.target.value)}
            placeholder="AH-xxxxxx-xx"
            className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2.5 text-xs font-mono uppercase focus:outline-none focus:border-[#14372E]"
            required
          />
        </div>

        <div className="w-full sm:flex-1">
          <label className="block text-[11px] font-bold text-[#1C1B18] mb-1">
            {locale === "bn" ? "মোবাইল নম্বর:" : "Mobile Number:"}
          </label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="9000000000"
            className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2.5 text-xs focus:outline-none focus:border-[#14372E]"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full sm:w-auto px-6 py-2.5 sm:mt-5 bg-[#14372E] hover:bg-[#14372E]/90 text-[#FBF7F0] font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2"
        >
          <Search className="w-4 h-4" />
          <span>{loading ? "..." : locale === "bn" ? "ট্র্যাক করুন" : "Track"}</span>
        </button>
      </form>

      {/* Error display */}
      {errorMessage && (
        <div className="mt-6 p-4 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs sm:text-sm flex items-center gap-2.5">
          <AlertCircle className="w-5 h-5 shrink-0 text-red-600" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Live Order Details Card */}
      {order && (
        <div className="mt-8 space-y-6 animate-in fade-in duration-300">
          <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-md space-y-6">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9DDC9]">
              <div>
                <span className="text-xs font-semibold text-[#A8834A]">
                  {locale === "bn" ? "অর্ডার সম্পন্ন তারিখ: " : "Placed On: "}
                  {new Date(order.created_at).toLocaleDateString(locale === "bn" ? "bn-IN" : "en-IN")}
                </span>
                <h3 className="font-serif text-2xl font-bold text-[#14372E] mt-0.5">
                  {order.order_number}
                </h3>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                {/* Print Invoice Button */}
                <Link
                  href={`/${locale}/invoice/${order.order_number}`}
                  target="_blank"
                  className="px-3.5 py-1.5 rounded-lg border border-[#14372E] text-[#14372E] hover:bg-[#14372E]/5 text-xs font-bold flex items-center gap-1.5 transition-colors"
                >
                  <FileText className="w-4 h-4" />
                  <span>{locale === "bn" ? "জিএসটি চালান প্রিন্ট" : "Print Tax Invoice"}</span>
                </Link>

                {/* Cancel button if pending or processing */}
                {(order.order_status === "pending" || order.order_status === "processing") && (
                  <button
                    onClick={handleCancelOrder}
                    className="px-3.5 py-1.5 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-xs font-semibold transition-colors"
                  >
                    {locale === "bn" ? "অর্ডার বাতিল" : "Cancel Order"}
                  </button>
                )}
              </div>
            </div>

            {/* Stepper Progress Bar */}
            {order.order_status !== "cancelled" ? (
              <div className="py-4">
                <div className="relative flex items-center justify-between">
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#E9DDC9] w-full z-0" />
                  <div
                    className="absolute left-0 top-1/2 -translate-y-1/2 h-1 bg-[#14372E] transition-all duration-500 z-0"
                    style={{
                      width: `${(currentStep / (steps.length - 1)) * 100}%`,
                    }}
                  />

                  {steps.map((st, i) => {
                    const isDone = i <= currentStep;
                    const isCurrent = i === currentStep;
                    return (
                      <div key={st.key} className="relative z-10 flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                            isDone
                              ? "bg-[#14372E] text-[#FBF7F0] ring-4 ring-[#E9DDC9]"
                              : "bg-white border-2 border-[#E9DDC9] text-[#1C1B18]/40"
                          } ${isCurrent ? "scale-110 shadow-md" : ""}`}
                        >
                          {isDone ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                        </div>
                        <span
                          className={`text-[10px] sm:text-xs mt-2 font-semibold ${
                            isDone ? "text-[#14372E]" : "text-[#1C1B18]/50"
                          }`}
                        >
                          {locale === "bn" ? st.labelBn : st.labelEn}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-xl bg-red-50 border border-red-300 text-red-800 text-xs sm:text-sm font-bold text-center">
                {locale === "bn" ? "এই অর্ডারটি বাতিল করা হয়েছে।" : "This order has been cancelled."}
              </div>
            )}

            {/* Custom Tailoring Progress Card if applicable */}
            {tailoringJobs.length > 0 && (
              <div className="p-4 rounded-xl bg-[#E9DDC9]/40 border border-[#A8834A]/40 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-[#14372E] flex items-center gap-1.5">
                    <Scissors className="w-4 h-4 text-[#A8834A]" />
                    <span>
                      {locale === "bn" ? "দরজি কাজের অগ্রগতি (কাস্টম সাইজ):" : "Custom Tailoring Queue Progress:"}
                    </span>
                  </h4>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-[#A8834A] text-[#FBF7F0] uppercase">
                    {tailoringJobs[0].status}
                  </span>
                </div>
                <p className="text-[11px] text-[#1C1B18]/70">
                  {locale === "bn"
                    ? "আমাদের প্রধান দরজি আপনার পরিমাপ অনুযায়ী নিখুঁত সেলাই কাজ সম্পন্ন করছেন। শেষ হওয়ার পর কোয়ালিটি চেক শেষে কুরিয়ারে দেওয়া হবে।"
                    : "Our master tailor is cutting and crafting your custom measurements. Due date within 4 business days."}
                </p>
              </div>
            )}

            {/* Order Items list */}
            <div className="space-y-3 pt-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1B18]">
                {locale === "bn" ? "অর্ডারের পণ্যসমূহ:" : "Order Items:"}
              </h4>
              <div className="divide-y divide-[#E9DDC9]">
                {order.items?.map((item) => (
                  <div key={item.id} className="py-2.5 flex items-center justify-between text-xs sm:text-sm">
                    <div>
                      <h5 className="font-bold text-[#14372E]">
                        {locale === "bn" ? item.title_bn : item.title_en}
                      </h5>
                      <p className="text-[11px] text-[#1C1B18]/60">
                        {locale === "bn" ? `সাইজ: ${item.size} • রঙ: ${item.color_bn || item.color_en}` : `Size: ${item.size} • Color: ${item.color_en}`}
                        {item.is_custom_size && ` • (কাস্টম পরিমাপ)`}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-[#1C1B18]">
                        {formatPrice(item.total_paise, locale)}
                      </span>
                      <p className="text-[10px] text-[#1C1B18]/60">Qty: {item.quantity}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Delivery address & WhatsApp assistance */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#E9DDC9] text-xs">
              <div>
                <h5 className="font-bold text-[#1C1B18] mb-1">
                  {locale === "bn" ? "ডেলিভারি ঠিকানা:" : "Shipping Address:"}
                </h5>
                <p className="text-[#1C1B18]/70 leading-relaxed">
                  {order.customer_name}
                  <br />
                  {order.shipping_address.address_line1}
                  {order.shipping_address.address_line2 && `, ${order.shipping_address.address_line2}`}
                  <br />
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                  <br />
                  {locale === "bn" ? "ফোন: " : "Phone: "}
                  {order.customer_phone}
                </p>
              </div>

              <div className="flex flex-col justify-between">
                <div>
                  <h5 className="font-bold text-[#1C1B18] mb-1">
                    {locale === "bn" ? "পেমেন্ট ও ডেলিভারি তথ্য:" : "Payment & Courier:"}
                  </h5>
                  <p className="text-[#1C1B18]/70">
                    {locale === "bn" ? "পদ্ধতি: " : "Method: "}
                    <span className="font-semibold text-[#14372E] uppercase">{order.payment_method}</span>
                    <br />
                    {locale === "bn" ? "পেমেন্ট স্ট্যাটাস: " : "Payment Status: "}
                    <span className="font-semibold text-green-700 uppercase">{order.payment_status}</span>
                  </p>
                </div>

                <a
                  href={`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(
                    locale === "bn"
                      ? `আসসালামু আলাইকুম, আমি আমার অর্ডার ${order.order_number} সম্পর্কে লাইভ আপডেট জানতে চাই।`
                      : `Assalamu Alaikum, I would like an update on order ${order.order_number}.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 inline-flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#25D366] text-white text-xs font-bold hover:bg-[#20ba59] transition-colors shadow-xs"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{locale === "bn" ? "হোয়াটসঅ্যাপে লাইভ সহায়তা" : "Inquire via WhatsApp"}</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
