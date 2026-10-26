"use client";

import { useState } from "react";
import { Locale, formatPrice } from "@/lib/i18n";
import { Product, CustomMeasurements } from "@/lib/types";
import { useCartStore } from "@/lib/cart-store";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Scissors, Check, Sparkles } from "lucide-react";
import { toast } from "sonner";

interface CustomSizeModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export function CustomSizeModal({ product, isOpen, onClose, locale }: CustomSizeModalProps) {
  const [lengthInches, setLengthInches] = useState<number>(54);
  const [chestInches, setChestInches] = useState<number>(44);
  const [waistInches, setWaistInches] = useState<number>(40);
  const [hipsInches, setHipsInches] = useState<number>(48);
  const [shoulderInches, setShoulderInches] = useState<number>(16);
  const [sleeveInches, setSleeveInches] = useState<number>(24);
  const [specialNotes, setSpecialNotes] = useState<string>("");

  const { addItem, openCart } = useCartStore();

  const handleCustomAddToCart = (e: React.FormEvent) => {
    e.preventDefault();

    const measurements: CustomMeasurements = {
      length_inches: lengthInches,
      chest_inches: chestInches,
      waist_inches: waistInches,
      hips_inches: hipsInches,
      shoulder_inches: shoulderInches,
      sleeve_inches: sleeveInches,
      special_notes: specialNotes.trim() || undefined,
    };

    addItem({
      productId: product.id,
      sku: `${product.sku}-CUSTOM`,
      titleEn: `${product.title_en} (Custom Tailored)`,
      titleBn: `${product.title_bn} (কাস্টম সাইজ দরজি তৈরি)`,
      size: `Custom (${lengthInches}" L / ${chestInches}" C)`,
      colorEn: product.variants?.[0]?.color_en || "Standard",
      colorBn: product.variants?.[0]?.color_bn || "স্ট্যান্ডার্ড",
      pricePaise: product.base_price_paise,
      quantity: 1,
      imageUrl: product.images?.[0]?.image_url || "/placeholder-product.svg",
      isCustomSize: true,
      customMeasurements: measurements,
    });

    onClose();
    openCart();

    toast.success(
      locale === "bn"
        ? `কাস্টম সাইজের অর্ডার শপিং ব্যাগে যুক্ত হয়েছে! আমাদের দরজি আপনার মাপে পোশাকটি তৈরি করবেন।`
        : `Custom tailored order added to bag! Our master tailor will craft it to your exact measurements.`
    );
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-xl bg-[#FBF7F0] p-6 border border-[#E9DDC9] rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-[#14372E]">
            <Scissors className="w-5 h-5 text-[#A8834A]" />
            <DialogTitle className="font-serif text-xl sm:text-2xl font-bold">
              {locale === "bn" ? "কাস্টম সাইজ দরজি সেবা ফর্ম" : "Bespoke Custom Tailoring Form"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <form onSubmit={handleCustomAddToCart} className="space-y-5 mt-3">
          <div className="bg-[#14372E]/10 p-3.5 rounded-xl border border-[#14372E]/20 text-xs text-[#14372E] space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#A8834A]" />
              {locale === "bn" ? "দরজি সার্ভিস চার্জ: মাত্র ₹১৫০" : "Tailoring Charge: Flat ₹150"}
            </p>
            <p className="text-[#1C1B18]/70">
              {locale === "bn"
                ? "আমাদের কলকাতার নিজস্ব কারখানায় দক্ষ কারিগর দ্বারা সর্বোচ্চ ৪ কার্যদিবসের মধ্যে আপনার মাপ অনুযায়ী সেলাই করা হবে।"
                : "Handcrafted to your exact inches in our Kolkata atelier within 4 business days."}
            </p>
          </div>

          {/* Measurements grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
            {/* Length */}
            <div>
              <label className="block font-bold text-[#1C1B18] mb-1">
                {locale === "bn" ? "লম্বা (Length):" : "Length (Inches):"}
              </label>
              <input
                type="number"
                min="35"
                max="65"
                step="0.5"
                value={lengthInches}
                onChange={(e) => setLengthInches(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E9DDC9] rounded-lg px-3 py-2 text-sm font-semibold text-[#14372E] focus:outline-none focus:border-[#14372E]"
                required
              />
            </div>

            {/* Chest */}
            <div>
              <label className="block font-bold text-[#1C1B18] mb-1">
                {locale === "bn" ? "বুক (Chest):" : "Chest / Bust:"}
              </label>
              <input
                type="number"
                min="30"
                max="60"
                step="0.5"
                value={chestInches}
                onChange={(e) => setChestInches(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E9DDC9] rounded-lg px-3 py-2 text-sm font-semibold text-[#14372E] focus:outline-none focus:border-[#14372E]"
                required
              />
            </div>

            {/* Waist */}
            <div>
              <label className="block font-bold text-[#1C1B18] mb-1">
                {locale === "bn" ? "কোমর (Waist):" : "Waist (Inches):"}
              </label>
              <input
                type="number"
                min="26"
                max="56"
                step="0.5"
                value={waistInches}
                onChange={(e) => setWaistInches(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E9DDC9] rounded-lg px-3 py-2 text-sm font-semibold text-[#14372E] focus:outline-none focus:border-[#14372E]"
              />
            </div>

            {/* Hips */}
            <div>
              <label className="block font-bold text-[#1C1B18] mb-1">
                {locale === "bn" ? "হিপ (Hips):" : "Hips (Inches):"}
              </label>
              <input
                type="number"
                min="32"
                max="65"
                step="0.5"
                value={hipsInches}
                onChange={(e) => setHipsInches(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E9DDC9] rounded-lg px-3 py-2 text-sm font-semibold text-[#14372E] focus:outline-none focus:border-[#14372E]"
              />
            </div>

            {/* Shoulder */}
            <div>
              <label className="block font-bold text-[#1C1B18] mb-1">
                {locale === "bn" ? "কাঁধ (Shoulder):" : "Shoulder (Inches):"}
              </label>
              <input
                type="number"
                min="13"
                max="22"
                step="0.5"
                value={shoulderInches}
                onChange={(e) => setShoulderInches(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E9DDC9] rounded-lg px-3 py-2 text-sm font-semibold text-[#14372E] focus:outline-none focus:border-[#14372E]"
              />
            </div>

            {/* Sleeve */}
            <div>
              <label className="block font-bold text-[#1C1B18] mb-1">
                {locale === "bn" ? "হাতা (Sleeve):" : "Sleeve (Inches):"}
              </label>
              <input
                type="number"
                min="18"
                max="30"
                step="0.5"
                value={sleeveInches}
                onChange={(e) => setSleeveInches(parseFloat(e.target.value) || 0)}
                className="w-full bg-white border border-[#E9DDC9] rounded-lg px-3 py-2 text-sm font-semibold text-[#14372E] focus:outline-none focus:border-[#14372E]"
              />
            </div>
          </div>

          {/* Special instructions */}
          <div>
            <label className="block text-xs font-bold text-[#1C1B18] mb-1">
              {locale === "bn" ? "বিশেষ কোনো অনুরোধ (ঐচ্ছিক):" : "Special Tailoring Instructions (Optional):"}
            </label>
            <textarea
              value={specialNotes}
              onChange={(e) => setSpecialNotes(e.target.value)}
              placeholder={
                locale === "bn"
                  ? "যেমন: হাতায় ইলাস্টিকের বদলে বোতাম চাই, অথবা দুই পাশে গভীর পকেট দিন..."
                  : "e.g. Button cuffs instead of elastic, extra deep pockets, maternity zip..."
              }
              rows={2}
              className="w-full bg-white border border-[#E9DDC9] rounded-lg p-2.5 text-xs text-[#1C1B18] placeholder:text-[#1C1B18]/40 focus:outline-none focus:border-[#14372E]"
            />
          </div>

          {/* Action Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-4 rounded-xl bg-[#14372E] hover:bg-[#14372E]/90 text-[#FBF7F0] font-bold text-sm shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Check className="w-4 h-4" />
            <span>
              {locale === "bn"
                ? `কাস্টম মাপে শপিং ব্যাগে রাখুন (${formatPrice(product.base_price_paise + 15000, locale)})`
                : `Add Custom Tailored to Bag (${formatPrice(product.base_price_paise + 15000, locale)})`}
            </span>
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
