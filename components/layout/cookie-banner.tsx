"use client";

import { useState, useEffect } from "react";
import { Locale } from "@/lib/i18n";
import { ShieldCheck, X } from "lucide-react";

interface CookieBannerProps {
  locale: Locale;
}

export function CookieBanner({ locale }: CookieBannerProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("azad_haya_cookie_consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("azad_haya_cookie_consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("azad_haya_cookie_consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <aside
      aria-label="Privacy & Cookie Preferences"
      className="fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom))] md:bottom-6 left-4 right-4 md:left-6 md:right-auto md:max-w-md z-40 bg-[#1C1B18]/95 text-[#FBF7F0] p-4 rounded-xl shadow-2xl border border-[#A8834A]/40 backdrop-blur-md animate-in slide-in-from-bottom duration-300"
    >
      <div className="flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-[#C5A059] shrink-0 mt-0.5" />
        <div className="space-y-1.5 flex-1">
          <h4 className="text-xs font-bold text-[#E9DDC9] tracking-wide">
            {locale === "bn" ? "শালীন ও সুরক্ষিত ব্রাউজিং" : "Private & Modest Browsing"}
          </h4>
          <p className="text-[11px] text-[#E9DDC9]/80 leading-relaxed">
            {locale === "bn"
              ? "আপনার ভাষা পছন্দ ও শপিং ব্যাগের পণ্য মনে রাখতে আমরা গোপনীয়তা নীতি মেনে কুকি ব্যবহার করি।"
              : "We use essential local cookies to remember your language preference and saved cart items respectfully."}
          </p>
          <div className="flex items-center gap-2 pt-1">
            <button
              onClick={handleAccept}
              className="px-3 py-1 bg-[#14372E] text-[#FBF7F0] text-xs font-bold rounded hover:bg-[#14372E]/90 transition-colors border border-[#A8834A]/40"
            >
              {locale === "bn" ? "সম্মত আছি" : "Accept"}
            </button>
            <button
              onClick={handleDecline}
              className="px-3 py-1 bg-white/10 text-[#E9DDC9] text-xs font-medium rounded hover:bg-white/20 transition-colors"
            >
              {locale === "bn" ? "প্রত্যাখ্যান" : "Decline"}
            </button>
          </div>
        </div>
        <button
          onClick={handleDecline}
          className="text-[#E9DDC9]/50 hover:text-[#FBF7F0] p-1"
          aria-label="Dismiss cookie notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
}
