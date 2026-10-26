"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { X, Sparkles } from "lucide-react";

interface AnnouncementBarProps {
  locale: Locale;
}

export function AnnouncementBar({ locale }: AnnouncementBarProps) {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Announcement"
      className="bg-[#14372E] text-[#FBF7F0] text-xs sm:text-sm py-2 px-4 transition-all duration-300 relative border-b border-[#A8834A]/30"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex-1 flex items-center justify-center gap-2 text-center font-medium">
          <Sparkles className="w-3.5 h-3.5 text-[#C5A059] animate-pulse shrink-0" />
          <span>
            {locale === "bn"
              ? "রমজান ও ঈদ স্পেশাল কালেকশন — পশ্চিমবঙ্গ জুড়ে ₹১,৪৯৯-এর অর্ডারে ফ্রি এক্সপ্রেস ডেলিভারি!"
              : "Special Ramadan & Eid Drop — Free Express Delivery across Bengal on orders over ₹1,499!"}
          </span>
          <span className="hidden md:inline-block ml-2 px-2 py-0.5 rounded text-[11px] bg-[#A8834A]/20 text-[#E9DDC9] border border-[#A8834A]/40 font-mono">
            {locale === "bn" ? "কোড: AZAD10" : "USE: AZAD10"}
          </span>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="p-1 text-[#E9DDC9]/70 hover:text-[#FBF7F0] hover:bg-[#1C1B18]/30 rounded transition-colors"
          aria-label="Close Announcement"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </aside>
  );
}
