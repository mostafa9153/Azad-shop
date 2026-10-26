"use client";

import { useState } from "react";
import { Locale, formatPrice } from "@/lib/i18n";
import { ProductVariant, StockLedgerEntry, StockChangeType } from "@/lib/types";
import {
  Layers,
  Search,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  TrendingUp,
  RefreshCw,
  PlusCircle,
  FileSpreadsheet,
  ShieldCheck,
  X,
  History,
} from "lucide-react";

interface VariantRow extends ProductVariant {
  product_title_en: string;
  product_title_bn: string;
  product_slug: string;
}

interface InventoryManagerProps {
  locale: Locale;
  initialVariants: VariantRow[];
  initialLedger: StockLedgerEntry[];
}

export function InventoryManager({
  locale,
  initialVariants,
  initialLedger,
}: InventoryManagerProps) {
  const [variants, setVariants] = useState<VariantRow[]>(initialVariants);
  const [ledger, setLedger] = useState<StockLedgerEntry[]>(initialLedger);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "low" | "out">("all");
  const [activeTab, setActiveTab] = useState<"stock" | "ledger">("stock");

  // Adjust dialog state
  const [selectedVariant, setSelectedVariant] = useState<VariantRow | null>(null);
  const [adjustQty, setAdjustQty] = useState<string>("5");
  const [adjustType, setAdjustType] = useState<StockChangeType>("adjustment");
  const [adjustNote, setAdjustNote] = useState<string>("স্টক সমন্বয় / Stock count update");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Verify status state
  const [verifying, setVerifying] = useState(false);
  const [verifyResult, setVerifyResult] = useState<{
    totalVariants: number;
    healthyCount: number;
    mismatchCount: number;
  } | null>(null);

  // Counts
  const totalVariants = variants.length;
  const outOfStock = variants.filter((v) => v.stock_quantity <= 0);
  const lowStock = variants.filter(
    (v) => v.stock_quantity > 0 && v.stock_quantity <= v.low_stock_threshold
  );

  const filteredVariants = variants.filter((v) => {
    const matchesSearch =
      v.sku.toLowerCase().includes(search.toLowerCase()) ||
      v.product_title_en.toLowerCase().includes(search.toLowerCase()) ||
      v.product_title_bn.toLowerCase().includes(search.toLowerCase()) ||
      v.size.toLowerCase().includes(search.toLowerCase()) ||
      v.color_en.toLowerCase().includes(search.toLowerCase());

    if (!matchesSearch) return false;
    if (filter === "out") return v.stock_quantity <= 0;
    if (filter === "low") return v.stock_quantity > 0 && v.stock_quantity <= v.low_stock_threshold;
    return true;
  });

  const handleAdjust = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedVariant) return;

    setIsSubmitting(true);
    try {
      const delta = parseInt(adjustQty, 10);
      const res = await fetch("/api/admin/inventory/adjust", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          variantId: selectedVariant.id,
          quantityChange: delta,
          changeType: adjustType,
          note: adjustNote,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Adjustment failed");

      // Update local state
      setVariants((prev) =>
        prev.map((v) =>
          v.id === selectedVariant.id ? { ...v, stock_quantity: data.newQuantity } : v
        )
      );

      // Prepend to ledger
      setLedger((prev) => [
        {
          id: `led_${Date.now()}`,
          variant_id: selectedVariant.id,
          sku: selectedVariant.sku,
          change_type: adjustType,
          quantity_change: delta,
          previous_quantity: data.previousQuantity,
          new_quantity: data.newQuantity,
          note: adjustNote,
          created_at: new Date().toISOString(),
          created_by: "admin",
        },
        ...prev,
      ]);

      setSelectedVariant(null);
    } catch (err: any) {
      alert(err.message || "Error adjusting stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyIntegrity = async () => {
    setVerifying(true);
    try {
      const res = await fetch("/api/admin/inventory/verify", { method: "POST" });
      const data = await res.json();
      if (data.report) {
        setVerifyResult(data.report);
      }
    } catch (err: any) {
      alert("Verification failed: " + err.message);
    } finally {
      setVerifying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E9DDC9] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1C1B18]/70">
              {locale === "bn" ? "মোট SKU ভ্যারিয়েন্ট" : "Total SKU Variants"}
            </span>
            <Layers className="w-4 h-4 text-[#14372E]" />
          </div>
          <p className="text-2xl font-serif font-bold text-[#14372E] mt-2">{totalVariants}</p>
          <span className="text-[11px] text-[#A8834A] font-medium">
            {locale === "bn" ? "অ্যাটমিক লেজার দ্বারা সুরক্ষিত" : "Tracked by Stock Ledger"}
          </span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E9DDC9] shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1C1B18]/70">
              {locale === "bn" ? "পর্যাপ্ত স্টকযুক্ত" : "Healthy Stock"}
            </span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-2xl font-serif font-bold text-emerald-700 mt-2">
            {totalVariants - lowStock.length - outOfStock.length}
          </p>
          <span className="text-[11px] text-emerald-600 font-medium">
            {locale === "bn" ? "স্বাভাবিক মজুত" : "In regular supply"}
          </span>
        </div>

        <div
          onClick={() => setFilter(filter === "low" ? "all" : "low")}
          className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all shadow-2xs ${
            filter === "low" ? "border-amber-500 ring-2 ring-amber-500/20" : "border-[#E9DDC9]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1C1B18]/70">
              {locale === "bn" ? "কম স্টক সতর্কবার্তা" : "Low Stock Alerts"}
            </span>
            <AlertTriangle className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-2xl font-serif font-bold text-amber-600 mt-2">{lowStock.length}</p>
          <span className="text-[11px] text-amber-600 font-medium">
            {locale === "bn" ? "সীমার নিচে নেমে গেছে" : "Below threshold"}
          </span>
        </div>

        <div
          onClick={() => setFilter(filter === "out" ? "all" : "out")}
          className={`bg-white p-5 rounded-2xl border cursor-pointer transition-all shadow-2xs ${
            filter === "out" ? "border-red-500 ring-2 ring-red-500/20" : "border-[#E9DDC9]"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-[#1C1B18]/70">
              {locale === "bn" ? "স্টক শেষ (Out of Stock)" : "Out of Stock"}
            </span>
            <TrendingDown className="w-4 h-4 text-red-500" />
          </div>
          <p className="text-2xl font-serif font-bold text-red-600 mt-2">{outOfStock.length}</p>
          <span className="text-[11px] text-red-600 font-medium">
            {locale === "bn" ? "অবিলম্বে রিস্টক প্রয়োজন" : "Needs restock"}
          </span>
        </div>
      </div>

      {/* Verification Pill / Action Bar */}
      <div className="bg-[#14372E] text-[#FBF7F0] p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/10 text-[#C5A059]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-serif text-sm font-bold">
              {locale === "bn"
                ? "ডাবল-এন্ট্রি ইনভেন্টরি লেজার নিরাপত্তা"
                : "Double-Entry Stock Ledger Integrity"}
            </h3>
            <p className="text-xs text-[#E9DDC9]/70">
              {verifyResult
                ? locale === "bn"
                  ? `যাচাইকরণ সফল: ${verifyResult.healthyCount} টি ভ্যারিয়েন্ট লেজারের সাথে ১০০% সিঙ্কে রয়েছে (ত্রুটি: ${verifyResult.mismatchCount})।`
                  : `Integrity check complete: ${verifyResult.healthyCount}/${verifyResult.totalVariants} variants in sync with ledger (mismatches: ${verifyResult.mismatchCount}).`
                : locale === "bn"
                ? "প্রতিটি স্টকের হ্রাস-বৃদ্ধি লেজারে সময় ও রেফারেন্স সহ রেকর্ড করা হয়।"
                : "All stock modifications are recorded atomically with audit notes."}
            </p>
          </div>
        </div>

        <button
          onClick={handleVerifyIntegrity}
          disabled={verifying}
          className="px-4 py-2 rounded-xl bg-[#C5A059] text-[#1C1B18] text-xs font-bold hover:bg-[#C5A059]/90 transition-colors flex items-center gap-1.5 shrink-0 disabled:opacity-50"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${verifying ? "animate-spin" : ""}`} />
          <span>
            {verifying
              ? locale === "bn"
                ? "যাচাই চলছে..."
                : "Verifying..."
              : locale === "bn"
              ? "স্টক ইন্টিগ্রিটি যাচাই করুন"
              : "Verify Stock Integrity"}
          </span>
        </button>
      </div>

      {/* Tabs & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex gap-2 border-b border-[#E9DDC9] pb-2 sm:pb-0 sm:border-none">
          <button
            onClick={() => setActiveTab("stock")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "stock"
                ? "bg-[#14372E] text-white shadow-xs"
                : "bg-white border border-[#E9DDC9] text-[#1C1B18] hover:bg-[#E9DDC9]/30"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>{locale === "bn" ? "বর্তমান স্টক তালিকা" : "Live Inventory"}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {filteredVariants.length}
            </span>
          </button>

          <button
            onClick={() => setActiveTab("ledger")}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === "ledger"
                ? "bg-[#14372E] text-white shadow-xs"
                : "bg-white border border-[#E9DDC9] text-[#1C1B18] hover:bg-[#E9DDC9]/30"
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{locale === "bn" ? "অডিট লেজার রেকর্ড" : "Stock Ledger Audit"}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-white/20 text-[10px]">
              {ledger.length}
            </span>
          </button>
        </div>

        {activeTab === "stock" && (
          <div className="flex items-center gap-2 max-w-sm w-full">
            <div className="relative flex-1">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={
                  locale === "bn" ? "SKU, সাইজ বা পণ্য দিয়ে খুঁজুন..." : "Filter SKU, size, color..."
                }
                className="w-full bg-white border border-[#E9DDC9] rounded-xl pl-8 pr-3 py-2 text-xs focus:outline-none focus:border-[#14372E]"
              />
              <Search className="w-3.5 h-3.5 text-[#1C1B18]/50 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
            {filter !== "all" && (
              <button
                onClick={() => setFilter("all")}
                className="text-xs text-[#14372E] underline font-semibold whitespace-nowrap"
              >
                {locale === "bn" ? "ফিল্টার মুছুন" : "Clear filter"}
              </button>
            )}
          </div>
        )}
      </div>

      {/* TAB 1: LIVE INVENTORY TABLE */}
      {activeTab === "stock" && (
        <div className="bg-white rounded-2xl border border-[#E9DDC9] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#14372E] text-[#FBF7F0]">
                <tr>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">{locale === "bn" ? "পণ্যের নাম" : "Product"}</th>
                  <th className="py-3 px-4">{locale === "bn" ? "সাইজ" : "Size"}</th>
                  <th className="py-3 px-4">{locale === "bn" ? "কালার" : "Color"}</th>
                  <th className="py-3 px-4 text-center">{locale === "bn" ? "বর্তমান স্টক" : "Current Stock"}</th>
                  <th className="py-3 px-4 text-center">{locale === "bn" ? "সতর্কতা সীমা" : "Low Alert"}</th>
                  <th className="py-3 px-4 text-center">{locale === "bn" ? "অবস্থা" : "Status"}</th>
                  <th className="py-3 px-4 text-right">{locale === "bn" ? "অ্যাকশন" : "Quick Action"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9DDC9]">
                {filteredVariants.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-8 text-center text-xs text-[#1C1B18]/60">
                      {locale === "bn" ? "কোন ভ্যারিয়েন্ট পাওয়া যায়নি।" : "No variants match search."}
                    </td>
                  </tr>
                ) : (
                  filteredVariants.map((v) => {
                    const isOut = v.stock_quantity <= 0;
                    const isLow = !isOut && v.stock_quantity <= v.low_stock_threshold;

                    return (
                      <tr key={v.id} className="hover:bg-[#FBF7F0]/70 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-[#14372E]">{v.sku}</td>
                        <td className="py-3 px-4">
                          <p className="font-serif font-bold text-[#1C1B18] line-clamp-1">
                            {locale === "bn" ? v.product_title_bn : v.product_title_en}
                          </p>
                        </td>
                        <td className="py-3 px-4 font-semibold text-[#14372E]">{v.size}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-3 h-3 rounded-full border border-black/20"
                              style={{ backgroundColor: v.color_hex }}
                            />
                            <span>{locale === "bn" ? v.color_bn : v.color_en}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-center font-bold text-sm">
                          <span
                            className={
                              isOut
                                ? "text-red-600 font-extrabold"
                                : isLow
                                ? "text-amber-600 font-bold"
                                : "text-emerald-700 font-bold"
                            }
                          >
                            {v.stock_quantity}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-center text-[#1C1B18]/70">
                          {v.low_stock_threshold}
                        </td>
                        <td className="py-3 px-4 text-center">
                          {isOut ? (
                            <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-700 font-bold text-[10px]">
                              {locale === "bn" ? "স্টক শেষ" : "Out of Stock"}
                            </span>
                          ) : isLow ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold text-[10px]">
                              {locale === "bn" ? "কম স্টক" : "Low Stock"}
                            </span>
                          ) : (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                              {locale === "bn" ? "পর্যাপ্ত" : "In Stock"}
                            </span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => {
                              setSelectedVariant(v);
                              setAdjustQty("5");
                              setAdjustType("adjustment");
                              setAdjustNote("নিয়মিত স্টক আপডেট / Regular stock count update");
                            }}
                            className="px-3 py-1.5 rounded-lg bg-[#14372E] text-white font-semibold text-[11px] hover:bg-[#14372E]/90 transition-colors inline-flex items-center gap-1"
                          >
                            <PlusCircle className="w-3 h-3" />
                            <span>{locale === "bn" ? "স্টক সমন্বয়" : "Adjust"}</span>
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: AUDIT LEDGER TABLE */}
      {activeTab === "ledger" && (
        <div className="bg-white rounded-2xl border border-[#E9DDC9] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#14372E] text-[#FBF7F0]">
                <tr>
                  <th className="py-3 px-4">{locale === "bn" ? "সময় ও তারিখ" : "Date & Time"}</th>
                  <th className="py-3 px-4">SKU</th>
                  <th className="py-3 px-4">{locale === "bn" ? "পরিবর্তনের ধরন" : "Type"}</th>
                  <th className="py-3 px-4 text-center">{locale === "bn" ? "স্টক পরিবর্তন" : "Quantity Change"}</th>
                  <th className="py-3 px-4 text-center">{locale === "bn" ? "পূর্ব -> নতুন" : "Prev -> New"}</th>
                  <th className="py-3 px-4">{locale === "bn" ? "অডিট নোট / রেফারেন্স" : "Audit Note & Ref"}</th>
                  <th className="py-3 px-4">{locale === "bn" ? "অপারেটর" : "Author"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9DDC9]">
                {ledger.map((entry) => {
                  const isPositive = entry.quantity_change > 0;
                  return (
                    <tr key={entry.id} className="hover:bg-[#FBF7F0]/60 transition-colors">
                      <td className="py-3 px-4 text-[#1C1B18]/70 whitespace-nowrap">
                        {new Date(entry.created_at).toLocaleString("en-IN", {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </td>
                      <td className="py-3 px-4 font-mono font-bold text-[#14372E]">{entry.sku}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md bg-[#E9DDC9]/50 text-[#14372E] font-medium text-[10px]">
                          {entry.change_type}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-bold">
                        <span className={isPositive ? "text-emerald-700" : "text-red-600"}>
                          {isPositive ? `+${entry.quantity_change}` : entry.quantity_change}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center font-mono text-[#1C1B18]/80">
                        {entry.previous_quantity} &rarr; {entry.new_quantity}
                      </td>
                      <td className="py-3 px-4 text-[#1C1B18]/80 max-w-xs">
                        <p className="truncate">{entry.note}</p>
                        {entry.reference_id && (
                          <span className="text-[10px] text-[#A8834A] font-mono">
                            Ref: {entry.reference_id}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 font-semibold text-[#14372E]">{entry.created_by}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* QUICK STOCK ADJUSTMENT MODAL */}
      {selectedVariant && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full border border-[#E9DDC9] p-6 shadow-2xl relative animate-in fade-in zoom-in-95">
            <button
              onClick={() => setSelectedVariant(null)}
              className="absolute top-4 right-4 p-1.5 text-[#1C1B18]/60 hover:text-[#1C1B18] rounded-lg"
            >
              <X className="w-4 h-4" />
            </button>

            <h3 className="font-serif text-lg font-bold text-[#14372E]">
              {locale === "bn" ? "অ্যাটমিক স্টক সমন্বয়" : "Atomic Stock Adjustment"}
            </h3>
            <p className="text-xs text-[#1C1B18]/70 mt-1">
              SKU: <span className="font-mono font-bold text-[#14372E]">{selectedVariant.sku}</span> (
              {selectedVariant.size} / {locale === "bn" ? selectedVariant.color_bn : selectedVariant.color_en})
            </p>

            <div className="my-4 p-3 rounded-xl bg-[#FBF7F0] border border-[#E9DDC9] flex justify-between items-center text-xs">
              <span className="text-[#1C1B18]/70">
                {locale === "bn" ? "বর্তমান অন-হ্যান্ড স্টক:" : "Current on-hand stock:"}
              </span>
              <span className="text-base font-bold text-[#14372E]">
                {selectedVariant.stock_quantity}
              </span>
            </div>

            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
                  {locale === "bn" ? "স্টক পরিবর্তনের পরিমাণ (+ বা -) *" : "Stock Delta (+ or -) *"}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setAdjustQty((prev) => (parseInt(prev || "0", 10) - 1).toString())}
                    className="px-3 py-1.5 rounded-lg border border-[#E9DDC9] bg-white font-bold text-sm"
                  >
                    -1
                  </button>
                  <input
                    type="number"
                    required
                    value={adjustQty}
                    onChange={(e) => setAdjustQty(e.target.value)}
                    className="flex-1 bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3 py-1.5 text-center text-sm font-bold text-[#14372E]"
                  />
                  <button
                    type="button"
                    onClick={() => setAdjustQty((prev) => (parseInt(prev || "0", 10) + 1).toString())}
                    className="px-3 py-1.5 rounded-lg border border-[#E9DDC9] bg-white font-bold text-sm"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => setAdjustQty((prev) => (parseInt(prev || "0", 10) + 10).toString())}
                    className="px-3 py-1.5 rounded-lg bg-[#E9DDC9] text-[#14372E] font-bold text-xs"
                  >
                    +10
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
                  {locale === "bn" ? "পরিবর্তনের কারণ *" : "Reason / Type *"}
                </label>
                <select
                  value={adjustType}
                  onChange={(e) => setAdjustType(e.target.value as StockChangeType)}
                  className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#14372E]"
                >
                  <option value="restock">নতুন চালান রিস্টক (Restock)</option>
                  <option value="adjustment">স্টক গণনা সমন্বয় (Inventory Adjustment)</option>
                  <option value="return">গ্রাহক রিটার্ন (Return Restock)</option>
                  <option value="tailoring_allocated">দরজি সেকশনে বরাদ্দ (Tailoring Allocated)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
                  {locale === "bn" ? "অডিট নোট *" : "Audit Note *"}
                </label>
                <input
                  type="text"
                  required
                  value={adjustNote}
                  onChange={(e) => setAdjustNote(e.target.value)}
                  placeholder="যেমন: নতুন ২০ পিস বোরখা ফ্যাক্টরি থেকে এসেছে"
                  className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#14372E]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedVariant(null)}
                  className="flex-1 py-2.5 rounded-xl border border-[#E9DDC9] text-xs font-bold text-[#1C1B18] hover:bg-[#E9DDC9]/30"
                >
                  {locale === "bn" ? "বাতিল" : "Cancel"}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2.5 rounded-xl bg-[#14372E] text-white text-xs font-bold shadow-md hover:bg-[#14372E]/90 disabled:opacity-50"
                >
                  {isSubmitting
                    ? locale === "bn"
                      ? "আপডেট হচ্ছে..."
                      : "Updating..."
                    : locale === "bn"
                    ? "লেজারে সংরক্ষণ করুন"
                    : "Confirm & Record"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
