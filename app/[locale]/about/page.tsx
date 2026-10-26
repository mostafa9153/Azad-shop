import { Locale } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import Link from "next/link";
import { ShieldCheck, HeartHandshake, Scissors, MapPin, Sparkles, ArrowRight } from "lucide-react";

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  return (
    <div className="min-h-screen bg-[#FBF7F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Hero Section */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14372E]/10 text-[#14372E] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{locale === "bn" ? "আমাদের ঐতিহ্য ও গল্প" : "Our Heritage & Story"}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#14372E]">
            {locale === "bn" ? brandConfig.name.bn : brandConfig.name.en}
          </h1>
          <p className="text-base sm:text-lg text-[#1C1B18]/80 font-serif italic max-w-2xl mx-auto">
            &ldquo;{locale === "bn" ? brandConfig.tagline.bn : brandConfig.tagline.en}&rdquo;
          </p>
        </div>

        {/* Narrative */}
        <div className="bg-white p-6 sm:p-10 rounded-3xl border border-[#E9DDC9] shadow-sm space-y-6 text-[#1C1B18] text-sm sm:text-base leading-relaxed">
          <h2 className="font-serif text-2xl font-bold text-[#14372E] flex items-center gap-2">
            <span className="w-2.5 h-6 bg-[#C5A059] rounded-full" />
            <span>{locale === "bn" ? "কলকাতার হৃদয়ে শালীনতার পুনর্জন্ম" : "Revitalizing Modesty from the Heart of Kolkata"}</span>
          </h2>

          <p>
            {locale === "bn"
              ? "ঐতিহাসিক জাকারিয়া স্ট্রিটের আলো-ছায়া আর মেটিয়াবুরুজের সুপ্রাচীন দর্জি ঐতিহ্যের কোল ঘেঁষে আজাদ হায়ার যাত্রা শুরু। আমাদের লক্ষ্য কেবল পোশাক তৈরি নয়—বরং বাংলার প্রতিটি আত্মমর্যাদাশীল নারীর জন্য এমন পোশাক উপহার দেওয়া, যা পরিপূর্ণ শালীনতার নিশ্চয়তা দেয় এবং আভিজাত্যে কোনো আপস করে না।"
              : "Rooted in the historic artisan lanes of Zakaria Street and the generational master-tailoring heritage of Metiabruz, AZAD HAYA was founded with a singular conviction: modesty without compromise, elegance without ostentation."}
          </p>

          <p>
            {locale === "bn"
              ? "আমরা বিশ্বাস করি শালীনতা হলো ব্যক্তির নিজস্ব স্বাধীনতা ও সৌন্দর্যের প্রকাশ। প্রতিটি বোরখা, আবায়া, জিলবাব ও পাঞ্জাবি তৈরিতে আমরা বিশ্বমানের কোরিয়ান নিদা, দুবাই চেরি এবং খাঁটি তুর্কি মদিনা সিল্ক আমদানি করি, যা অত্যন্ত আরামদায়ক, অপাক (অভ্যন্তরীণ দৃশ্যমান নয়) এবং দীর্ঘস্থায়ী।"
              : "We believe true modesty is empowerment. Every abaya, burkha, jilbab, and chikankari panjabi is crafted using authentic imported Korean Nida, Dubai Cherry, and Medina Silk—ensuring complete opacity, breathable drape, and uncompromising craftsmanship."}
          </p>

          {/* 3 Pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-6">
            <div className="p-5 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#14372E] text-[#C5A059] flex items-center justify-center mx-auto">
                <Scissors className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-[#14372E]">
                {locale === "bn" ? "উস্তাদ কারিগর" : "Master Artisans"}
              </h3>
              <p className="text-xs text-[#1C1B18]/70">
                {locale === "bn"
                  ? "বাংলার ঐতিহ্যবাহী কারিগরদের নিখুঁত হাতে কাটা ও সেলাই।"
                  : "Precision-crafted by generational master cutters and tailors in Bengal."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#14372E] text-[#C5A059] flex items-center justify-center mx-auto">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-[#14372E]">
                {locale === "bn" ? "১০০% অপাক ফ্যাব্রিক" : "100% Opacity"}
              </h3>
              <p className="text-xs text-[#1C1B18]/70">
                {locale === "bn"
                  ? "কোনো আলোর নিচেও স্বচ্ছ নয়—সম্পূর্ণ শরিয়াহ সম্মত শালীন কাটিং।"
                  : "Double-checked fabrics with zero sheer under bright daylight."}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] text-center space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#14372E] text-[#C5A059] flex items-center justify-center mx-auto">
                <HeartHandshake className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-[#14372E]">
                {locale === "bn" ? "ন্যায্য মজুরি" : "Ethical Workshop"}
              </h3>
              <p className="text-xs text-[#1C1B18]/70">
                {locale === "bn"
                  ? "আমাদের প্রতিটি কারিগরের জন্য সম্মানজনক ও ন্যায্য পারিশ্রমিক।"
                  : "Fair living wages and safe dignified environment for every artisan."}
              </p>
            </div>
          </div>
        </div>

        {/* Flagship Showroom Banner */}
        <div className="bg-[#14372E] text-[#FBF7F0] p-8 rounded-3xl flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
              {locale === "bn" ? "কলকাতায় আমাদের ফ্ল্যাগশিপ স্টোর" : "Visit Our Kolkata Showroom"}
            </span>
            <h3 className="font-serif text-2xl font-bold">
              {locale === "bn" ? "সরাসরি এসে ট্রায়াল দিন ও পরামর্শ নিন" : "Experience Fabrics & Fit in Person"}
            </h3>
            <p className="text-xs text-[#E9DDC9]/80 max-w-md">
              {locale === "bn" ? brandConfig.shop.address.bn : brandConfig.shop.address.en}
              <br />
              {locale === "bn" ? brandConfig.shop.openingHours.bn : brandConfig.shop.openingHours.en}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 shrink-0">
            <Link
              href={`/${locale}/contact`}
              className="px-5 py-2.5 rounded-xl bg-[#C5A059] text-[#1C1B18] font-bold text-xs hover:bg-[#C5A059]/90 text-center transition-colors"
            >
              {locale === "bn" ? "ডিরেকশন ও যোগাযোগ" : "Location & Contact"}
            </Link>
            <Link
              href={`/${locale}/shop`}
              className="px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-xs hover:bg-white/20 text-center transition-colors flex items-center justify-center gap-1.5"
            >
              <span>{locale === "bn" ? "অনলাইন কালেকশন দেখুন" : "Shop Online"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
