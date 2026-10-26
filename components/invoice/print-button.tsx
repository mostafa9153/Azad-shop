"use client";

import { Printer } from "lucide-react";
import { Locale } from "@/lib/i18n";

export function PrintButton({ locale }: { locale: Locale }) {
  return (
    <button
      type="button"
      onClick={() => {
        if (typeof window !== "undefined") window.print();
      }}
      className="px-5 py-2.5 rounded-xl bg-[#14372E] text-white text-xs font-bold shadow-md hover:bg-[#14372E]/90 flex items-center gap-2 cursor-pointer transition-colors"
    >
      <Printer className="w-4 h-4" />
      <span>{locale === "bn" ? "প্রিন্ট চালান / ডাউনলোড PDF" : "Print Invoice / Save PDF"}</span>
    </button>
  );
}
