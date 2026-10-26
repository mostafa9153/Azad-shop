"use client";

import { useCartStore } from "@/lib/cart-store";
import { Locale, formatPrice } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Truck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface CartDrawerProps {
  locale: Locale;
}

export function CartDrawer({ locale }: CartDrawerProps) {
  const { items, isOpen, closeCart, updateQuantity, removeItem, getTotalPaise } = useCartStore();

  if (!isOpen) return null;

  const totalPaise = getTotalPaise();
  const freeShippingThreshold = brandConfig.shipping.freeShippingThresholdPaise;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - totalPaise);
  const progressPercent = Math.min(100, Math.round((totalPaise / freeShippingThreshold) * 100));

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        onClick={closeCart}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <aside
          aria-label="Shopping Cart Drawer"
          className="w-screen max-w-md bg-[#FBF7F0] border-l border-[#E9DDC9] shadow-2xl flex flex-col animate-in slide-in-from-right duration-300"
        >
          {/* Drawer Header */}
          <div className="p-4 sm:p-5 border-b border-[#E9DDC9] flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-[#14372E]" />
              <h2 className="text-lg font-serif font-bold text-[#1C1B18]">
                {locale === "bn" ? "আপনার শপিং ব্যাগ" : "Your Shopping Bag"}
              </h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-[#E9DDC9] text-[#14372E]">
                {items.reduce((acc, i) => acc + i.quantity, 0)}
              </span>
            </div>
            <button
              onClick={closeCart}
              className="p-1.5 text-[#1C1B18]/60 hover:text-[#1C1B18] hover:bg-[#E9DDC9]/50 rounded-full transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="p-3 bg-[#E9DDC9]/40 border-b border-[#E9DDC9] text-xs">
            {remainingForFreeShipping > 0 ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-1.5 text-[#14372E] font-medium">
                  <Truck className="w-4 h-4 text-[#A8834A] shrink-0" />
                  <span>
                    {locale === "bn"
                      ? `আর মাত্র ${formatPrice(remainingForFreeShipping, locale)} টাকার কেনাকাটায় ফ্রি ডেলিভারি!`
                      : `Add ${formatPrice(remainingForFreeShipping, locale)} more to unlock FREE Express Delivery!`}
                  </span>
                </div>
                <div className="w-full bg-[#E9DDC9] h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-[#14372E] h-full transition-all duration-300"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-[#14372E] font-bold">
                <Truck className="w-4 h-4 text-[#14372E]" />
                <span>
                  {locale === "bn"
                    ? "🎉 অভিনন্দন! আপনি ফ্রি ডেলিভারি পাচ্ছেন।"
                    : "🎉 Congratulations! You have unlocked FREE Express Delivery."}
                </span>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-20 h-20 rounded-full bg-[#E9DDC9]/50 flex items-center justify-center text-[#A8834A]">
                  <ShoppingBag className="w-10 h-10" />
                </div>
                <h3 className="text-base font-semibold text-[#1C1B18]">
                  {locale === "bn" ? "আপনার ব্যাগটি খালি" : "Your bag is empty"}
                </h3>
                <p className="text-xs text-[#1C1B18]/70 max-w-xs">
                  {locale === "bn"
                    ? "আমাদের প্রিমিয়াম বোরকা, আবায়া ও শালীন পোশাকের নতুন কালেকশন ঘুরে দেখুন।"
                    : "Discover our premium collection of handcrafted abayas, burkhas and modest essentials."}
                </p>
                <Link
                  href={`/${locale}/shop`}
                  onClick={closeCart}
                  className="px-5 py-2.5 rounded-lg bg-[#14372E] text-[#FBF7F0] text-sm font-semibold hover:bg-[#14372E]/90 transition-all shadow-md"
                >
                  {locale === "bn" ? "কালেকশন দেখুন" : "Explore Collections"}
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-3 p-3 rounded-xl border border-[#E9DDC9] bg-white shadow-2xs"
                >
                  {/* Thumbnail */}
                  <div className="relative w-18 h-24 shrink-0 rounded-lg overflow-hidden bg-[#FBF7F0]">
                    <Image
                      src={item.imageUrl || "/placeholder-product.svg"}
                      alt={locale === "bn" ? item.titleBn : item.titleEn}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 flex flex-col justify-between min-w-0">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-sm font-medium text-[#1C1B18] line-clamp-1">
                          {locale === "bn" ? item.titleBn : item.titleEn}
                        </h4>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="text-[#1C1B18]/40 hover:text-red-600 p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2 text-[11px] text-[#1C1B18]/70 mt-1">
                        <span className="bg-[#FBF7F0] px-1.5 py-0.5 rounded border border-[#E9DDC9]">
                          {locale === "bn" ? `সাইজ: ${item.size}` : `Size: ${item.size}`}
                        </span>
                        <span className="bg-[#FBF7F0] px-1.5 py-0.5 rounded border border-[#E9DDC9]">
                          {locale === "bn" ? item.colorBn : item.colorEn}
                        </span>
                        {item.isCustomSize && (
                          <span className="bg-[#A8834A]/10 text-[#A8834A] px-1.5 py-0.5 rounded font-semibold border border-[#A8834A]/30">
                            {locale === "bn" ? "কাস্টম সেলাই (+₹১৫০)" : "Custom Tailored (+₹150)"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-[#E9DDC9] rounded-lg bg-[#FBF7F0]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-1 hover:bg-[#E9DDC9] text-[#1C1B18] transition-colors rounded-l-lg"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="px-2.5 text-xs font-bold text-[#1C1B18]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-1 hover:bg-[#E9DDC9] text-[#1C1B18] transition-colors rounded-r-lg"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-sm font-bold text-[#14372E]">
                        {formatPrice((item.pricePaise + (item.isCustomSize ? 15000 : 0)) * item.quantity, locale)}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer / Checkout CTA */}
          {items.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-[#E9DDC9] bg-white space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-[#1C1B18]/70">
                  {locale === "bn" ? "মোট মূল্য (জিএসটি সহ):" : "Subtotal (incl. GST):"}
                </span>
                <span className="text-lg font-bold text-[#14372E]">
                  {formatPrice(totalPaise, locale)}
                </span>
              </div>
              <p className="text-[11px] text-[#1C1B18]/50">
                {locale === "bn"
                  ? "ডেলিভারি চার্জ চেকআউটের সময় আপনার পিনকোড অনুযায়ী যোগ হবে।"
                  : "Shipping calculated at checkout based on your delivery pincode."}
              </p>

              <div className="grid grid-cols-2 gap-2 pt-1">
                <Link
                  href={`/${locale}/cart`}
                  onClick={closeCart}
                  className="w-full py-2.5 px-3 rounded-lg border border-[#14372E] text-[#14372E] text-center font-semibold text-xs sm:text-sm hover:bg-[#14372E]/5 transition-colors"
                >
                  {locale === "bn" ? "কার্ট দেখুন" : "View Cart"}
                </Link>
                <Link
                  href={`/${locale}/checkout`}
                  onClick={closeCart}
                  className="w-full py-2.5 px-3 rounded-lg bg-[#14372E] text-[#FBF7F0] text-center font-semibold text-xs sm:text-sm hover:bg-[#14372E]/90 transition-all shadow-md flex items-center justify-center gap-1.5 group"
                >
                  <span>{locale === "bn" ? "অর্ডার করুন" : "Checkout"}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
