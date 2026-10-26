"use client";

import { useState, useMemo } from "react";
import { Locale, formatPrice } from "@/lib/i18n";
import { Product, Category, Collection } from "@/lib/types";
import { ProductCard } from "@/components/product/product-card";
import { QuickViewDialog } from "@/components/product/quick-view-dialog";
import {
  SlidersHorizontal,
  Grid3X3,
  Grid2X2,
  LayoutGrid,
  X,
  ChevronDown,
  Sparkles,
  Search,
} from "lucide-react";

interface ShopContainerProps {
  products: Product[];
  categories: Category[];
  collections: Collection[];
  locale: Locale;
  initialCategory?: string;
  initialCollection?: string;
  initialSearch?: string;
}

export function ShopContainer({
  products,
  categories,
  collections,
  locale,
  initialCategory,
  initialCollection,
  initialSearch,
}: ShopContainerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || "all");
  const [selectedCollection, setSelectedCollection] = useState<string>(initialCollection || "all");
  const [selectedPriceRange, setSelectedPriceRange] = useState<string>("all");
  const [selectedFabric, setSelectedFabric] = useState<string>("all");
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [customOnly, setCustomOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [searchQuery, setSearchQuery] = useState<string>(initialSearch || "");

  const [gridCols, setGridCols] = useState<2 | 3 | 4>(3);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Extract distinct fabrics from products
  const fabrics = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (locale === "bn" ? p.fabric_bn : p.fabric_en) {
        set.add(locale === "bn" ? p.fabric_bn : p.fabric_en);
      }
    });
    return Array.from(set);
  }, [products, locale]);

  // Filter & Sort Logic
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.title_en.toLowerCase().includes(q) ||
          p.title_bn.toLowerCase().includes(q) ||
          p.fabric_en.toLowerCase().includes(q) ||
          p.fabric_bn.toLowerCase().includes(q)
      );
    }

    // Category
    if (selectedCategory !== "all") {
      result = result.filter((p) => p.category?.slug === selectedCategory);
    }

    // Collection
    if (selectedCollection !== "all") {
      result = result.filter((p) => p.collections?.includes(selectedCollection));
    }

    // Price
    if (selectedPriceRange === "under_1000") {
      result = result.filter((p) => p.base_price_paise < 100000);
    } else if (selectedPriceRange === "1000_2500") {
      result = result.filter((p) => p.base_price_paise >= 100000 && p.base_price_paise <= 250000);
    } else if (selectedPriceRange === "above_2500") {
      result = result.filter((p) => p.base_price_paise > 250000);
    }

    // Fabric
    if (selectedFabric !== "all") {
      result = result.filter((p) => (locale === "bn" ? p.fabric_bn : p.fabric_en) === selectedFabric);
    }

    // In-Stock Only
    if (inStockOnly) {
      result = result.filter((p) => p.variants?.some((v) => v.stock_quantity > 0));
    }

    // Custom Size Only
    if (customOnly) {
      result = result.filter((p) => p.allows_custom_size);
    }

    // Sort
    if (sortBy === "price_asc") {
      result.sort((a, b) => a.base_price_paise - b.base_price_paise);
    } else if (sortBy === "price_desc") {
      result.sort((a, b) => b.base_price_paise - a.base_price_paise);
    } else if (sortBy === "bestseller") {
      result.sort((a, b) => (b.is_bestseller ? 1 : 0) - (a.is_bestseller ? 1 : 0));
    } else {
      // newest
      result.sort((a, b) => (b.is_new ? 1 : 0) - (a.is_new ? 1 : 0));
    }

    return result;
  }, [
    products,
    searchQuery,
    selectedCategory,
    selectedCollection,
    selectedPriceRange,
    selectedFabric,
    inStockOnly,
    customOnly,
    sortBy,
    locale,
  ]);

  // Pagination (12 items per page)
  const pageSize = 12;
  const totalPages = Math.ceil(filteredProducts.length / pageSize) || 1;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredProducts.slice(start, start + pageSize);
  }, [filteredProducts, currentPage]);

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedCollection("all");
    setSelectedPriceRange("all");
    setSelectedFabric("all");
    setInStockOnly(false);
    setCustomOnly(false);
    setSearchQuery("");
    setCurrentPage(1);
  };

  const hasActiveFilters =
    selectedCategory !== "all" ||
    selectedCollection !== "all" ||
    selectedPriceRange !== "all" ||
    selectedFabric !== "all" ||
    inStockOnly ||
    customOnly ||
    searchQuery.trim() !== "";

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
      {/* Top Banner / Filter Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E9DDC9]">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14372E]">
            {selectedCategory !== "all"
              ? categories.find((c) => c.slug === selectedCategory)?.[locale === "bn" ? "name_bn" : "name_en"]
              : selectedCollection !== "all"
              ? collections.find((c) => c.slug === selectedCollection)?.[locale === "bn" ? "title_bn" : "title_en"]
              : locale === "bn"
              ? "সকল শালীন পোশাক সম্ভার"
              : "All Modest Collections"}
          </h1>
          <p className="text-xs sm:text-sm text-[#1C1B18]/70 mt-1">
            {locale === "bn"
              ? `মোট ${filteredProducts.length}টি শালীন পোশাক পাওয়া গেছে`
              : `Showing ${filteredProducts.length} modest apparel items`}
          </p>
        </div>

        {/* Right Controls: Sort & Grid View Switcher */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Mobile Filter Button */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E9DDC9] text-xs font-bold text-[#14372E]"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>{locale === "bn" ? "ফিল্টার" : "Filters"}</span>
            {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-[#A8834A]" />}
          </button>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortBy}
              onChange={(e) => {
                setSortBy(e.target.value);
                setCurrentPage(1);
              }}
              className="appearance-none bg-white border border-[#E9DDC9] text-[#1C1B18] text-xs font-semibold py-2 pl-3 pr-8 rounded-xl focus:outline-none focus:border-[#14372E] cursor-pointer"
            >
              <option value="newest">{locale === "bn" ? "নতুন আগমনী (ডিফল্ট)" : "Newest Drop"}</option>
              <option value="bestseller">{locale === "bn" ? "জনপ্রিয়তা (বেস্টসেলার)" : "Best Sellers"}</option>
              <option value="price_asc">{locale === "bn" ? "মূল্য: কম থেকে বেশি" : "Price: Low to High"}</option>
              <option value="price_desc">{locale === "bn" ? "মূল্য: বেশি থেকে কম" : "Price: High to Low"}</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[#1C1B18]/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Grid Layout Toggles (Desktop) */}
          <div className="hidden sm:flex items-center bg-white border border-[#E9DDC9] rounded-xl p-1 gap-1">
            <button
              onClick={() => setGridCols(2)}
              className={`p-1.5 rounded-lg transition-colors ${
                gridCols === 2 ? "bg-[#14372E] text-white" : "text-[#1C1B18]/60 hover:text-[#1C1B18]"
              }`}
              aria-label="2 Columns"
            >
              <Grid2X2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(3)}
              className={`p-1.5 rounded-lg transition-colors ${
                gridCols === 3 ? "bg-[#14372E] text-white" : "text-[#1C1B18]/60 hover:text-[#1C1B18]"
              }`}
              aria-label="3 Columns"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setGridCols(4)}
              className={`p-1.5 rounded-lg transition-colors ${
                gridCols === 4 ? "bg-[#14372E] text-white" : "text-[#1C1B18]/60 hover:text-[#1C1B18]"
              }`}
              aria-label="4 Columns"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Sidebar + Products */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9DDC9]">
            <span className="font-serif text-lg font-bold text-[#14372E]">
              {locale === "bn" ? "ফিল্টার অপশন" : "Filters"}
            </span>
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#A8834A] hover:underline font-semibold"
              >
                {locale === "bn" ? "সব মুছুন" : "Clear All"}
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1B18]">
              {locale === "bn" ? "পোশাকের ধরন (ক্যাটাগরি)" : "Categories"}
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCategory("all");
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-[#14372E] text-[#FBF7F0] font-bold"
                    : "text-[#1C1B18]/80 hover:bg-[#E9DDC9]/50"
                }`}
              >
                {locale === "bn" ? "সব ক্যাটাগরি" : "All Categories"}
              </button>
              {categories.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setSelectedCategory(c.slug);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCategory === c.slug
                      ? "bg-[#14372E] text-[#FBF7F0] font-bold"
                      : "text-[#1C1B18]/80 hover:bg-[#E9DDC9]/50"
                  }`}
                >
                  {locale === "bn" ? c.name_bn : c.name_en}
                </button>
              ))}
            </div>
          </div>

          {/* Collection Filter */}
          <div className="space-y-2 pt-3 border-t border-[#E9DDC9]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1B18]">
              {locale === "bn" ? "বিশেষ কালেকশন" : "Collections"}
            </h4>
            <div className="space-y-1">
              <button
                onClick={() => {
                  setSelectedCollection("all");
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  selectedCollection === "all"
                    ? "bg-[#14372E] text-[#FBF7F0] font-bold"
                    : "text-[#1C1B18]/80 hover:bg-[#E9DDC9]/50"
                }`}
              >
                {locale === "bn" ? "সকল কালেকশন" : "All Collections"}
              </button>
              {collections.map((col) => (
                <button
                  key={col.id}
                  onClick={() => {
                    setSelectedCollection(col.slug);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedCollection === col.slug
                      ? "bg-[#14372E] text-[#FBF7F0] font-bold"
                      : "text-[#1C1B18]/80 hover:bg-[#E9DDC9]/50"
                  }`}
                >
                  {locale === "bn" ? col.title_bn : col.title_en}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2 pt-3 border-t border-[#E9DDC9]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1B18]">
              {locale === "bn" ? "মূল্য সীমা" : "Price Range"}
            </h4>
            <div className="space-y-1">
              {[
                { id: "all", bn: "সকল মূল্য", en: "All Prices" },
                { id: "under_1000", bn: "₹১,০০০-এর নিচে", en: "Under ₹1,000" },
                { id: "1000_2500", bn: "₹১,০০০ – ₹২,৫০০", en: "₹1,000 – ₹2,500" },
                { id: "above_2500", bn: "₹২,৫০০-এর উপরে", en: "Above ₹2,500" },
              ].map((tier) => (
                <button
                  key={tier.id}
                  onClick={() => {
                    setSelectedPriceRange(tier.id);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    selectedPriceRange === tier.id
                      ? "bg-[#14372E] text-[#FBF7F0] font-bold"
                      : "text-[#1C1B18]/80 hover:bg-[#E9DDC9]/50"
                  }`}
                >
                  {locale === "bn" ? tier.bn : tier.en}
                </button>
              ))}
            </div>
          </div>

          {/* Fabric Filter */}
          <div className="space-y-2 pt-3 border-t border-[#E9DDC9]">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#1C1B18]">
              {locale === "bn" ? "কাপড়ের উপাদান (ফেব্রিক)" : "Fabrics"}
            </h4>
            <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
              <button
                onClick={() => {
                  setSelectedFabric("all");
                  setCurrentPage(1);
                }}
                className={`w-full text-left px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedFabric === "all"
                    ? "bg-[#14372E] text-[#FBF7F0] font-bold"
                    : "text-[#1C1B18]/80 hover:bg-[#E9DDC9]/50"
                }`}
              >
                {locale === "bn" ? "সকল ফেব্রিক" : "All Fabrics"}
              </button>
              {fabrics.map((fab, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setSelectedFabric(fab);
                    setCurrentPage(1);
                  }}
                  className={`w-full text-left px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                    selectedFabric === fab
                      ? "bg-[#14372E] text-[#FBF7F0] font-bold"
                      : "text-[#1C1B18]/80 hover:bg-[#E9DDC9]/50"
                  }`}
                >
                  {fab}
                </button>
              ))}
            </div>
          </div>

          {/* Toggles */}
          <div className="space-y-3 pt-3 border-t border-[#E9DDC9]">
            <label className="flex items-center gap-2.5 text-xs font-semibold text-[#1C1B18] cursor-pointer">
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => {
                  setInStockOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded text-[#14372E] focus:ring-[#14372E]"
              />
              <span>{locale === "bn" ? "শুধুমাত্র স্টকে প্রস্তুত" : "In Stock Only"}</span>
            </label>

            <label className="flex items-center gap-2.5 text-xs font-semibold text-[#1C1B18] cursor-pointer">
              <input
                type="checkbox"
                checked={customOnly}
                onChange={(e) => {
                  setCustomOnly(e.target.checked);
                  setCurrentPage(1);
                }}
                className="w-4 h-4 rounded text-[#14372E] focus:ring-[#14372E]"
              />
              <span>{locale === "bn" ? "কাস্টম সাইজ সুবিধা আছে" : "Custom Tailoring Available"}</span>
            </label>
          </div>
        </aside>

        {/* Product Catalog Grid */}
        <div className="lg:col-span-3">
          {filteredProducts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-2xl border border-[#E9DDC9] p-8">
              <h3 className="font-serif text-xl font-bold text-[#14372E]">
                {locale === "bn" ? "কোনো পণ্য মেলেনি" : "No Matching Apparel Found"}
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1B18]/70 mt-2 max-w-sm mx-auto">
                {locale === "bn"
                  ? "আপনার নির্বাচিত ফিল্টার অনুযায়ী কোনো পণ্য পাওয়া যায়নি। অনুগ্রহ করে ফিল্টার পরিবর্তন করুন।"
                  : "We could not find any items matching your selected criteria. Try adjusting or clearing filters."}
              </p>
              <button
                onClick={clearAllFilters}
                className="mt-5 px-5 py-2.5 rounded-xl bg-[#14372E] text-white text-xs font-bold hover:bg-[#14372E]/90 transition-colors shadow-md"
              >
                {locale === "bn" ? "সব ফিল্টার মুছে ফেলুন" : "Reset All Filters"}
              </button>
            </div>
          ) : (
            <>
              <div
                className={`grid gap-4 sm:gap-6 ${
                  gridCols === 2
                    ? "grid-cols-2"
                    : gridCols === 4
                    ? "grid-cols-2 sm:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-2 sm:grid-cols-3"
                }`}
              >
                {paginatedProducts.map((p) => (
                  <ProductCard key={p.id} product={p} locale={locale} />
                ))}
              </div>

              {/* Pagination Bar */}
              {totalPages > 1 && (
                <div className="mt-12 flex items-center justify-center gap-2">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="px-3.5 py-2 rounded-lg border border-[#E9DDC9] bg-white text-xs font-bold text-[#1C1B18] disabled:opacity-40 transition-colors"
                  >
                    {locale === "bn" ? "পূর্ববর্তী" : "Previous"}
                  </button>

                  <div className="flex gap-1.5">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
                      <button
                        key={num}
                        onClick={() => setCurrentPage(num)}
                        className={`w-9 h-9 rounded-lg text-xs font-bold transition-all ${
                          currentPage === num
                            ? "bg-[#14372E] text-[#FBF7F0] shadow-sm"
                            : "bg-white border border-[#E9DDC9] text-[#1C1B18] hover:bg-[#E9DDC9]/50"
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="px-3.5 py-2 rounded-lg border border-[#E9DDC9] bg-white text-xs font-bold text-[#1C1B18] disabled:opacity-40 transition-colors"
                  >
                    {locale === "bn" ? "পরবর্তী" : "Next"}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Quick View Modal */}
      <QuickViewDialog
        product={quickViewProduct}
        isOpen={Boolean(quickViewProduct)}
        onClose={() => setQuickViewProduct(null)}
        locale={locale}
      />
    </div>
  );
}
