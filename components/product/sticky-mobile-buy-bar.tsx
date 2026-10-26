"use client";

import { Locale, formatPrice } from "@/lib/i18n";
import { Product, ProductVariant } from "@/lib/types";
import { ShoppingBag, Check } from "lucide-react";
import { useState } from "react";

interface StickyMobileBuyBarProps {
  product: Product;
  selectedVariant: ProductVariant | null;
  onAddToCart: () => void;
  locale: Locale;
}

export function StickyMobileBuyBar({
  product,
  selectedVariant,
  onAddToCart,
  locale,
}: StickyMobileBuyBarProps) {
  const [clicked, setClicked] = useState(false);
  const isOutOfStock = Boolean(selectedVariant && selectedVariant.stock_quantity <= 0);

  const handleClick = () => {
    onAddToCart();
    setClicked(true);
    setTimeout(() => setClicked(false), 1500);
  };

  return (
    <div className="sm:hidden fixed bottom-[calc(4rem+env(safe-area-inset-bottom))] left-0 right-0 z-30 bg-[#FBF7F0]/95 backdrop-blur-md border-t border-[#E9DDC9] p-3 shadow-2xl flex items-center justify-between gap-3 animate-in slide-in-from-bottom duration-200">
      <div>
        <span className="text-base font-bold text-[#14372E]">
          {formatPrice(selectedVariant?.price_paise || product.base_price_paise, locale)}
        </span>
        <div className="text-[10px] text-[#A8834A] font-semibold">
          {selectedVariant ? `${selectedVariant.size} • ${selectedVariant.color_bn || selectedVariant.color_en}` : "Free Size"}
        </div>
      </div>

      <button
        onClick={handleClick}
        disabled={isOutOfStock}
        className={`flex-1 py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all ${
          clicked
            ? "bg-green-700 text-white"
            : isOutOfStock
            ? "bg-gray-400 text-white cursor-not-allowed"
            : "bg-[#14372E] text-[#FBF7F0] active:scale-95"
        }`}
      >
        {clicked ? (
          <>
            <Check className="w-4 h-4" />
            <span>{locale === "bn" ? "যুক্ত হয়েছে" : "Added"}</span>
          </>
        ) : (
          <>
            <ShoppingBag className="w-4 h-4" />
            <span>{locale === "bn" ? "ব্যাগে রাখুন" : "Add to Bag"}</span>
          </>
        )}
      </button>
    </div>
  );
}
