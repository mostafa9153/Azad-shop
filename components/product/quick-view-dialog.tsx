"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Locale, formatPrice } from "@/lib/i18n";
import { Product, ProductVariant } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, ShoppingBag, Heart, Check, Sparkles, Truck, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

interface QuickViewDialogProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export function QuickViewDialog({ product, isOpen, onClose, locale }: QuickViewDialogProps) {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    if (product) {
      setSelectedVariant(product.variants?.[0] || null);
      setSelectedImage(product.images?.[0]?.image_url || "/placeholder-product.svg");
      setAdded(false);
    }
  }, [product]);

  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  if (!product) return null;

  const currentVariant = selectedVariant || product.variants?.[0] || null;
  const currentImage = selectedImage || product.images?.[0]?.image_url || "/placeholder-product.svg";
  const inWishlist = isInWishlist(product.id);

  const isLowStock = Boolean(currentVariant && currentVariant.stock_quantity <= currentVariant.low_stock_threshold);
  const isOutOfStock = Boolean(currentVariant && currentVariant.stock_quantity <= 0);

  const handleAddToCart = () => {
    if (!currentVariant || isOutOfStock) return;

    addItem({
      productId: product.id,
      variantId: currentVariant.id,
      sku: currentVariant.sku,
      titleEn: product.title_en,
      titleBn: product.title_bn,
      size: currentVariant.size,
      colorEn: currentVariant.color_en,
      colorBn: currentVariant.color_bn,
      pricePaise: currentVariant.price_paise,
      quantity: 1,
      imageUrl: currentImage,
      isCustomSize: false,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);

    toast.success(
      locale === "bn"
        ? `"${product.title_bn}" ব্যাগে যুক্ত করা হয়েছে!`
        : `"${product.title_en}" added to your bag!`
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl bg-[#FBF7F0] p-0 border border-[#E9DDC9] rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sr-only">
          <DialogTitle>{locale === "bn" ? product.title_bn : product.title_en}</DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Images with Mihrab frame */}
          <div className="p-4 sm:p-6 bg-white border-r border-[#E9DDC9] flex flex-col justify-between">
            <div className="relative aspect-[3/4] w-full rounded-2xl overflow-hidden bg-[#FBF7F0] border border-[#E9DDC9]">
              <Image
                src={currentImage}
                alt={locale === "bn" ? product.title_bn : product.title_en}
                fill
                className="object-cover"
                unoptimized
              />
            </div>

            {/* Thumbnail switcher */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img.image_url)}
                    className={`relative w-14 h-16 rounded-lg overflow-hidden border-2 shrink-0 ${
                      currentImage === img.image_url ? "border-[#14372E]" : "border-transparent opacity-70"
                    }`}
                  >
                    <Image src={img.image_url} alt="" fill className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right: Info, Size Chips & Action Buttons */}
          <div className="p-6 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-[#A8834A] tracking-wider uppercase">
                  {locale === "bn" ? product.fabric_bn : product.fabric_en}
                </span>
                <button
                  onClick={() =>
                    toggleItem({
                      productId: product.id,
                      slug: product.slug,
                      titleEn: product.title_en,
                      titleBn: product.title_bn,
                      pricePaise: product.base_price_paise,
                      imageUrl: currentImage,
                      categorySlug: product.category?.slug || "shop",
                    })
                  }
                  className="p-1.5 rounded-full text-[#1C1B18]/60 hover:text-red-600 transition-colors"
                >
                  <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-600 text-red-600" : ""}`} />
                </button>
              </div>

              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#14372E] mt-1">
                {locale === "bn" ? product.title_bn : product.title_en}
              </h3>

              {/* Price */}
              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-2xl font-bold text-[#14372E]">
                  {formatPrice(currentVariant?.price_paise || product.base_price_paise, locale)}
                </span>
                {product.compare_at_price_paise && (
                  <span className="text-sm text-[#1C1B18]/40 line-through">
                    {formatPrice(product.compare_at_price_paise, locale)}
                  </span>
                )}
                <span className="text-[11px] text-[#1C1B18]/60 ml-1">
                  {locale === "bn" ? "(জিএসটি সহ)" : "(GST incl.)"}
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-[#1C1B18]/80 mt-3 leading-relaxed">
                {locale === "bn" ? product.short_desc_bn : product.short_desc_en}
              </p>

              {/* Size Select Chips */}
              {product.variants && product.variants.length > 0 && (
                <div className="mt-4 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-[#1C1B18]">
                      {locale === "bn" ? "সাইজ নির্বাচন করুন:" : "Select Size:"}
                    </span>
                    <span className="text-[#A8834A] font-semibold">
                      {currentVariant?.size} ({currentVariant?.color_bn || currentVariant?.color_en})
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {product.variants.map((v) => (
                      <button
                        key={v.id}
                        onClick={() => setSelectedVariant(v)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                          currentVariant?.id === v.id
                            ? "bg-[#14372E] text-[#FBF7F0] border-[#14372E] shadow-xs"
                            : "bg-white text-[#1C1B18] border-[#E9DDC9] hover:border-[#14372E]"
                        }`}
                      >
                        {v.size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Stock Status */}
              <div className="mt-3 text-xs">
                {isOutOfStock ? (
                  <span className="text-red-600 font-bold">
                    {locale === "bn" ? "❌ স্টক সমাপ্ত" : "❌ Out of Stock"}
                  </span>
                ) : isLowStock ? (
                  <span className="text-amber-700 font-semibold">
                    ⚠️ {locale === "bn" ? `মাত্র ${currentVariant?.stock_quantity}টি বাকি আছে!` : `Only ${currentVariant?.stock_quantity} left in stock!`}
                  </span>
                ) : (
                  <span className="text-green-700 font-semibold">
                    ✓ {locale === "bn" ? "স্টকে প্রস্তুত" : "In Stock & Ready to Ship"}
                  </span>
                )}
              </div>
            </div>

            {/* CTAs & Link */}
            <div className="space-y-2 pt-3 border-t border-[#E9DDC9]">
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`w-full py-3 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all shadow-md ${
                  added
                    ? "bg-green-700 text-white"
                    : isOutOfStock
                    ? "bg-gray-400 text-white cursor-not-allowed"
                    : "bg-[#14372E] hover:bg-[#14372E]/90 text-[#FBF7F0]"
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>{locale === "bn" ? "ব্যাগে যোগ হয়েছে" : "Added to Bag"}</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>{locale === "bn" ? "শপিং ব্যাগে রাখুন" : "Add to Bag"}</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <Link
                  href={`/${locale}/product/${product.slug}`}
                  onClick={onClose}
                  className="text-xs font-semibold text-[#14372E] hover:underline"
                >
                  {locale === "bn" ? "সম্পূর্ণ বিবরণ ও কাস্টম সাইজ ফর্ম দেখুন" : "View Full Details & Custom Sizing"} &rarr;
                </Link>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
