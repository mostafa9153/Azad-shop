"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { ChevronLeft, ChevronRight, ArrowRight, MessageCircle, Sparkles } from "lucide-react";

interface HeroSlide {
  id: number;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  badgeBn: string;
  badgeEn: string;
  ctaLink: string;
  bgColor: string;
  accentColor: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    titleBn: "শালীনতার আভিজাত্যে নিজেকে সাজান",
    titleEn: "Modesty, Beautifully Made for Bengal",
    subtitleBn: "প্রিমিয়াম কোরিয়ান নিদা ও নরম শিফনে তৈরি মার্জিত বোরকা ও দুবাই আবায়া কালেকশন।",
    subtitleEn: "Exquisite Korean Nida & Dubai Cherry abayas handcrafted with graceful, full-coverage silhouettes.",
    badgeBn: "রমজান ও ঈদ স্পেশাল ২০২৬",
    badgeEn: "Ramadan & Eid Drop 2026",
    ctaLink: "/shop?collection=eid-collection",
    bgColor: "#14372E",
    accentColor: "#C5A059",
  },
  {
    id: 2,
    titleBn: "খাঁটি সুতি ও ঐতিহ্যবাহী লখনউই পাঞ্জাবি",
    titleEn: "Authentic Handloom Chikankari & Jubbas",
    subtitleBn: "ঈদের সকালের নামাজের জন্য শতভাগ আরামদায়ক সুতি চিকেনকারি পাঞ্জাবি ও রাজকীয় কাবলি সেট।",
    subtitleEn: "Fine 60s combed cotton with artisanal threadwork and tailored Emirati thobes for men & boys.",
    badgeBn: "খাঁটি বেঙ্গল হ্যান্ডলুম",
    badgeEn: "Bengal Handloom Heritage",
    ctaLink: "/shop?category=panjabi",
    bgColor: "#1C1B18",
    accentColor: "#E5C378",
  },
  {
    id: 3,
    titleBn: "দৈনন্দিন আরামদায়ক ফ্রেঞ্চ জিলবাব ও হিজাব",
    titleEn: "French Jilbabs & Non-Slip Hijab Essentials",
    subtitleBn: "অফিস, কলেজ ও দৈনন্দিন চলাফেরার জন্য পিনমুক্ত মোডাল জার্সি ও বাবল শিফন হিজাব।",
    subtitleEn: "Two-piece Medina Silk jilbabs, instant slip-on hijabs and breathable 3-layer Saudi niqabs.",
    badgeBn: "দৈনন্দিন শালীনতা",
    badgeEn: "Daily Modesty Staples",
    ctaLink: "/shop?category=jilbab",
    bgColor: "#2D4B3E",
    accentColor: "#DDE5DB",
  },
];

export function HeroSlider({ locale }: { locale: Locale }) {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const activeSlide = slides[current];

  return (
    <section className="relative overflow-hidden bg-[#14372E] text-[#FBF7F0] min-h-[500px] sm:min-h-[580px] lg:min-h-[640px] flex items-center">
      {/* Decorative Islamic Geometric Pattern Overlay */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="archGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 60 30 L 30 60 L 0 30 Z" fill="none" stroke="#C5A059" strokeWidth="1" />
              <circle cx="30" cy="30" r="4" fill="#C5A059" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#archGrid)" />
        </svg>
      </div>

      {/* Decorative Mihrab Arch Silhouette Backdrop */}
      <div className="absolute -right-24 -bottom-24 w-96 h-96 rounded-full border-[40px] border-[#C5A059]/10 pointer-events-none hidden lg:block" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-8 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 border border-[#C5A059]/40 text-xs sm:text-sm font-semibold text-[#E9DDC9]">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>{locale === "bn" ? activeSlide.badgeBn : activeSlide.badgeEn}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FBF7F0] leading-[1.15]">
              {locale === "bn" ? activeSlide.titleBn : activeSlide.titleEn}
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-[#E9DDC9]/90 max-w-2xl leading-relaxed">
              {locale === "bn" ? activeSlide.subtitleBn : activeSlide.subtitleEn}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                href={`/${locale}${activeSlide.ctaLink}`}
                className="px-6 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#A8834A] text-[#1C1B18] font-bold text-sm sm:text-base transition-all shadow-lg hover:shadow-xl flex items-center gap-2 group"
              >
                <span>{locale === "bn" ? "কালেকশন দেখুন" : "Explore Drop"}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href={`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(
                  locale === "bn"
                    ? "আসসালামু আলাইকুম, আমি আজাদ হায়ার নতুন কালেকশন সম্পর্কে পরামর্শ চাই।"
                    : "Assalamu Alaikum, I would like consultation on AZAD HAYA modest wear."
                )}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FBF7F0] border border-white/20 font-semibold text-sm sm:text-base transition-all flex items-center gap-2"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{locale === "bn" ? "হোয়াটসঅ্যাপে অর্ডার" : "Order via WhatsApp"}</span>
              </a>
            </div>
          </div>

          {/* Right Featured Motif Frame */}
          <div className="lg:col-span-4 hidden lg:flex justify-center">
            <div className="relative w-64 h-80 rounded-t-[120px] rounded-b-2xl border-2 border-[#C5A059]/40 p-3 bg-white/5 backdrop-blur-xs shadow-2xl flex flex-col items-center justify-center text-center">
              <div className="w-16 h-16 rounded-full bg-[#C5A059]/20 border border-[#C5A059] flex items-center justify-center mb-4">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" className="text-[#C5A059]">
                  <path d="M12 2L15 8L21 9L17 14L18 20L12 17L6 20L7 14L3 9L9 8L12 2Z" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </div>
              <h3 className="font-serif text-xl font-bold text-[#E9DDC9]">
                {locale === "bn" ? "আজাদ হায়া ওয়াদা" : "The AZAD HAYA Promise"}
              </h3>
              <p className="text-xs text-[#E9DDC9]/70 mt-2 px-3">
                {locale === "bn"
                  ? "১০০% শালীন ও স্বচ্ছতাহীন প্রিমিয়াম ফ্যাব্রিক, বাংলার নিজস্ব কারিগর দ্বারা তৈরি।"
                  : "Zero sheer, non-clinging modest fabrics crafted by experienced Bengal artisans."}
              </p>
              <div className="mt-4 pt-3 border-t border-[#C5A059]/30 text-[11px] font-mono text-[#C5A059]">
                KOLKATA • EST. 2026
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={prevSlide}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-[#FBF7F0] border border-white/20 transition-colors"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-1.5 px-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-1.5 rounded-full transition-all ${
                idx === current ? "w-6 bg-[#C5A059]" : "w-2 bg-white/40"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="p-2 rounded-full bg-black/30 hover:bg-black/50 text-[#FBF7F0] border border-white/20 transition-colors"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
