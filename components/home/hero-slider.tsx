"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { ChevronLeft, ChevronRight, ArrowRight, MessageCircle, Sparkles, ShieldCheck } from "lucide-react";

interface HeroSlide {
  id: number;
  titleBn: string;
  titleEn: string;
  subtitleBn: string;
  subtitleEn: string;
  badgeBn: string;
  badgeEn: string;
  ctaLink: string;
  ctaTextBn: string;
  ctaTextEn: string;
  bgGradient: string;
  accentColor: string;
  image: string;
  tagBn: string;
  tagEn: string;
  highlightBn: string;
  highlightEn: string;
}

const slides: HeroSlide[] = [
  {
    id: 1,
    titleBn: "শালীনতার আভিজাত্যে নিজেকে সাজান",
    titleEn: "Modesty, Beautifully Made for Bengal",
    subtitleBn: "প্রিমিয়াম কোরিয়ান নিদা ও নরম শিফনে তৈরি মার্জিত বোরকা ও দুবাই রাজকীয় আবায়া কালেকশন।",
    subtitleEn: "Exquisite Korean Nida & Dubai Cherry abayas handcrafted with graceful, full-coverage silhouettes.",
    badgeBn: "রমজান ও ঈদ স্পেশাল ২০২৬",
    badgeEn: "Ramadan & Eid Drop 2026",
    ctaLink: "/shop?category=abaya",
    ctaTextBn: "আবায়া কালেকশন দেখুন",
    ctaTextEn: "Explore Abayas",
    bgGradient: "from-[#14372E] via-[#0E2821] to-[#0A1D18]",
    accentColor: "#C5A059",
    image: "/demo/abaya-dubai-kaftan.webp",
    tagBn: "দুবাই রয়্যাল কাফতান",
    tagEn: "Dubai Royal Kaftan",
    highlightBn: "খাঁটি কোরিয়ান নিদা ও প্রিমিয়াম সিল্ক",
    highlightEn: "Pure Korean Nida & Premium Silk",
  },
  {
    id: 2,
    titleBn: "খাঁটি সুতি ও ঐতিহ্যবাহী লখনউই পাঞ্জাবি",
    titleEn: "Authentic Handloom Chikankari & Jubbas",
    subtitleBn: "ঈদের সকালের নামাজের জন্য শতভাগ আরামদায়ক সুতি চিকেনকারি পাঞ্জাবি ও রাজকীয় কাবলি সেট।",
    subtitleEn: "Fine 60s combed cotton with artisanal threadwork and tailored Emirati thobes for men & boys.",
    badgeBn: "খাঁটি বেঙ্গল হ্যান্ডলুম কালেকশন",
    badgeEn: "Bengal Handloom Heritage",
    ctaLink: "/shop?category=panjabi",
    ctaTextBn: "পাঞ্জাবি ও কাবলি দেখুন",
    ctaTextEn: "Shop Panjabi & Thobes",
    bgGradient: "from-[#192A24] via-[#14231E] to-[#0E1A16]",
    accentColor: "#E5C378",
    image: "/demo/panjabi-chikankari-white.webp",
    tagBn: "হ্যান্ডক্রাফটেড লখনউই",
    tagEn: "Handcrafted Chikankari",
    highlightBn: "শতভাগ আরামদায়ক নরম সুতি",
    highlightEn: "100% Breathable Fine Cotton",
  },
  {
    id: 3,
    titleBn: "দৈনন্দিন আরামদায়ক ফ্রেঞ্চ জিলবাব ও হিজাব",
    titleEn: "French Jilbabs & Non-Slip Hijab Essentials",
    subtitleBn: "অফিস, কলেজ ও দৈনন্দিন চলাফেরার জন্য পিনমুক্ত মোডাল জার্সি, শিফন হিজাব ও ৩-লেয়ার নিকাব।",
    subtitleEn: "Two-piece Medina Silk jilbabs, instant slip-on hijabs and breathable 3-layer Saudi niqabs.",
    badgeBn: "দৈনন্দিন শালীন লাইফস্টাইল",
    badgeEn: "Daily Modesty Staples",
    ctaLink: "/shop?category=hijab",
    ctaTextBn: "হিজাব ও নিকাব দেখুন",
    ctaTextEn: "Explore Hijabs & Niqabs",
    bgGradient: "from-[#1C362C] via-[#132B22] to-[#0C1D17]",
    accentColor: "#DDE5DB",
    image: "/demo/hijab-chiffon-sage.webp",
    tagBn: "নন-স্লিপ বাবল শিফন",
    tagEn: "Non-Slip Bubble Chiffon",
    highlightBn: "সারাদিন পিন ছাড়া সহজে পরিধানযোগ্য",
    highlightEn: "All-day comfort without slipping",
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
    <section className="relative overflow-hidden bg-[#14372E] text-[#FBF7F0] min-h-[540px] sm:min-h-[600px] lg:min-h-[660px] flex items-center transition-colors duration-700">
      {/* Decorative Islamic Geometric Pattern Overlay (Preserved user's beloved pattern) */}
      <div className="absolute inset-0 opacity-15 pointer-events-none z-0">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="archGrid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 30 0 L 60 30 L 30 60 L 0 30 Z" fill="none" stroke="#C5A059" strokeWidth="1" />
              <circle cx="30" cy="30" r="3.5" fill="#C5A059" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#archGrid)" />
        </svg>
      </div>

      {/* Dynamic Slide Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-r ${activeSlide.bgGradient} opacity-90 transition-all duration-700 pointer-events-none z-0`} />

      {/* Decorative Mihrab Arch Silhouette Backdrop */}
      <div className="absolute -right-20 -bottom-20 w-[420px] h-[420px] rounded-full border-[40px] border-[#C5A059]/10 pointer-events-none hidden lg:block z-0" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 lg:py-16 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-5 sm:space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-black/30 border border-[#C5A059]/50 text-xs sm:text-sm font-semibold text-[#E9DDC9] shadow-sm backdrop-blur-xs">
              <Sparkles className="w-4 h-4 text-[#C5A059]" />
              <span>{locale === "bn" ? activeSlide.badgeBn : activeSlide.badgeEn}</span>
            </div>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#FBF7F0] leading-[1.18] drop-shadow-sm">
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
                <span>{locale === "bn" ? activeSlide.ctaTextBn : activeSlide.ctaTextEn}</span>
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
                className="px-5 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#FBF7F0] border border-white/20 font-semibold text-sm sm:text-base transition-all flex items-center gap-2 backdrop-blur-xs"
              >
                <MessageCircle className="w-4 h-4 text-[#25D366]" />
                <span>{locale === "bn" ? "হোয়াটসঅ্যাপে অর্ডার" : "Order via WhatsApp"}</span>
              </a>
            </div>

            {/* Micro Highlights Pill */}
            <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-[#E9DDC9]/80 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
              <span>{locale === "bn" ? activeSlide.highlightBn : activeSlide.highlightEn}</span>
            </div>
          </div>

          {/* Right Hero Image Card with Islamic Mihrab Arch Frame */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative group">
              {/* Glow backdrop */}
              <div className="absolute -inset-2 bg-gradient-to-tr from-[#C5A059]/30 via-[#E9DDC9]/20 to-transparent rounded-t-[160px] rounded-b-3xl blur-xl opacity-75 group-hover:opacity-100 transition-opacity" />

              {/* Mihrab Arch Frame */}
              <div className="relative w-64 sm:w-72 lg:w-80 h-[380px] sm:h-[420px] rounded-t-[160px] rounded-b-2xl border-2 border-[#C5A059]/60 p-2.5 bg-black/25 backdrop-blur-md shadow-2xl overflow-hidden flex flex-col">
                <div className="relative w-full h-full rounded-t-[150px] rounded-b-xl overflow-hidden">
                  <Image
                    src={activeSlide.image}
                    alt={locale === "bn" ? activeSlide.titleBn : activeSlide.titleEn}
                    fill
                    sizes="(max-width: 768px) 280px, 340px"
                    priority
                    className="object-cover object-top hover:scale-105 transition-transform duration-700"
                  />
                  {/* Bottom Vignette & Tag */}
                  <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent p-4 flex flex-col justify-end text-center">
                    <span className="text-[11px] uppercase tracking-wider text-[#C5A059] font-bold font-mono">
                      AZAD HAYA LUXURY
                    </span>
                    <span className="text-sm font-semibold text-[#FBF7F0] drop-shadow-sm">
                      {locale === "bn" ? activeSlide.tagBn : activeSlide.tagEn}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slider Controls */}
      <div className="absolute bottom-6 right-6 z-20 flex items-center gap-2">
        <button
          onClick={prevSlide}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-[#FBF7F0] border border-[#C5A059]/40 transition-colors shadow-md"
          aria-label="Previous slide"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <div className="flex gap-2 px-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrent(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === current ? "w-7 bg-[#C5A059]" : "w-2.5 bg-white/30 hover:bg-white/50"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>
        <button
          onClick={nextSlide}
          className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 text-[#FBF7F0] border border-[#C5A059]/40 transition-colors shadow-md"
          aria-label="Next slide"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </section>
  );
}
