"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { Category, Collection, Product, ProductVariant } from "@/lib/types";
import {
  Upload,
  Plus,
  Trash2,
  Sparkles,
  Save,
  ArrowLeft,
  CheckCircle2,
  AlertCircle,
  Wand2,
} from "lucide-react";
import Link from "next/link";

interface ProductEditorProps {
  locale: Locale;
  initialProduct?: Product;
  categories: Category[];
  collections: Collection[];
}

const COMMON_SIZES = ["52", "54", "56", "58", "Free Size", "M", "L", "XL", "XXL"];
const COMMON_COLORS = [
  { name_en: "Black", name_bn: "কালো", hex: "#1C1B18" },
  { name_en: "Deep Forest", name_bn: "গাঢ় বন সবুজ", hex: "#14372E" },
  { name_en: "Sand Beige", name_bn: "বালুকা বাদামি", hex: "#E9DDC9" },
  { name_en: "Dusty Rose", name_bn: "গোলাপি আভা", hex: "#C49A88" },
  { name_en: "Antique Gold", name_bn: "সোনারঙ", hex: "#A8834A" },
  { name_en: "Navy Blue", name_bn: "নেভি ব্লু", hex: "#1E2A38" },
  { name_en: "Plum Maroon", name_bn: "মেরুন", hex: "#4A1E2B" },
];

export function ProductEditor({
  locale,
  initialProduct,
  categories,
  collections,
}: ProductEditorProps) {
  const router = useRouter();
  const isEditing = Boolean(initialProduct);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [titleBn, setTitleBn] = useState(initialProduct?.title_bn || "");
  const [titleEn, setTitleEn] = useState(initialProduct?.title_en || "");
  const [slug, setSlug] = useState(initialProduct?.slug || "");
  const [sku, setSku] = useState(initialProduct?.sku || "");
  const [categoryId, setCategoryId] = useState(initialProduct?.category_id || categories[0]?.id || "");
  const [collectionSlug, setCollectionSlug] = useState(initialProduct?.collections?.[0] || "");
  const [basePrice, setBasePrice] = useState(
    initialProduct ? (initialProduct.base_price_paise / 100).toString() : "2499"
  );
  const [comparePrice, setComparePrice] = useState(
    initialProduct?.compare_at_price_paise ? (initialProduct.compare_at_price_paise / 100).toString() : "2999"
  );
  const [fabricBn, setFabricBn] = useState(initialProduct?.fabric_bn || "কোরিয়ান প্রিমিয়াম নিদা ফ্যাব্রিক");
  const [fabricEn, setFabricEn] = useState(initialProduct?.fabric_en || "Korean Premium Nida Fabric");
  const [careBn, setCareBn] = useState(
    initialProduct?.care_instructions_bn || "শুধুমাত্র ড্রাই ক্লিন অথবা মৃদু হাতে ওয়াশ"
  );
  const [careEn, setCareEn] = useState(
    initialProduct?.care_instructions_en || "Dry clean or gentle hand wash only"
  );
  const [descBn, setDescBn] = useState(
    initialProduct?.description_bn || "শালীন ও মার্জিত ডিজাইনের অনন্য কালেকশন।"
  );
  const [descEn, setDescEn] = useState(
    initialProduct?.description_en || "Elegant, modest silhouette crafted with artisanal precision."
  );
  const [isFeatured, setIsFeatured] = useState(initialProduct?.is_featured || false);
  const [isNew, setIsNew] = useState(initialProduct?.is_new ?? true);
  const [isBestseller, setIsBestseller] = useState(initialProduct?.is_bestseller || false);
  const [allowCustom, setAllowCustom] = useState(initialProduct?.allows_custom_size ?? true);

  // Images state
  const existingImages = initialProduct?.images?.map((img) => img.image_url) || [];
  const [images, setImages] = useState<string[]>(
    existingImages.length > 0
      ? existingImages
      : ["/demo/abayas/zahra-front.svg", "/demo/abayas/zahra-detail.svg"]
  );
  const [uploadingImage, setUploadingImage] = useState(false);

  // Variants state
  const [variants, setVariants] = useState<Partial<ProductVariant>[]>(
    initialProduct?.variants && initialProduct.variants.length > 0
      ? initialProduct.variants
      : [
          {
            id: "var-1",
            sku: `${sku || "AZD"}-54-BLK`,
            size: "54",
            color_en: "Black",
            color_bn: "কালো",
            color_hex: "#1C1B18",
            price_paise: 249900,
            stock_quantity: 12,
            low_stock_threshold: 3,
            is_active: true,
          },
          {
            id: "var-2",
            sku: `${sku || "AZD"}-56-BLK`,
            size: "56",
            color_en: "Black",
            color_bn: "কালো",
            color_hex: "#1C1B18",
            price_paise: 249900,
            stock_quantity: 8,
            low_stock_threshold: 3,
            is_active: true,
          },
        ]
  );

  // Matrix Generator modal/state
  const [selectedGenSizes, setSelectedGenSizes] = useState<string[]>(["52", "54", "56", "58"]);
  const [selectedGenColors, setSelectedGenColors] = useState<string[]>(["Black", "Deep Forest", "Sand Beige"]);
  const [defaultStock, setDefaultStock] = useState("10");

  const handleAutoSlug = (text: string) => {
    setTitleEn(text);
    if (!isEditing) {
      const generated = text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)+/g, "");
      setSlug(generated);
      if (!sku) {
        setSku(`AZD-${generated.slice(0, 4).toUpperCase()}`);
      }
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.url) {
        setImages((prev) => [...prev, data.url]);
      } else {
        alert(data.error || "Image upload failed");
      }
    } catch (err: any) {
      alert(err.message || "Upload error");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleGenerateMatrix = () => {
    const baseSkuClean = sku || "AZD";
    const currentPricePaise = Math.round(parseFloat(basePrice || "2499") * 100);
    const newVariants: Partial<ProductVariant>[] = [];

    selectedGenSizes.forEach((size) => {
      selectedGenColors.forEach((colorName) => {
        const colorObj = COMMON_COLORS.find((c) => c.name_en === colorName) || {
          name_en: colorName,
          name_bn: colorName,
          hex: "#1C1B18",
        };
        const colorCode = colorName.slice(0, 3).toUpperCase();
        const sizeCode = size.replace(/\s+/g, "");

        newVariants.push({
          id: `var-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
          sku: `${baseSkuClean}-${sizeCode}-${colorCode}`,
          size,
          color_en: colorObj.name_en,
          color_bn: colorObj.name_bn,
          color_hex: colorObj.hex,
          price_paise: currentPricePaise,
          stock_quantity: parseInt(defaultStock, 10) || 10,
          low_stock_threshold: 3,
          is_active: true,
        });
      });
    });

    setVariants(newVariants);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const parsedBasePrice = Math.round(parseFloat(basePrice) * 100);
      const parsedCompare = comparePrice ? Math.round(parseFloat(comparePrice) * 100) : null;

      const payload = {
        product: {
          title_bn: titleBn,
          title_en: titleEn,
          slug,
          sku,
          category_id: categoryId,
          collections: collectionSlug ? [collectionSlug] : [],
          base_price_paise: parsedBasePrice,
          compare_at_price_paise: parsedCompare,
          fabric_bn: fabricBn,
          fabric_en: fabricEn,
          care_instructions_bn: careBn,
          care_instructions_en: careEn,
          description_bn: descBn,
          description_en: descEn,
          images,
          is_featured: isFeatured,
          is_new: isNew,
          is_bestseller: isBestseller,
          allows_custom_size: allowCustom,
        },
        variants: variants.map((v) => ({
          ...v,
          price_paise: Number(v.price_paise || parsedBasePrice),
          stock_quantity: Number(v.stock_quantity || 0),
          low_stock_threshold: Number(v.low_stock_threshold || 3),
        })),
      };

      const url = isEditing && initialProduct
        ? `/api/admin/products/${initialProduct.id}`
        : "/api/admin/products";

      const res = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to save product");
      }

      setSuccess(true);
      setTimeout(() => {
        router.push(`/${locale}/admin/products`);
        router.refresh();
      }, 800);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-8 max-w-5xl pb-16">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9DDC9]">
        <div className="flex items-center gap-3">
          <Link
            href={`/${locale}/admin/products`}
            className="p-2 rounded-xl bg-white border border-[#E9DDC9] hover:bg-[#E9DDC9]/40 text-[#14372E] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#14372E]">
              {isEditing
                ? locale === "bn"
                  ? `পণ্য সম্পাদনা: ${initialProduct?.title_bn}`
                  : `Edit Product: ${initialProduct?.title_en}`
                : locale === "bn"
                ? "নতুন পণ্য যোগ করুন"
                : "Create New Product"}
            </h1>
            <p className="text-xs text-[#1C1B18]/70">
              {locale === "bn"
                ? "পণ্যের মৌলিক তথ্য, ছবি এবং ১৫টি সাইজ-কালার ভ্যারিয়েন্ট ম্যাট্রিক্স কনফিগার করুন।"
                : "Configure product metadata, images, and 15-variant matrix."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 rounded-xl bg-[#14372E] text-[#FBF7F0] font-bold text-xs shadow-md hover:bg-[#14372E]/90 flex items-center gap-2 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? (locale === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : locale === "bn" ? "সংরক্ষণ করুন" : "Save Product"}</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{locale === "bn" ? "পণ্যটি সফলভাবে সংরক্ষিত হয়েছে!" : "Product saved successfully!"}</span>
        </div>
      )}

      {/* Basic Info */}
      <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-5">
        <h2 className="font-serif text-base font-bold text-[#14372E]">
          {locale === "bn" ? "১. প্রাথমিক পরিচিতি ও শিরোনাম" : "1. Basic Identification & Titles"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "শিরোনাম (বাংলা) *" : "Title (Bengali) *"}
            </label>
            <input
              type="text"
              required
              value={titleBn}
              onChange={(e) => setTitleBn(e.target.value)}
              placeholder="যেমন: জাহরা এম্ব্রয়ডার্ড ওপেন আবায়া"
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "শিরোনাম (English) *" : "Title (English) *"}
            </label>
            <input
              type="text"
              required
              value={titleEn}
              onChange={(e) => handleAutoSlug(e.target.value)}
              placeholder="e.g. Zahra Embroidered Open Abaya"
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "ইউআরএল স্লাগ (Slug) *" : "URL Slug *"}
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="zahra-embroidered-open-abaya"
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "প্রোডাক্ট SKU *" : "Master Product SKU *"}
            </label>
            <input
              type="text"
              required
              value={sku}
              onChange={(e) => setSku(e.target.value)}
              placeholder="AZD-ZHRA"
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "ক্যাটাগরি *" : "Category *"}
            </label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {locale === "bn" ? c.name_bn : c.name_en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "কালেকশন (ঐচ্ছিক)" : "Collection (Optional)"}
            </label>
            <select
              value={collectionSlug}
              onChange={(e) => setCollectionSlug(e.target.value)}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            >
              <option value="">{locale === "bn" ? "কোনটি নয়" : "None"}</option>
              {collections.map((col) => (
                <option key={col.id} value={col.slug}>
                  {locale === "bn" ? col.title_bn : col.title_en}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "মূল্য (₹ INR) *" : "Base Price (₹ INR) *"}
            </label>
            <input
              type="number"
              step="1"
              required
              value={basePrice}
              onChange={(e) => setBasePrice(e.target.value)}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "কাটা মূল্য / Compare Price (₹ INR)" : "Compare Price (₹ INR)"}
            </label>
            <input
              type="number"
              step="1"
              value={comparePrice}
              onChange={(e) => setComparePrice(e.target.value)}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>
        </div>

        {/* Toggles */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          <label className="flex items-center gap-2 text-xs cursor-pointer bg-[#FBF7F0] p-2.5 rounded-xl border border-[#E9DDC9]">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="rounded text-[#14372E]"
            />
            <span>{locale === "bn" ? "ফিচার্ড পণ্য" : "Featured"}</span>
          </label>
          <label className="flex items-center gap-2 text-xs cursor-pointer bg-[#FBF7F0] p-2.5 rounded-xl border border-[#E9DDC9]">
            <input
              type="checkbox"
              checked={isNew}
              onChange={(e) => setIsNew(e.target.checked)}
              className="rounded text-[#14372E]"
            />
            <span>{locale === "bn" ? "নতুন কালেকশন" : "New Arrival"}</span>
          </label>
          <label className="flex items-center gap-2 text-xs cursor-pointer bg-[#FBF7F0] p-2.5 rounded-xl border border-[#E9DDC9]">
            <input
              type="checkbox"
              checked={isBestseller}
              onChange={(e) => setIsBestseller(e.target.checked)}
              className="rounded text-[#14372E]"
            />
            <span>{locale === "bn" ? "বেস্টসেলার" : "Bestseller"}</span>
          </label>
          <label className="flex items-center gap-2 text-xs cursor-pointer bg-[#FBF7F0] p-2.5 rounded-xl border border-[#E9DDC9]">
            <input
              type="checkbox"
              checked={allowCustom}
              onChange={(e) => setAllowCustom(e.target.checked)}
              className="rounded text-[#14372E]"
            />
            <span>{locale === "bn" ? "কাস্টম দরজি সেবা" : "Custom Tailoring"}</span>
          </label>
        </div>
      </div>

      {/* Fabric, Care & Description */}
      <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-4">
        <h2 className="font-serif text-base font-bold text-[#14372E]">
          {locale === "bn" ? "২. কাপড় ও বিবরণ" : "2. Fabric & Specifications"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "ফ্যাব্রিক তথ্য (বাংলা)" : "Fabric (Bengali)"}
            </label>
            <input
              type="text"
              value={fabricBn}
              onChange={(e) => setFabricBn(e.target.value)}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "ফ্যাব্রিক তথ্য (English)" : "Fabric (English)"}
            </label>
            <input
              type="text"
              value={fabricEn}
              onChange={(e) => setFabricEn(e.target.value)}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "যত্ন নির্দেশিকা (বাংলা)" : "Care Instructions (Bengali)"}
            </label>
            <input
              type="text"
              value={careBn}
              onChange={(e) => setCareBn(e.target.value)}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "যত্ন নির্দেশিকা (English)" : "Care Instructions (English)"}
            </label>
            <input
              type="text"
              value={careEn}
              onChange={(e) => setCareEn(e.target.value)}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "বিস্তারিত বিবরণ (বাংলা)" : "Description (Bengali)"}
            </label>
            <textarea
              rows={3}
              value={descBn}
              onChange={(e) => setDescBn(e.target.value)}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl p-3 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "বিস্তারিত বিবরণ (English)" : "Description (English)"}
            </label>
            <textarea
              rows={3}
              value={descEn}
              onChange={(e) => setDescEn(e.target.value)}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl p-3 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>
        </div>
      </div>

      {/* Image Gallery */}
      <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-serif text-base font-bold text-[#14372E]">
              {locale === "bn" ? "৩. পণ্যের ছবির গ্যালারি" : "3. Product Image Gallery"}
            </h2>
            <p className="text-xs text-[#1C1B18]/60">
              {locale === "bn" ? "প্রথম ছবিটি মূল কভার হিসেবে প্রদর্শিত হবে।" : "First image will be the primary card thumbnail."}
            </p>
          </div>

          <label className="cursor-pointer px-3.5 py-2 rounded-xl bg-[#14372E] text-white text-xs font-semibold hover:bg-[#14372E]/90 flex items-center gap-1.5">
            <Upload className="w-3.5 h-3.5" />
            <span>{uploadingImage ? (locale === "bn" ? "আপলোড হচ্ছে..." : "Uploading...") : locale === "bn" ? "ছবি আপলোড" : "Upload Image"}</span>
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingImage}
              onChange={handleImageUpload}
            />
          </label>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
          {images.map((img, idx) => (
            <div
              key={idx}
              className="relative aspect-3/4 rounded-xl border border-[#E9DDC9] bg-[#FBF7F0] overflow-hidden group shadow-2xs"
            >
              <Image src={img} alt={`Preview ${idx + 1}`} fill className="object-cover" />
              {idx === 0 && (
                <span className="absolute top-1 left-1 bg-[#14372E] text-white text-[9px] px-1.5 py-0.5 rounded font-bold">
                  {locale === "bn" ? "কভার" : "Cover"}
                </span>
              )}
              <button
                type="button"
                onClick={() => setImages(images.filter((_, i) => i !== idx))}
                className="absolute top-1 right-1 p-1 bg-red-600/90 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 15-Variant Matrix Generator & Variants Table */}
      <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#E9DDC9]">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <h2 className="font-serif text-base font-bold text-[#14372E]">
                {locale === "bn" ? "৪. ভ্যারিয়েন্ট ও স্টক ম্যাট্রিক্স (১৫ ভ্যারিয়েন্ট জেনারেটর)" : "4. Variant & Stock Matrix (15-Variant Generator)"}
              </h2>
            </div>
            <p className="text-xs text-[#1C1B18]/70 mt-1">
              {locale === "bn"
                ? "সাইজ ও কালার কম্বিনেশন দিয়ে এক ক্লিকে ১৫টি বা ততোধিক ভ্যারিয়েন্ট স্বয়ংক্রিয় তৈরি করুন।"
                : "Auto-generate 15+ combinations of sizes and luxury modest colors with custom stock."}
            </p>
          </div>

          <button
            type="button"
            onClick={handleGenerateMatrix}
            className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#1C1B18] font-bold text-xs shadow hover:bg-[#C5A059]/90 flex items-center gap-1.5 w-fit"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>{locale === "bn" ? "ম্যাট্রিক্স জেনারেট করুন" : "Generate Matrix"}</span>
          </button>
        </div>

        {/* Generator Controls */}
        <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E9DDC9] space-y-4">
          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#14372E] mb-2">
              {locale === "bn" ? "সাইজ নির্বাচন করুন:" : "Select Sizes:"}
            </span>
            <div className="flex flex-wrap gap-2">
              {COMMON_SIZES.map((sz) => {
                const active = selectedGenSizes.includes(sz);
                return (
                  <button
                    key={sz}
                    type="button"
                    onClick={() =>
                      setSelectedGenSizes(
                        active ? selectedGenSizes.filter((s) => s !== sz) : [...selectedGenSizes, sz]
                      )
                    }
                    className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? "bg-[#14372E] text-white shadow-xs"
                        : "bg-white border border-[#E9DDC9] text-[#1C1B18]"
                    }`}
                  >
                    {sz}
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <span className="block text-[11px] font-bold uppercase tracking-wider text-[#14372E] mb-2">
              {locale === "bn" ? "কালার নির্বাচন করুন:" : "Select Colors:"}
            </span>
            <div className="flex flex-wrap gap-2">
              {COMMON_COLORS.map((col) => {
                const active = selectedGenColors.includes(col.name_en);
                return (
                  <button
                    key={col.name_en}
                    type="button"
                    onClick={() =>
                      setSelectedGenColors(
                        active ? selectedGenColors.filter((c) => c !== col.name_en) : [...selectedGenColors, col.name_en]
                      )
                    }
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                      active
                        ? "bg-[#14372E] text-white shadow-xs"
                        : "bg-white border border-[#E9DDC9] text-[#1C1B18]"
                    }`}
                  >
                    <span className="w-2.5 h-2.5 rounded-full border border-white/50" style={{ backgroundColor: col.hex }} />
                    <span>{locale === "bn" ? col.name_bn : col.name_en}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-[#1C1B18]/80 font-medium">
              {locale === "bn" ? "প্রতিটি কম্বিনেশনের ডিফল্ট স্টক:" : "Default stock per combination:"}
            </span>
            <input
              type="number"
              value={defaultStock}
              onChange={(e) => setDefaultStock(e.target.value)}
              className="w-20 bg-white border border-[#E9DDC9] rounded-lg px-2.5 py-1 text-xs text-center font-bold"
            />
            <span className="text-xs text-[#14372E] font-bold">
              = {selectedGenSizes.length * selectedGenColors.length} {locale === "bn" ? "টি ভ্যারিয়েন্ট তৈরি হবে" : "variants will be generated"}
            </span>
          </div>
        </div>

        {/* Variants List Table */}
        <div className="border border-[#E9DDC9] rounded-xl overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-[#14372E] text-[#FBF7F0]">
              <tr>
                <th className="py-2.5 px-3">SKU</th>
                <th className="py-2.5 px-3">Size</th>
                <th className="py-2.5 px-3">Color</th>
                <th className="py-2.5 px-3">Price (₹)</th>
                <th className="py-2.5 px-3">Stock Qty</th>
                <th className="py-2.5 px-3">Low Alert</th>
                <th className="py-2.5 px-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E9DDC9]">
              {variants.map((v, i) => (
                <tr key={i} className="hover:bg-[#FBF7F0]/60 transition-colors">
                  <td className="py-2 px-3">
                    <input
                      type="text"
                      value={v.sku || ""}
                      onChange={(e) => {
                        const updated = [...variants];
                        updated[i].sku = e.target.value;
                        setVariants(updated);
                      }}
                      className="bg-white border border-[#E9DDC9] rounded-md px-2 py-1 text-xs w-32 font-mono"
                    />
                  </td>
                  <td className="py-2 px-3 font-semibold text-[#14372E]">{v.size}</td>
                  <td className="py-2 px-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className="w-3 h-3 rounded-full border border-black/20 shrink-0"
                        style={{ backgroundColor: v.color_hex || "#000" }}
                      />
                      <span>{locale === "bn" ? v.color_bn : v.color_en}</span>
                    </div>
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={v.price_paise ? v.price_paise / 100 : 0}
                      onChange={(e) => {
                        const updated = [...variants];
                        updated[i].price_paise = Math.round(parseFloat(e.target.value || "0") * 100);
                        setVariants(updated);
                      }}
                      className="bg-white border border-[#E9DDC9] rounded-md px-2 py-1 text-xs w-20 text-center"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={v.stock_quantity ?? 0}
                      onChange={(e) => {
                        const updated = [...variants];
                        updated[i].stock_quantity = parseInt(e.target.value || "0", 10);
                        setVariants(updated);
                      }}
                      className="bg-white border border-[#E9DDC9] rounded-md px-2 py-1 text-xs w-20 text-center font-bold text-[#14372E]"
                    />
                  </td>
                  <td className="py-2 px-3">
                    <input
                      type="number"
                      value={v.low_stock_threshold ?? 3}
                      onChange={(e) => {
                        const updated = [...variants];
                        updated[i].low_stock_threshold = parseInt(e.target.value || "3", 10);
                        setVariants(updated);
                      }}
                      className="bg-white border border-[#E9DDC9] rounded-md px-2 py-1 text-xs w-16 text-center"
                    />
                  </td>
                  <td className="py-2 px-3 text-right">
                    <button
                      type="button"
                      onClick={() => setVariants(variants.filter((_, idx) => idx !== i))}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center text-xs text-[#1C1B18]/70 pt-2">
          <span>
            {locale === "bn"
              ? `মোট ভ্যারিয়েন্ট সংখ্যা: ${variants.length} টি`
              : `Total variants: ${variants.length}`}
          </span>
          <button
            type="button"
            onClick={() =>
              setVariants([
                ...variants,
                {
                  id: `var-${Date.now()}`,
                  sku: `${sku || "AZD"}-${variants.length + 1}`,
                  size: "54",
                  color_en: "Black",
                  color_bn: "কালো",
                  color_hex: "#1C1B18",
                  price_paise: Math.round(parseFloat(basePrice || "2499") * 100),
                  stock_quantity: 10,
                  low_stock_threshold: 3,
                  is_active: true,
                },
              ])
            }
            className="flex items-center gap-1 text-[#14372E] font-bold hover:underline"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>{locale === "bn" ? "একটি ভ্যারিয়েন্ট যোগ করুন" : "Add Single Variant"}</span>
          </button>
        </div>
      </div>
    </form>
  );
}
