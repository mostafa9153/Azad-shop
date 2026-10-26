"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Locale, formatPrice } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { User, Package, MapPin, LogOut, FileText, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function AccountPage() {
  const params = useParams();
  const router = useRouter();
  const locale = ((params?.locale as string) || "bn") as Locale;

  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPhone = localStorage.getItem("azad_haya_user_phone");
      if (!savedPhone) {
        router.push(`/${locale}/login`);
        return;
      }
      setPhone(savedPhone);

      // fetch past orders
      fetch(`/api/orders/user?phone=${savedPhone}`)
        .then((r) => r.json())
        .then((data) => setOrders(data.orders || []))
        .catch(() => {});
    }
  }, [locale, router]);

  const handleLogout = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem("azad_haya_user_phone");
      localStorage.removeItem("azad_haya_logged_in");
    }
    toast.info(locale === "bn" ? "লগআউট সম্পন্ন হয়েছে।" : "Logged out successfully.");
    router.push(`/${locale}`);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#E9DDC9] mb-8">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-[#14372E] text-white flex items-center justify-center font-bold text-lg">
            AH
          </div>
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E]">
              {locale === "bn" ? "আমার অ্যাকাউন্ট" : "My Account"}
            </h1>
            <p className="text-xs text-[#1C1B18]/70">
              {locale === "bn" ? `মোবাইল: +৯১ ${phone}` : `Phone: +91 ${phone}`}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-red-300 text-red-700 hover:bg-red-50 text-xs font-bold transition-colors w-fit"
        >
          <LogOut className="w-4 h-4" />
          <span>{locale === "bn" ? "লগআউট" : "Log Out"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Profile & Address Card */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#14372E] flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#A8834A]" />
              <span>{locale === "bn" ? "ডিফল্ট ডেলিভারি তথ্য" : "Default Delivery Address"}</span>
            </h3>
            <p className="text-xs text-[#1C1B18]/70 leading-relaxed">
              Kolkata, West Bengal
              <br />
              India - 700017
              <br />
              +91 {phone}
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-3">
            <h3 className="font-bold text-sm text-[#14372E]">
              {locale === "bn" ? "আজাদ হায়া কাস্টমার প্রিভিলেজ" : "Customer Privileges"}
            </h3>
            <ul className="text-xs text-[#1C1B18]/80 space-y-2 list-disc list-inside">
              <li>{locale === "bn" ? "কাস্টম সাইজ দরজি সেবা সরাসরি প্রোফাইল ট্র্যাকিং" : "Custom tailoring tracking"}</li>
              <li>{locale === "bn" ? "জিএসটি চালান তাৎক্ষণিক ডাউনলোড" : "Instant GST invoices"}</li>
              <li>{locale === "bn" ? "ঈদ ও রমজান স্পেশাল আগাম ডিসকাউন্ট" : "Early festive access"}</li>
            </ul>
          </div>
        </div>

        {/* Right Column: Order History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs">
            <h2 className="font-serif text-xl font-bold text-[#14372E] mb-4 flex items-center gap-2">
              <Package className="w-5 h-5 text-[#A8834A]" />
              <span>{locale === "bn" ? "অর্ডার ইতিহাস" : "Recent Orders"}</span>
            </h2>

            {orders.length === 0 ? (
              <div className="text-center py-10 space-y-3">
                <p className="text-xs text-[#1C1B18]/60">
                  {locale === "bn" ? "আপনার কোনো পূর্ববর্তী অর্ডার নেই।" : "No previous orders found."}
                </p>
                <Link
                  href={`/${locale}/shop`}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#14372E] text-[#FBF7F0] text-xs font-bold"
                >
                  <span>{locale === "bn" ? "শপিং শুরু করুন" : "Start Shopping"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-4 rounded-xl border border-[#E9DDC9] bg-[#FBF7F0]/40 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-mono text-xs font-bold text-[#14372E]">
                          {ord.order_number}
                        </span>
                        <p className="text-[11px] text-[#1C1B18]/60">
                          {new Date(ord.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <span className="px-2.5 py-1 rounded text-xs font-bold bg-[#14372E] text-[#FBF7F0] uppercase">
                        {ord.order_status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-2 border-t border-[#E9DDC9]">
                      <span className="font-bold text-[#14372E]">{formatPrice(ord.total_paise, locale)}</span>
                      <Link
                        href={`/${locale}/invoice/${ord.order_number}`}
                        target="_blank"
                        className="text-xs font-semibold text-[#14372E] hover:underline flex items-center gap-1"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>{locale === "bn" ? "চালান দেখুন" : "View Invoice"}</span>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
