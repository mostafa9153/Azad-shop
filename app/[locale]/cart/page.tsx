"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Locale, formatPrice } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { useCartStore } from "@/lib/cart-store";
import {
  ShoppingBag,
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  Truck,
  Tag,
  Check,
  ShieldCheck,
  Scissors,
} from "lucide-react";
import { toast } from "sonner";

export default function CartPage() {
  const params = useParams();
  const router = useRouter();
  const locale = ((params?.locale as string) || "bn") as Locale;

  const { items, updateQuantity, removeItem, clearCart, getTotalPaise } = useCartStore();

  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPaise: number } | null>(null);
  const [validatingCoupon, setValidatingCoupon] = useState(false);

  const rawSubtotalPaise = getTotalPaise();
  const freeShippingThreshold = brandConfig.shipping.freeShippingThresholdPaise;
  const isFreeShipping = rawSubtotalPaise >= freeShippingThreshold;
  const shippingFeePaise = isFreeShipping ? 0 : 6000; // ₹60 standard

  const discountPaise = appliedCoupon ? appliedCoupon.discountPaise : 0;
  const finalTotalPaise = Math.max(0, rawSubtotalPaise - discountPaise + shippingFeePaise);
  const gstInclusivePaise = Math.round((rawSubtotalPaise * 0.05) / 1.05);

  const handleApplyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;

    setValidatingCoupon(true);
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode.trim(),
          itemsTotalPaise: rawSubtotalPaise,
        }),
      });

      const data = await res.json();
      if (data.valid) {
        setAppliedCoupon({
          code: data.coupon.code,
          discountPaise: data.discountPaise,
        });
        toast.success(
          locale === "bn"
            ? `কুপন "${data.coupon.code}" সফলভাবে প্রয়োগ হয়েছে! আপনি ${formatPrice(data.discountPaise, locale)} ছাড় পেয়েছেন।`
            : `Coupon "${data.coupon.code}" applied! You saved ${formatPrice(data.discountPaise, locale)}.`
        );
      } else {
        toast.error(data.message || (locale === "bn" ? "অকার্যকর কুপন কোড।" : "Invalid coupon code."));
      }
    } catch (err) {
      toast.error(locale === "bn" ? "কুপন যাচাই করতে সমস্যা হয়েছে।" : "Failed to validate coupon.");
    } finally {
      setValidatingCoupon(false);
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponCode("");
    toast.info(locale === "bn" ? "কুপন অপসারণ করা হয়েছে।" : "Coupon removed.");
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-[#E9DDC9]/50 mx-auto flex items-center justify-center text-[#A8834A]">
          <ShoppingBag className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#14372E]">
          {locale === "bn" ? "আপনার শপিং ব্যাগটি বর্তমানে খালি" : "Your Shopping Bag is Empty"}
        </h1>
        <p className="text-sm text-[#1C1B18]/70 max-w-md mx-auto">
          {locale === "bn"
            ? "আজাদ হায়ার নতুন বোরকা, আবায়া, জিলবাব ও সুতি পাঞ্জাবির কালেকশন ঘুরে দেখুন এবং পছন্দের পোশাক ব্যাগে যোগ করুন।"
            : "Explore our latest collection of premium modest attire and find the perfect piece for your wardrobe."}
        </p>
        <Link
          href={`/${locale}/shop`}
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#14372E] text-[#FBF7F0] font-bold text-sm shadow-md hover:bg-[#14372E]/90 transition-all"
        >
          <span>{locale === "bn" ? "কালেকশন দেখুন" : "Explore Collections"}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14372E] mb-8">
        {locale === "bn" ? "শপিং ব্যাগ ও চেকআউট প্রস্তুতি" : "Shopping Bag"}
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Item List (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Free delivery banner */}
          <div className="p-4 rounded-2xl bg-white border border-[#E9DDC9] shadow-xs">
            {isFreeShipping ? (
              <div className="flex items-center gap-2 text-green-700 text-xs sm:text-sm font-bold">
                <Truck className="w-5 h-5 text-green-700" />
                <span>
                  {locale === "bn"
                    ? "🎉 অভিনন্দন! আপনি ফ্রি এক্সপ্রেস ডেলিভারির যোগ্য হয়েছেন।"
                    : "🎉 Congratulations! You have unlocked FREE Express Delivery."}
                </span>
              </div>
            ) : (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold text-[#14372E]">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-[#A8834A]" />
                    {locale === "bn"
                      ? `আর মাত্র ${formatPrice(freeShippingThreshold - rawSubtotalPaise, locale)} টাকার অর্ডারে ফ্রি ডেলিভারি!`
                      : `Add ${formatPrice(freeShippingThreshold - rawSubtotalPaise, locale)} more for FREE Delivery!`}
                  </span>
                  <span>{Math.round((rawSubtotalPaise / freeShippingThreshold) * 100)}%</span>
                </div>
                <div className="w-full bg-[#E9DDC9]/50 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#14372E] h-full transition-all duration-300"
                    style={{ width: `${Math.min(100, (rawSubtotalPaise / freeShippingThreshold) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart items */}
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white p-4 sm:p-5 rounded-2xl border border-[#E9DDC9] shadow-2xs flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between"
              >
                <div className="flex items-center gap-4">
                  <div className="relative w-20 h-26 rounded-xl overflow-hidden bg-[#FBF7F0] border border-[#E9DDC9] shrink-0">
                    <Image
                      src={item.imageUrl || "/placeholder-product.svg"}
                      alt={locale === "bn" ? item.titleBn : item.titleEn}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-serif text-base sm:text-lg font-bold text-[#1C1B18]">
                      {locale === "bn" ? item.titleBn : item.titleEn}
                    </h3>
                    <div className="flex flex-wrap gap-2 text-xs text-[#1C1B18]/70">
                      <span className="bg-[#FBF7F0] px-2 py-0.5 rounded border border-[#E9DDC9]">
                        {locale === "bn" ? `সাইজ: ${item.size}` : `Size: ${item.size}`}
                      </span>
                      <span className="bg-[#FBF7F0] px-2 py-0.5 rounded border border-[#E9DDC9]">
                        {locale === "bn" ? item.colorBn : item.colorEn}
                      </span>
                      {item.isCustomSize && (
                        <span className="bg-[#A8834A]/10 text-[#A8834A] px-2 py-0.5 rounded font-bold border border-[#A8834A]/30 flex items-center gap-1">
                          <Scissors className="w-3 h-3" />
                          {locale === "bn" ? "কাস্টম দরজি সেলাই (+₹১৫০)" : "Custom Tailoring (+₹150)"}
                        </span>
                      )}
                    </div>

                    {item.isCustomSize && item.customMeasurements && (
                      <p className="text-[11px] text-[#14372E] font-medium pt-0.5">
                        {locale === "bn" ? "পরিমাপ: " : "Measurements: "}
                        {item.customMeasurements.length_inches && `L: ${item.customMeasurements.length_inches}" `}
                        {item.customMeasurements.chest_inches && `C: ${item.customMeasurements.chest_inches}" `}
                        {item.customMeasurements.sleeve_inches && `S: ${item.customMeasurements.sleeve_inches}"`}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between w-full sm:w-auto sm:gap-6 pt-3 sm:pt-0 border-t sm:border-t-0 border-[#E9DDC9]/60">
                  {/* Quantity controls */}
                  <div className="flex items-center border border-[#E9DDC9] rounded-xl bg-[#FBF7F0]">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="p-1.5 hover:bg-[#E9DDC9] transition-colors rounded-l-xl text-[#1C1B18]"
                      aria-label="Decrease"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-[#14372E]">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="p-1.5 hover:bg-[#E9DDC9] transition-colors rounded-r-xl text-[#1C1B18]"
                      aria-label="Increase"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Price */}
                  <div className="text-right">
                    <span className="text-base sm:text-lg font-bold text-[#14372E]">
                      {formatPrice((item.pricePaise + (item.isCustomSize ? 15000 : 0)) * item.quantity, locale)}
                    </span>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 text-[#1C1B18]/40 hover:text-red-600 transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-between items-center pt-2">
            <Link
              href={`/${locale}/shop`}
              className="text-xs font-semibold text-[#14372E] hover:underline"
            >
              &larr; {locale === "bn" ? "আরও পোশাক যোগ করুন" : "Continue Shopping"}
            </Link>
            <button
              onClick={clearCart}
              className="text-xs font-semibold text-red-600 hover:underline"
            >
              {locale === "bn" ? "সম্পূর্ণ ব্যাগ খালি করুন" : "Clear Entire Bag"}
            </button>
          </div>
        </div>

        {/* Right: Order Summary & Coupon Engine (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-md space-y-5">
            <h2 className="font-serif text-xl font-bold text-[#14372E]">
              {locale === "bn" ? "অর্ডার সারাংশ" : "Order Summary"}
            </h2>

            {/* Coupon input */}
            <form onSubmit={handleApplyCoupon} className="space-y-2">
              <label className="block text-xs font-bold text-[#1C1B18]">
                {locale === "bn" ? "ডিসকাউন্ট কুপন কোড:" : "Promotional Coupon:"}
              </label>

              {appliedCoupon ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-green-50 border border-green-300 text-xs">
                  <div className="flex items-center gap-1.5 font-bold text-green-800">
                    <Check className="w-4 h-4" />
                    <span>{appliedCoupon.code} (-{formatPrice(appliedCoupon.discountPaise, locale)})</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveCoupon}
                    className="text-red-600 hover:underline font-semibold text-[11px]"
                  >
                    {locale === "bn" ? "মুছুন" : "Remove"}
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="AZAD10 / RAMADAN2026"
                    className="flex-1 bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3 py-2 text-xs font-mono uppercase focus:outline-none focus:border-[#14372E]"
                  />
                  <button
                    type="submit"
                    disabled={validatingCoupon}
                    className="px-4 py-2 bg-[#14372E] text-[#FBF7F0] rounded-xl text-xs font-bold hover:bg-[#14372E]/90 transition-colors shadow-xs"
                  >
                    {validatingCoupon ? "..." : locale === "bn" ? "প্রয়োগ" : "Apply"}
                  </button>
                </div>
              )}
            </form>

            {/* Price breakdown */}
            <div className="space-y-2.5 text-xs sm:text-sm text-[#1C1B18]/80 border-t border-[#E9DDC9] pt-4">
              <div className="flex justify-between">
                <span>{locale === "bn" ? "পণ্যের মোট মূল্য:" : "Items Subtotal:"}</span>
                <span className="font-semibold text-[#1C1B18]">{formatPrice(rawSubtotalPaise, locale)}</span>
              </div>

              {discountPaise > 0 && (
                <div className="flex justify-between text-green-700 font-bold">
                  <span>{locale === "bn" ? "কুপন মূল্যছাড়:" : "Coupon Discount:"}</span>
                  <span>-{formatPrice(discountPaise, locale)}</span>
                </div>
              )}

              <div className="flex justify-between">
                <span>{locale === "bn" ? "এক্সপ্রেস ডেলিভারি চার্জ:" : "Express Shipping:"}</span>
                <span className="font-semibold text-[#1C1B18]">
                  {isFreeShipping ? (
                    <span className="text-green-700 font-bold">{locale === "bn" ? "ফ্রি" : "FREE"}</span>
                  ) : (
                    formatPrice(shippingFeePaise, locale)
                  )}
                </span>
              </div>

              <div className="flex justify-between text-[11px] text-[#1C1B18]/50 pt-1 border-t border-[#E9DDC9]/50">
                <span>{locale === "bn" ? "জিএসটি অন্তর্ভুক্ত (৫% / ১৮%):" : "Estimated GST (inclusive):"}</span>
                <span>{formatPrice(gstInclusivePaise, locale)}</span>
              </div>

              <div className="flex justify-between text-base sm:text-lg font-bold text-[#14372E] border-t-2 border-[#14372E] pt-3">
                <span>{locale === "bn" ? "সর্বমোট প্রদেয় মূল্য:" : "Grand Total:"}</span>
                <span>{formatPrice(finalTotalPaise, locale)}</span>
              </div>
            </div>

            {/* Proceed to Checkout CTA */}
            <button
              onClick={() => router.push(`/${locale}/checkout`)}
              className="w-full py-4 px-6 rounded-xl bg-[#14372E] hover:bg-[#14372E]/90 text-[#FBF7F0] font-bold text-sm sm:text-base transition-all shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>{locale === "bn" ? "চেকআউটে এগিয়ে যান" : "Proceed to Checkout"}</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>

            <div className="pt-2 text-center text-[11px] text-[#1C1B18]/60 flex items-center justify-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#A8834A]" />
              <span>{locale === "bn" ? "১০০% নিরাপদ পেমেন্ট ও এনক্রিপশন" : "100% Secure Checkout"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
