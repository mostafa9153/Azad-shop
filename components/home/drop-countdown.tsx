"use client";

import { useState, useEffect } from "react";
import { Locale, toBengaliNumerals } from "@/lib/i18n";
import { Sparkles, Timer } from "lucide-react";
import Link from "next/link";

export function DropCountdown({ locale }: { locale: Locale }) {
  const [timeLeft, setTimeLeft] = useState({
    days: 12,
    hours: 18,
    minutes: 45,
    seconds: 30,
  });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
        if (prev.hours > 0) return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
        if (prev.days > 0) return { ...prev, days: prev.days - 1, hours: 23, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatNum = (n: number) => {
    const padded = n.toString().padStart(2, "0");
    return locale === "bn" ? toBengaliNumerals(padded) : padded;
  };

  return (
    <section className="bg-[#1C1B18] text-[#FBF7F0] py-10 px-4 sm:px-6 relative overflow-hidden border-y border-[#A8834A]/30">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Left Heading */}
        <div className="space-y-2 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#C5A059] uppercase tracking-wider">
            <Timer className="w-4 h-4" />
            <span>{locale === "bn" ? "সীমিত সময়ের বিশেষ অফার" : "Limited Time Festive Drop"}</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#FBF7F0]">
            {locale === "bn" ? "রমজান ও ঈদ কালেকশন অফার" : "Ramadan & Eid Early Drop Sale"}
          </h2>
          <p className="text-xs sm:text-sm text-[#E9DDC9]/80 max-w-md">
            {locale === "bn"
              ? "কুপন কোড RAMADAN2026 ব্যবহারে ₹২,০০০-এর উপরে অর্ডারে পাচ্ছেন ফ্ল্যাট ₹২০০ নগদ ছাড়।"
              : "Use coupon RAMADAN2026 at checkout to save flat ₹200 on all orders over ₹2,000."}
          </p>
        </div>

        {/* Center Countdown Timer Blocks */}
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex flex-col items-center bg-[#14372E] border border-[#A8834A]/50 rounded-xl p-2.5 sm:p-3 min-w-[64px] sm:min-w-[76px] shadow-lg">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#C5A059]">
              {formatNum(timeLeft.days)}
            </span>
            <span className="text-[10px] text-[#E9DDC9]/70 uppercase tracking-wider font-semibold">
              {locale === "bn" ? "দিন" : "Days"}
            </span>
          </div>

          <span className="text-2xl font-bold text-[#C5A059]">:</span>

          <div className="flex flex-col items-center bg-[#14372E] border border-[#A8834A]/50 rounded-xl p-2.5 sm:p-3 min-w-[64px] sm:min-w-[76px] shadow-lg">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#C5A059]">
              {formatNum(timeLeft.hours)}
            </span>
            <span className="text-[10px] text-[#E9DDC9]/70 uppercase tracking-wider font-semibold">
              {locale === "bn" ? "ঘণ্টা" : "Hours"}
            </span>
          </div>

          <span className="text-2xl font-bold text-[#C5A059]">:</span>

          <div className="flex flex-col items-center bg-[#14372E] border border-[#A8834A]/50 rounded-xl p-2.5 sm:p-3 min-w-[64px] sm:min-w-[76px] shadow-lg">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#C5A059]">
              {formatNum(timeLeft.minutes)}
            </span>
            <span className="text-[10px] text-[#E9DDC9]/70 uppercase tracking-wider font-semibold">
              {locale === "bn" ? "মিনিট" : "Mins"}
            </span>
          </div>

          <span className="text-2xl font-bold text-[#C5A059]">:</span>

          <div className="flex flex-col items-center bg-[#14372E] border border-[#A8834A]/50 rounded-xl p-2.5 sm:p-3 min-w-[64px] sm:min-w-[76px] shadow-lg">
            <span className="text-2xl sm:text-3xl font-mono font-bold text-[#C5A059]">
              {formatNum(timeLeft.seconds)}
            </span>
            <span className="text-[10px] text-[#E9DDC9]/70 uppercase tracking-wider font-semibold">
              {locale === "bn" ? "সেকেন্ড" : "Secs"}
            </span>
          </div>
        </div>

        {/* Right CTA */}
        <div>
          <Link
            href={`/${locale}/shop?collection=eid-collection`}
            className="px-5 py-3 rounded-xl bg-[#C5A059] hover:bg-[#A8834A] text-[#1C1B18] font-bold text-xs sm:text-sm shadow-md transition-all inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4" />
            <span>{locale === "bn" ? "অফার ক্যাটালগ দেখুন" : "Shop Eid Drop"}</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
