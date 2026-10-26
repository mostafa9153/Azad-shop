"use client";

import Link from "next/link";
import Image from "next/image";
import { Locale, formatPrice } from "@/lib/i18n";
import { Product } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { Heart, ShoppingBag, Eye, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { QuickViewDialog } from "./quick-view-dialog";

interface ProductCardProps {
  product: Product;
  locale: Locale;
  priority?: boolean;
  onQuickView?: (product: Product) => void;
}

export function ProductCard({ product, locale, priority = false, onQuickView }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [internalQuickView, setInternalQuickView] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  const primaryImage = product.images?.[0]?.image_url || "/placeholder-product.svg";
  const secondaryImage = product.images?.[1]?.image_url || primaryImage;

  const defaultVariant = product.variants?.[0];
  const isLowStock = defaultVariant && defaultVariant.stock_quantity <= defaultVariant.low_stock_threshold;
  const isOutOfStock = defaultVariant && defaultVariant.stock_quantity <= 0;

  const inWishlist = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!defaultVariant || isOutOfStock) {
      toast.error(locale === "bn" ? "পণ্যটি বর্তমানে স্টকে নেই।" : "This item is currently out of stock.");
      return;
    }

    addItem({
      productId: product.id,
      variantId: defaultVariant.id,
      sku: defaultVariant.sku,
      titleEn: product.title_en,
      titleBn: product.title_bn,
      size: defaultVariant.size,
      colorEn: defaultVariant.color_en,
      colorBn: defaultVariant.color_bn,
      pricePaise: defaultVariant.price_paise,
      quantity: 1,
      imageUrl: primaryImage,
      isCustomSize: false,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    toast.success(
      locale === "bn"
        ? `"${product.title_bn}" শপিং ব্যাগে যুক্ত হয়েছে!`
        : `"${product.title_en}" added to your bag!`
    );
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    toggleItem({
      productId: product.id,
      slug: product.slug,
      titleEn: product.title_en,
      titleBn: product.title_bn,
      pricePaise: product.base_price_paise,
      imageUrl: primaryImage,
      categorySlug: product.category?.slug || "shop",
    });

    if (!inWishlist) {
      toast.info(
        locale === "bn"
          ? `পছন্দের তালিকায় সংরক্ষিত হয়েছে`
          : `Saved to your wishlist`
      );
    }
  };

  const handleOpenQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (onQuickView) {
      onQuickView(product);
    } else {
      setInternalQuickView(true);
    }
  };

  const discountPercent =
    product.compare_at_price_paise && product.compare_at_price_paise > product.base_price_paise
      ? Math.round(
          ((product.compare_at_price_paise - product.base_price_paise) / product.compare_at_price_paise) * 100
        )
      : null;

  return (
    <div
      className="group relative flex flex-col rounded-2xl bg-white border border-[#E9DDC9] hover:border-[#14372E] shadow-2xs hover:shadow-xl transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Mihrab Arch Shape Frame for Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#FBF7F0]">
        <Link href={`/${locale}/product/${product.slug}`} className="block w-full h-full">
          <Image
            src={isHovered ? secondaryImage : primaryImage}
            alt={locale === "bn" ? product.title_bn : product.title_en}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            priority={priority}
            className="object-cover transition-transform duration-700 group-hover:scale-105"
            unoptimized
          />
        </Link>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discountPercent && (
            <span className="px-2 py-0.5 rounded-md bg-[#A8834A] text-[#FBF7F0] text-[10px] font-bold shadow-xs">
              {locale === "bn" ? `${discountPercent}% ছাড়` : `${discountPercent}% OFF`}
            </span>
          )}
          {product.is_new && !discountPercent && (
            <span className="px-2 py-0.5 rounded-md bg-[#14372E] text-[#FBF7F0] text-[10px] font-bold shadow-xs">
              {locale === "bn" ? "নতুন" : "NEW"}
            </span>
          )}
          {product.is_bestseller && (
            <span className="px-2 py-0.5 rounded-md bg-[#C5A059] text-[#1C1B18] text-[10px] font-bold shadow-xs">
              {locale === "bn" ? "বেস্টসেলার" : "HOT"}
            </span>
          )}
          {isLowStock && !isOutOfStock && (
            <span className="px-2 py-0.5 rounded-md bg-amber-600 text-white text-[10px] font-semibold">
              {locale === "bn" ? "সীমিত স্টক" : "LOW STOCK"}
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 rounded-md bg-red-700 text-white text-[10px] font-bold">
              {locale === "bn" ? "স্টক শেষ" : "SOLD OUT"}
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 p-2 rounded-full backdrop-blur-xs transition-all shadow-xs ${
            inWishlist
              ? "bg-[#14372E] text-[#C5A059]"
              : "bg-white/80 text-[#1C1B18] hover:bg-white hover:text-[#14372E]"
          }`}
          aria-label="Wishlist"
        >
          <Heart className={`w-4 h-4 ${inWishlist ? "fill-current" : ""}`} />
        </button>

        {/* Floating Quick Action Overlay on Desktop */}
        <div className="absolute bottom-2.5 inset-x-2.5 hidden sm:flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
          <button
            onClick={handleQuickAdd}
            disabled={isOutOfStock}
            className={`flex-1 py-2 px-3 rounded-lg text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5 ${
              added
                ? "bg-green-700 text-white"
                : isOutOfStock
                ? "bg-gray-400 text-white cursor-not-allowed"
                : "bg-[#14372E] hover:bg-[#14372E]/90 text-[#FBF7F0]"
            }`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "যুক্ত হয়েছে" : "Added"}</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "ব্যাগে রাখুন" : "Quick Add"}</span>
              </>
            )}
          </button>
          <button
            type="button"
            onClick={handleOpenQuickView}
            className="p-2 rounded-lg bg-white/90 text-[#1C1B18] hover:bg-white hover:text-[#14372E] shadow-md transition-colors"
            title={locale === "bn" ? "দ্রুত দেখুন (কুইক ভিউ)" : "Quick View"}
            aria-label={locale === "bn" ? "দ্রুত দেখুন" : "Quick View"}
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-3.5 sm:p-4 flex flex-col flex-1 justify-between">
        <div>
          {/* Fabric subtitle */}
          <div className="flex items-center justify-between text-[11px] text-[#A8834A] font-semibold mb-1">
            <span>{locale === "bn" ? product.fabric_bn : product.fabric_en}</span>
            {product.allows_custom_size && (
              <span className="text-[10px] text-[#14372E]/70 font-medium">
                {locale === "bn" ? "কাস্টম সাইজ" : "Custom"}
              </span>
            )}
          </div>

          {/* Product Title */}
          <h3 className="text-sm font-medium text-[#1C1B18] group-hover:text-[#14372E] transition-colors line-clamp-2 leading-snug">
            <Link href={`/${locale}/product/${product.slug}`}>
              {locale === "bn" ? product.title_bn : product.title_en}
            </Link>
          </h3>
        </div>

        {/* Pricing & Mobile Quick Actions */}
        <div className="mt-3 pt-2.5 border-t border-[#E9DDC9]/60 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-base sm:text-lg font-bold text-[#14372E]">
                {formatPrice(product.base_price_paise, locale)}
              </span>
              {product.compare_at_price_paise && product.compare_at_price_paise > product.base_price_paise && (
                <span className="text-xs text-[#1C1B18]/40 line-through">
                  {formatPrice(product.compare_at_price_paise, locale)}
                </span>
              )}
            </div>
            <p className="text-[10px] text-[#1C1B18]/50">
              {locale === "bn" ? "জিএসটি অন্তর্ভুক্ত" : "GST incl."}
            </p>
          </div>

          {/* Mobile action buttons (< 640px) */}
          <div className="sm:hidden flex items-center gap-1.5">
            <button
              type="button"
              onClick={handleOpenQuickView}
              className="p-2 rounded-full bg-[#E9DDC9]/60 text-[#14372E] shadow-2xs active:scale-95 transition-transform"
              aria-label="Quick view"
              title={locale === "bn" ? "দ্রুত দেখুন" : "Quick View"}
            >
              <Eye className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={handleQuickAdd}
              disabled={isOutOfStock}
              className="p-2 rounded-full bg-[#14372E] text-[#FBF7F0] shadow-sm active:scale-95 transition-transform"
              aria-label="Add to cart"
            >
              {added ? <Check className="w-4 h-4 text-green-300" /> : <ShoppingBag className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* Internal Quick View Dialog when parent does not supply custom handler */}
      {!onQuickView && internalQuickView && (
        <QuickViewDialog
          product={product}
          isOpen={internalQuickView}
          onClose={() => setInternalQuickView(false)}
          locale={locale}
        />
      )}
    </div>
  );
}
