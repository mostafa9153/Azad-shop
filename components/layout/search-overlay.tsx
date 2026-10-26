"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Locale, formatPrice } from "@/lib/i18n";
import { Product } from "@/lib/types";
import { Search, X, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export function SearchOverlay({ isOpen, onClose, locale }: SearchOverlayProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const quickChips = [
    { bn: "কোরিয়ান নিদা", en: "Korean Nida", q: "nida" },
    { bn: "দুবাই আবায়া", en: "Dubai Abaya", q: "dubai" },
    { bn: "লখনউই চিকেনকারি", en: "Chikankari Panjabi", q: "chikankari" },
    { bn: "টু-পিস জিলবাব", en: "French Jilbab", q: "jilbab" },
    { bn: "৩-লেয়ার নিকাব", en: "3-Layer Niqab", q: "niqab" },
    { bn: "ম্যাগনেটিক পিন", en: "Magnetic Pins", q: "magnetic" },
  ];

  useEffect(() => {
    if (!isOpen) {
      setQuery("");
      setResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      if (query.trim().length > 1) {
        setLoading(true);
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(query.trim())}&locale=${locale}`);
          if (res.ok) {
            const data = await res.json();
            setResults(data.products || []);
          }
        } catch (e) {
          console.error("Search error:", e);
        } finally {
          setLoading(false);
        }
      } else {
        setResults([]);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query, isOpen, locale]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-[#FBF7F0] border-b border-[#E9DDC9] shadow-2xl p-4 sm:p-6 max-h-[85vh] flex flex-col">
        <div className="max-w-4xl mx-auto w-full">
          {/* Search Header Bar */}
          <div className="flex items-center gap-3 border-b-2 border-[#14372E] pb-3">
            <Search className="w-6 h-6 text-[#14372E] shrink-0" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                locale === "bn"
                  ? "বোরকা, আবায়া, হিজাব, পাঞ্জাবি বা ফেব্রিক খুঁজুন..."
                  : "Search burkhas, abayas, hijabs, panjabis or fabrics..."
              }
              className="w-full bg-transparent text-lg sm:text-xl font-medium text-[#1C1B18] placeholder:text-[#1C1B18]/40 outline-none"
              autoFocus
            />
            {query && (
              <button
                onClick={() => setQuery("")}
                className="p-1 text-[#1C1B18]/60 hover:text-[#1C1B18]"
                aria-label="Clear input"
              >
                <X className="w-5 h-5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="ml-2 px-3 py-1.5 rounded text-xs font-semibold bg-[#E9DDC9] text-[#1C1B18] hover:bg-[#A8834A] hover:text-[#FBF7F0] transition-colors"
            >
              {locale === "bn" ? "বন্ধ করুন" : "ESC"}
            </button>
          </div>

          {/* Quick search tags */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs font-semibold text-[#A8834A] flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              {locale === "bn" ? "জনপ্রিয় অনুসন্ধান:" : "Trending Searches:"}
            </span>
            {quickChips.map((chip, idx) => (
              <button
                key={idx}
                onClick={() => setQuery(chip.q)}
                className="px-2.5 py-1 text-xs rounded-full bg-[#E9DDC9]/60 hover:bg-[#14372E] hover:text-[#FBF7F0] transition-all text-[#1C1B18]"
              >
                {locale === "bn" ? chip.bn : chip.en}
              </button>
            ))}
          </div>
        </div>

        {/* Results Container */}
        <div className="max-w-4xl mx-auto w-full overflow-y-auto mt-6 flex-1 pr-1">
          {loading && (
            <div className="text-center py-10 text-sm text-[#1C1B18]/60 font-medium">
              {locale === "bn" ? "সন্ধান করা হচ্ছে..." : "Searching modest collection..."}
            </div>
          )}

          {!loading && query.trim().length > 1 && results.length === 0 && (
            <div className="text-center py-12">
              <p className="text-[#1C1B18]/70 text-sm">
                {locale === "bn"
                  ? `"${query}" এর জন্য কোনো পণ্য পাওয়া যায়নি। অন্য কিওয়ার্ড চেষ্টা করুন।`
                  : `No modest attire found matching "${query}". Try another keyword.`}
              </p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pb-4">
              {results.slice(0, 9).map((product) => {
                const primaryImage = product.images?.[0]?.image_url || "/placeholder-product.svg";
                return (
                  <Link
                    key={product.id}
                    href={`/${locale}/product/${product.slug}`}
                    onClick={onClose}
                    className="flex items-center gap-3 p-2.5 rounded-lg border border-[#E9DDC9] hover:border-[#14372E] bg-white transition-all shadow-xs hover:shadow-md group"
                  >
                    <div className="relative w-16 h-20 shrink-0 bg-[#FBF7F0] rounded overflow-hidden">
                      <Image
                        src={primaryImage}
                        alt={locale === "bn" ? product.title_bn : product.title_en}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform"
                        unoptimized
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-semibold text-[#A8834A] truncate">
                        {locale === "bn" ? product.fabric_bn : product.fabric_en}
                      </p>
                      <h4 className="text-sm font-medium text-[#1C1B18] group-hover:text-[#14372E] line-clamp-1">
                        {locale === "bn" ? product.title_bn : product.title_en}
                      </h4>
                      <p className="text-sm font-bold text-[#14372E] mt-1">
                        {formatPrice(product.base_price_paise, locale)}
                      </p>
                    </div>
                    <ArrowRight className="w-4 h-4 text-[#1C1B18]/30 group-hover:text-[#14372E] group-hover:translate-x-1 transition-all" />
                  </Link>
                );
              })}
            </div>
          )}

          {results.length > 9 && (
            <div className="text-center pt-2 pb-4">
              <Link
                href={`/${locale}/shop?q=${encodeURIComponent(query)}`}
                onClick={onClose}
                className="inline-flex items-center gap-2 text-xs font-bold text-[#14372E] hover:underline"
              >
                {locale === "bn" ? "সকল ফলাফল শপ পেজে দেখুন" : "View all results in Shop"} &rarr;
              </Link>
            </div>
          )}
        </div>
      </div>
      <div className="flex-1 cursor-pointer" onClick={onClose} />
    </div>
  );
}
