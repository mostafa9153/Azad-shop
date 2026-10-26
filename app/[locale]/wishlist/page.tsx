"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import { Locale, formatPrice } from "@/lib/i18n";
import { useWishlistStore } from "@/lib/wishlist-store";
import { useCartStore } from "@/lib/cart-store";
import { Heart, Trash2, ShoppingBag, Share2, ArrowRight, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

export default function WishlistPage() {
  const params = useParams();
  const locale = ((params?.locale as string) || "bn") as Locale;

  const { items, removeItem, clearWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [copied, setCopied] = useState(false);

  const handleMoveToBag = (item: any) => {
    addItem({
      productId: item.productId,
      sku: `${item.slug}-STD`,
      titleEn: item.titleEn,
      titleBn: item.titleBn,
      size: "Free Size",
      colorEn: "Standard",
      colorBn: "স্ট্যান্ডার্ড",
      pricePaise: item.pricePaise,
      quantity: 1,
      imageUrl: item.imageUrl,
      isCustomSize: false,
    });
    removeItem(item.productId);
    toast.success(
      locale === "bn"
        ? `"${item.titleBn}" শপিং ব্যাগে যুক্ত হয়েছে!`
        : `"${item.titleEn}" moved to your bag!`
    );
  };

  const handleShareWishlist = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success(
        locale === "bn"
          ? "পছন্দের তালিকার লিংক কপি করা হয়েছে! প্রিয়জনদের সাথে শেয়ার করুন।"
          : "Wishlist link copied to clipboard!"
      );
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-[#E9DDC9]/50 mx-auto flex items-center justify-center text-[#A8834A]">
          <Heart className="w-12 h-12" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-[#14372E]">
          {locale === "bn" ? "আপনার পছন্দের তালিকা খালি" : "Your Wishlist is Empty"}
        </h1>
        <p className="text-sm text-[#1C1B18]/70 max-w-md mx-auto">
          {locale === "bn"
            ? "আপনার পছন্দের বোরকা, আবায়া বা হিজাব সেভ করে রাখুন এবং যেকোনো সময় সহজে ব্যাগে যুক্ত করুন।"
            : "Save items you love so you can find them easily later and add them straight to your bag."}
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
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E9DDC9]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14372E]">
            {locale === "bn" ? "আপনার পছন্দের তালিকা" : "My Wishlist"}
          </h1>
          <p className="text-xs sm:text-sm text-[#1C1B18]/70 mt-1">
            {locale === "bn"
              ? `মোট ${items.length}টি পোশাক সংরক্ষিত রয়েছে`
              : `${items.length} modest items saved for later`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleShareWishlist}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-[#E9DDC9] text-xs font-bold text-[#14372E] hover:bg-[#E9DDC9]/40 transition-colors shadow-2xs"
          >
            {copied ? <Check className="w-4 h-4 text-green-700" /> : <Share2 className="w-4 h-4" />}
            <span>{copied ? (locale === "bn" ? "কপি হয়েছে" : "Copied!") : locale === "bn" ? "শেয়ার করুন" : "Share Wishlist"}</span>
          </button>
          <button
            onClick={clearWishlist}
            className="px-3 py-2 text-xs font-semibold text-red-600 hover:underline"
          >
            {locale === "bn" ? "সব মুছুন" : "Clear All"}
          </button>
        </div>
      </div>

      {/* Grid of Wishlist Items */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
        {items.map((item) => (
          <div
            key={item.productId}
            className="group relative flex flex-col rounded-2xl bg-white border border-[#E9DDC9] hover:border-[#14372E] shadow-2xs hover:shadow-lg transition-all duration-300 overflow-hidden"
          >
            <div className="relative aspect-[3/4] w-full bg-[#FBF7F0] overflow-hidden">
              <Link href={`/${locale}/product/${item.slug}`} className="block w-full h-full">
                <Image
                  src={item.imageUrl || "/placeholder-product.svg"}
                  alt={locale === "bn" ? item.titleBn : item.titleEn}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  unoptimized
                />
              </Link>

              {/* Remove button */}
              <button
                onClick={() => removeItem(item.productId)}
                className="absolute top-2.5 right-2.5 p-2 rounded-full bg-white/80 hover:bg-white text-[#1C1B18]/60 hover:text-red-600 shadow-xs transition-colors"
                aria-label="Remove"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
              <div>
                <h3 className="font-serif text-sm sm:text-base font-bold text-[#1C1B18] group-hover:text-[#14372E] line-clamp-1">
                  <Link href={`/${locale}/product/${item.slug}`}>
                    {locale === "bn" ? item.titleBn : item.titleEn}
                  </Link>
                </h3>
                <p className="text-base font-bold text-[#14372E] mt-1">
                  {formatPrice(item.pricePaise, locale)}
                </p>
              </div>

              <button
                onClick={() => handleMoveToBag(item)}
                className="w-full py-2.5 px-3 rounded-xl bg-[#14372E] hover:bg-[#14372E]/90 text-[#FBF7F0] font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "ব্যাগে নিয়ে যান" : "Move to Bag"}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
