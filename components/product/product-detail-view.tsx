"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Locale, formatPrice } from "@/lib/i18n";
import { Product, ProductVariant, Review } from "@/lib/types";
import { brandConfig } from "@/config/brand.config";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { ProductGallery } from "./product-gallery";
import { ProductCard } from "./product-card";
import { SizeGuideModal } from "./size-guide-modal";
import { CustomSizeModal } from "./custom-size-modal";
import { StickyMobileBuyBar } from "./sticky-mobile-buy-bar";
import { ProductReviews } from "./product-reviews";
import {
  Heart,
  ShoppingBag,
  Ruler,
  Scissors,
  Truck,
  RotateCcw,
  ShieldCheck,
  Check,
  MessageCircle,
  Plus,
  Minus,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface ProductDetailViewProps {
  product: Product;
  relatedProducts: Product[];
  reviews: Review[];
  locale: Locale;
}

export function ProductDetailView({
  product,
  relatedProducts,
  reviews,
  locale,
}: ProductDetailViewProps) {
  const router = useRouter();
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(
    product.variants?.[0] || null
  );
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isCustomSizeOpen, setIsCustomSizeOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"desc" | "fabric" | "care" | "shipping">("desc");
  const [added, setAdded] = useState(false);

  const { addItem, openCart } = useCartStore();
  const { toggleItem, isInWishlist } = useWishlistStore();

  const inWishlist = isInWishlist(product.id);
  const isOutOfStock = Boolean(selectedVariant && selectedVariant.stock_quantity <= 0);
  const isLowStock = Boolean(
    selectedVariant &&
      selectedVariant.stock_quantity > 0 &&
      selectedVariant.stock_quantity <= selectedVariant.low_stock_threshold
  );

  const handleAddToCart = () => {
    if (!selectedVariant || isOutOfStock) return;

    addItem({
      productId: product.id,
      variantId: selectedVariant.id,
      sku: selectedVariant.sku,
      titleEn: product.title_en,
      titleBn: product.title_bn,
      size: selectedVariant.size,
      colorEn: selectedVariant.color_en,
      colorBn: selectedVariant.color_bn,
      pricePaise: selectedVariant.price_paise,
      quantity,
      imageUrl: product.images?.[0]?.image_url || "/placeholder-product.svg",
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

  const handleBuyNow = () => {
    handleAddToCart();
    router.push(`/${locale}/checkout`);
  };

  const handleWhatsAppOrder = () => {
    const sizeStr = selectedVariant?.size || "Standard";
    const colorStr = selectedVariant?.color_bn || selectedVariant?.color_en || "Default";
    const priceStr = formatPrice(selectedVariant?.price_paise || product.base_price_paise, locale);

    const message =
      locale === "bn"
        ? `আসসালামু আলাইকুম, আমি আজাদ হায়া থেকে অর্ডার করতে চাই:\n\n*পণ্য:* ${product.title_bn}\n*এসকেইউ:* ${selectedVariant?.sku || product.sku}\n*সাইজ:* ${sizeStr}\n*রঙ:* ${colorStr}\n*মূল্য:* ${priceStr}\n\nঅনুগ্রহ করে ডেলিভারি প্রক্রিয়া শুরু করুন।`
        : `Assalamu Alaikum, I would like to order from AZAD HAYA:\n\n*Product:* ${product.title_en}\n*SKU:* ${selectedVariant?.sku || product.sku}\n*Size:* ${sizeStr}\n*Color:* ${colorStr}\n*Price:* ${priceStr}\n\nPlease proceed with my delivery.`;

    window.open(`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center gap-2 text-xs text-[#1C1B18]/60 mb-6">
        <Link href={`/${locale}`} className="hover:text-[#14372E] font-medium">
          {locale === "bn" ? "হোম" : "Home"}
        </Link>
        <span>/</span>
        <Link href={`/${locale}/shop`} className="hover:text-[#14372E] font-medium">
          {locale === "bn" ? "শপ" : "Shop"}
        </Link>
        {product.category && (
          <>
            <span>/</span>
            <Link
              href={`/${locale}/shop?category=${product.category.slug}`}
              className="hover:text-[#14372E] font-medium"
            >
              {locale === "bn" ? product.category.name_bn : product.category.name_en}
            </Link>
          </>
        )}
        <span>/</span>
        <span className="text-[#14372E] font-bold truncate max-w-[200px]">
          {locale === "bn" ? product.title_bn : product.title_en}
        </span>
      </nav>

      {/* Main 2-Column Product Detail Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery (5 cols on lg) */}
        <div className="lg:col-span-5">
          <ProductGallery
            images={product.images || []}
            title={locale === "bn" ? product.title_bn : product.title_en}
          />
        </div>

        {/* Right: Purchasing Console (7 cols on lg) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            {/* Fabric Tag & SKU */}
            <div className="flex items-center justify-between text-xs text-[#A8834A] font-bold tracking-wider uppercase mb-1.5">
              <span>{locale === "bn" ? product.fabric_bn : product.fabric_en}</span>
              <span className="font-mono text-[11px] text-[#1C1B18]/40">{product.sku}</span>
            </div>

            {/* Title */}
            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14372E] leading-tight">
              {locale === "bn" ? product.title_bn : product.title_en}
            </h1>

            {/* Price block */}
            <div className="mt-3 flex items-baseline gap-3">
              <span className="text-2xl sm:text-3xl font-bold text-[#14372E]">
                {formatPrice(selectedVariant?.price_paise || product.base_price_paise, locale)}
              </span>
              {product.compare_at_price_paise && product.compare_at_price_paise > product.base_price_paise && (
                <span className="text-sm sm:text-base text-[#1C1B18]/40 line-through">
                  {formatPrice(product.compare_at_price_paise, locale)}
                </span>
              )}
              <span className="text-xs text-[#1C1B18]/60">
                {locale === "bn" ? "(জিএসটি অন্তর্ভুক্ত)" : "(GST inclusive)"}
              </span>
            </div>
          </div>

          {/* Short description */}
          <p className="text-xs sm:text-sm text-[#1C1B18]/80 leading-relaxed border-y border-[#E9DDC9] py-3">
            {locale === "bn" ? product.short_desc_bn : product.short_desc_en}
          </p>

          {/* Size Selector with Size Guide Helper */}
          {product.variants && product.variants.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-[#1C1B18]">
                  {locale === "bn" ? "সাইজ নির্বাচন করুন:" : "Choose Size:"}
                </span>
                <button
                  type="button"
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="text-[#14372E] hover:text-[#A8834A] font-semibold underline flex items-center gap-1"
                >
                  <Ruler className="w-3.5 h-3.5 text-[#A8834A]" />
                  <span>{locale === "bn" ? "সাইজ চার্ট ও নির্দেশিকা" : "Size Guide"}</span>
                </button>
              </div>

              <div className="flex flex-wrap gap-2.5">
                {product.variants.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => setSelectedVariant(v)}
                    className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold border transition-all ${
                      selectedVariant?.id === v.id
                        ? "bg-[#14372E] text-[#FBF7F0] border-[#14372E] shadow-sm"
                        : "bg-white text-[#1C1B18] border-[#E9DDC9] hover:border-[#14372E]"
                    }`}
                  >
                    <span>{v.size}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Custom Size Tailoring Banner / Modal Trigger */}
          {product.allows_custom_size && (
            <div className="bg-[#E9DDC9]/40 border border-[#A8834A]/40 rounded-2xl p-4 flex items-center justify-between gap-4">
              <div className="space-y-0.5">
                <h4 className="text-xs sm:text-sm font-bold text-[#14372E] flex items-center gap-1.5">
                  <Scissors className="w-4 h-4 text-[#A8834A]" />
                  <span>{locale === "bn" ? "কাস্টম সাইজ দরজি সেবা" : "Bespoke Custom Tailoring"}</span>
                </h4>
                <p className="text-[11px] text-[#1C1B18]/70">
                  {locale === "bn"
                    ? "আপনার নিজস্ব উচ্চতা ও মাপে তৈরি করতে চান? মাত্র ₹১৫০ অতিরিক্ত সেলাই চার্জ।"
                    : "Need bespoke height or chest tailoring? Crafted in our atelier for only +₹150."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setIsCustomSizeOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-[#14372E] text-[#FBF7F0] text-xs font-bold hover:bg-[#14372E]/90 shrink-0 shadow-xs transition-colors"
              >
                {locale === "bn" ? "পরিমাপ দিন" : "Customize"}
              </button>
            </div>
          )}

          {/* Stock Indicator */}
          <div className="text-xs">
            {isOutOfStock ? (
              <span className="font-bold text-red-600">
                {locale === "bn" ? "❌ বর্তমানে স্টক সমাপ্ত" : "❌ Out of Stock"}
              </span>
            ) : isLowStock ? (
              <span className="font-bold text-amber-700">
                ⚠️ {locale === "bn" ? `মাত্র ${selectedVariant?.stock_quantity}টি বাকি রয়েছে — দ্রুত অর্ডার করুন!` : `Only ${selectedVariant?.stock_quantity} left in stock — order soon!`}
              </span>
            ) : (
              <span className="font-semibold text-green-700 flex items-center gap-1.5">
                <Check className="w-4 h-4" />
                <span>{locale === "bn" ? "স্টকে প্রস্তুত • আজই পাঠানোর জন্য প্রস্তুত" : "In Stock • Ready to dispatch"}</span>
              </span>
            )}
          </div>

          {/* Quantity Selector & Action Buttons */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity */}
              <div className="flex items-center border border-[#E9DDC9] rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="p-2 hover:bg-[#E9DDC9]/50 rounded-lg text-[#1C1B18] transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 text-sm font-bold text-[#14372E]">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(10, q + 1))}
                  className="p-2 hover:bg-[#E9DDC9]/50 rounded-lg text-[#1C1B18] transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>

              {/* Add to Bag */}
              <button
                onClick={handleAddToCart}
                disabled={isOutOfStock}
                className={`flex-1 py-3.5 px-5 rounded-xl font-bold text-xs sm:text-sm shadow-md transition-all flex items-center justify-center gap-2 ${
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

              {/* Wishlist Heart */}
              <button
                onClick={() =>
                  toggleItem({
                    productId: product.id,
                    slug: product.slug,
                    titleEn: product.title_en,
                    titleBn: product.title_bn,
                    pricePaise: product.base_price_paise,
                    imageUrl: product.images?.[0]?.image_url || "/placeholder-product.svg",
                    categorySlug: product.category?.slug || "shop",
                  })
                }
                className="p-3.5 rounded-xl border border-[#E9DDC9] bg-white hover:border-[#14372E] transition-colors"
                aria-label="Wishlist"
              >
                <Heart className={`w-5 h-5 ${inWishlist ? "fill-red-600 text-red-600" : "text-[#1C1B18]"}`} />
              </button>
            </div>

            {/* Buy Now & WhatsApp Direct Order */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <button
                onClick={handleBuyNow}
                disabled={isOutOfStock}
                className="w-full py-3 px-4 rounded-xl bg-[#A8834A] hover:bg-[#805F2B] text-white font-bold text-xs sm:text-sm shadow-md transition-colors"
              >
                {locale === "bn" ? "এখনই কিনুন (সরাসরি চেকআউট)" : "Buy Now (Direct Checkout)"}
              </button>

              <button
                onClick={handleWhatsAppOrder}
                className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm shadow-md transition-colors flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>{locale === "bn" ? "হোয়াটসঅ্যাপে অর্ডার করুন" : "Order on WhatsApp"}</span>
              </button>
            </div>
          </div>

          {/* Delivery & Assurance Strip */}
          <div className="grid grid-cols-3 gap-2 pt-3 text-center border-t border-[#E9DDC9]">
            <div className="p-2 rounded-xl bg-white border border-[#E9DDC9] space-y-1">
              <Truck className="w-4 h-4 text-[#A8834A] mx-auto" />
              <p className="text-[10px] font-bold text-[#14372E]">
                {locale === "bn" ? "ফ্রি এক্সপ্রেস ডেলিভারি" : "Free Delivery"}
              </p>
              <p className="text-[9px] text-[#1C1B18]/60">₹১,৪৯৯-এর উপরে</p>
            </div>

            <div className="p-2 rounded-xl bg-white border border-[#E9DDC9] space-y-1">
              <RotateCcw className="w-4 h-4 text-[#A8834A] mx-auto" />
              <p className="text-[10px] font-bold text-[#14372E]">
                {locale === "bn" ? "৭ দিনের রিটার্ন" : "7-Day Returns"}
              </p>
              <p className="text-[9px] text-[#1C1B18]/60">সহজ পলিসি</p>
            </div>

            <div className="p-2 rounded-xl bg-white border border-[#E9DDC9] space-y-1">
              <ShieldCheck className="w-4 h-4 text-[#A8834A] mx-auto" />
              <p className="text-[10px] font-bold text-[#14372E]">
                {locale === "bn" ? "ক্যাশ অন ডেলিভারি" : "COD Available"}
              </p>
              <p className="text-[9px] text-[#1C1B18]/60">সারা বাংলায়</p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs: Description, Fabric & Care, Shipping */}
      <div className="mt-14 pt-8 border-t border-[#E9DDC9]">
        <div className="flex border-b border-[#E9DDC9] gap-4 sm:gap-8 overflow-x-auto">
          {[
            { id: "desc", bn: "বিস্তারিত বর্ণনা", en: "Description" },
            { id: "fabric", bn: "ফেব্রিক ও উপাদান", en: "Fabric & Material" },
            { id: "care", bn: "যত্ন নির্দেশিকা", en: "Care Instructions" },
            { id: "shipping", bn: "ডেলিভারি ও রিটার্ন", en: "Shipping & Returns" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 text-xs sm:text-sm font-bold transition-all relative shrink-0 ${
                activeTab === tab.id
                  ? "text-[#14372E] after:w-full after:h-0.5 after:bg-[#14372E] after:absolute after:bottom-0 after:left-0"
                  : "text-[#1C1B18]/60 hover:text-[#1C1B18]"
              }`}
            >
              {locale === "bn" ? tab.bn : tab.en}
            </button>
          ))}
        </div>

        <div className="py-6 text-xs sm:text-sm text-[#1C1B18]/80 leading-relaxed max-w-3xl">
          {activeTab === "desc" && (
            <p>{locale === "bn" ? product.description_bn : product.description_en}</p>
          )}

          {activeTab === "fabric" && (
            <div className="space-y-2">
              <p>
                <strong>{locale === "bn" ? "প্রধান ফেব্রিক:" : "Primary Fabric:"}</strong>{" "}
                {locale === "bn" ? product.fabric_bn : product.fabric_en}
              </p>
              <p>
                <strong>{locale === "bn" ? "প্যাটার্ন:" : "Silhouette Pattern:"}</strong> {product.pattern}
              </p>
              <p>
                {locale === "bn"
                  ? "আজাদ হায়ার প্রতিটি পোশাক শতভাগ স্বচ্ছতাহীন এবং শরীরের সাথে সেঁটে না থাকা শালীন নিয়ম মেনে তৈরি।"
                  : "All AZAD HAYA modest garments are opaque, breathable, and designed for optimal non-clinging modest drape."}
              </p>
            </div>
          )}

          {activeTab === "care" && (
            <div className="space-y-2">
              <p>{locale === "bn" ? product.care_instructions_bn : product.care_instructions_en}</p>
            </div>
          )}

          {activeTab === "shipping" && (
            <div className="space-y-2">
              <p>
                {locale === "bn"
                  ? "কলকাতা ও পার্শ্ববর্তী জেলায় ১-২ কার্যদিবস এবং পশ্চিমবঙ্গের অন্যান্য অঞ্চলে ২-৪ দিনের মধ্যে ডেলিভারি সম্পন্ন হয়।"
                  : "Orders dispatched across Kolkata and West Bengal within 1–3 business days with express courier tracking."}
              </p>
              <p>
                {locale === "bn"
                  ? "পণ্য প্রাপ্তির ৭ দিনের মধ্যে সাইজ বা ফিটিং পরিবর্তনের জন্য আবেদন করা যাবে।"
                  : "Exchange or return within 7 days of delivery if size or fit requires adjustment."}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Customer Reviews Section */}
      <ProductReviews productId={product.id} initialReviews={reviews} locale={locale} />

      {/* Related Products Grid */}
      {relatedProducts.length > 0 && (
        <section className="mt-16 pt-12 border-t border-[#E9DDC9]">
          <h3 className="font-serif text-2xl font-bold text-[#14372E] mb-6">
            {locale === "bn" ? "আরও সদৃশ শালীন পোশাক" : "You May Also Like"}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.slice(0, 4).map((p) => (
              <ProductCard key={p.id} product={p} locale={locale} />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Mobile Buy Bar */}
      <StickyMobileBuyBar
        product={product}
        selectedVariant={selectedVariant}
        onAddToCart={handleAddToCart}
        locale={locale}
      />

      {/* Modals */}
      <SizeGuideModal
        isOpen={isSizeGuideOpen}
        onClose={() => setIsSizeGuideOpen(false)}
        categorySlug={product.category?.slug}
        locale={locale}
      />

      {product.allows_custom_size && (
        <CustomSizeModal
          product={product}
          isOpen={isCustomSizeOpen}
          onClose={() => setIsCustomSizeOpen(false)}
          locale={locale}
        />
      )}
    </div>
  );
}
