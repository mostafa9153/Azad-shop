import Link from "next/link";
import Image from "next/image";
import { Locale } from "@/lib/i18n";
import { db } from "@/lib/db";
import { brandConfig } from "@/config/brand.config";
import { HeroSlider } from "@/components/home/hero-slider";
import { DropCountdown } from "@/components/home/drop-countdown";
import { ProductCard } from "@/components/product/product-card";
import {
  ShieldCheck,
  Scissors,
  Truck,
  Sparkles,
  ArrowRight,
  Star,
  MapPin,
  Clock,
  Phone,
} from "lucide-react";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  // Fetch real database records
  const [categories, newProducts, bestSellers, eidProducts] = await Promise.all([
    db.getCategories(),
    db.getProducts({ isNew: true, limit: 8 }),
    db.getProducts({ isBestseller: true, limit: 8 }),
    db.getProducts({ collectionSlug: "eid-collection", limit: 4 }),
  ]);

  return (
    <div className="space-y-12 sm:space-y-16 pb-12">
      {/* 1. Hero Slider */}
      <HeroSlider locale={locale} />

      {/* 2. Trust & Bengal Atelier Value Strip */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 bg-white p-6 sm:p-8 rounded-2xl border border-[#E9DDC9] shadow-xs">
          {/* Badge 1 */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#14372E]/10 flex items-center justify-center text-[#14372E] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1B18]">
                {locale === "bn" ? "১০০% শালীন পরিমাপ" : "100% Modest Cut"}
              </h4>
              <p className="text-xs text-[#1C1B18]/70 mt-0.5">
                {locale === "bn" ? "অস্বচ্ছ ও পূর্ণাঙ্গ পর্দার গ্যারান্টি" : "Non-sheer, full coverage assured"}
              </p>
            </div>
          </div>

          {/* Badge 2 */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#A8834A]/10 flex items-center justify-center text-[#A8834A] shrink-0">
              <Scissors className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1B18]">
                {locale === "bn" ? "কাস্টম সাইজ দরজি সেবা" : "Custom Tailoring"}
              </h4>
              <p className="text-xs text-[#1C1B18]/70 mt-0.5">
                {locale === "bn" ? "আপনার নিজস্ব মাপে তৈরি (+₹১৫০)" : "Handcrafted to your fit in 4 days"}
              </p>
            </div>
          </div>

          {/* Badge 3 */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#14372E]/10 flex items-center justify-center text-[#14372E] shrink-0">
              <Truck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1B18]">
                {locale === "bn" ? "ফ্রি এক্সপ্রেস ডেলিভারি" : "Free Delivery > ₹1,499"}
              </h4>
              <p className="text-xs text-[#1C1B18]/70 mt-0.5">
                {locale === "bn" ? "পশ্চিমবঙ্গ জুড়ে দ্রুত পৌঁছানো" : "Fast delivery across West Bengal"}
              </p>
            </div>
          </div>

          {/* Badge 4 */}
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-[#A8834A]/10 flex items-center justify-center text-[#A8834A] shrink-0">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#1C1B18]">
                {locale === "bn" ? "কলকাতা শোরুম সাপোর্ট" : "Park Circus Showroom"}
              </h4>
              <p className="text-xs text-[#1C1B18]/70 mt-0.5">
                {locale === "bn" ? "সরাসরি এসে ট্রায়াল ও পিকআপ" : "In-store trial & same-day pickup"}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Mihrab Arch Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#A8834A] tracking-widest uppercase">
              {locale === "bn" ? "ক্যাটাগরি অনুযায়ী দেখুন" : "Browse by Silhouette"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14372E] mt-1">
              {locale === "bn" ? "আমাদের বিশেষ কালেকশনসমূহ" : "Curated Modest Categories"}
            </h2>
          </div>
          <Link
            href={`/${locale}/shop`}
            className="text-xs sm:text-sm font-bold text-[#14372E] hover:text-[#A8834A] flex items-center gap-1.5 mt-2 sm:mt-0 transition-colors"
          >
            <span>{locale === "bn" ? "সকল পোশাক দেখুন" : "View All Categories"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* Mihrab Arch Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={`/${locale}/shop?category=${cat.slug}`}
              className="group flex flex-col items-center bg-white p-3 sm:p-4 rounded-2xl border border-[#E9DDC9] hover:border-[#14372E] hover:shadow-lg transition-all duration-300"
            >
              {/* Mihrab Arch Frame */}
              <div className="relative w-full aspect-[4/5] rounded-t-[70px] sm:rounded-t-[90px] rounded-b-xl overflow-hidden bg-[#FBF7F0] border border-[#E9DDC9] p-2">
                <Image
                  src={cat.image_url}
                  alt={locale === "bn" ? cat.name_bn : cat.name_en}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500 rounded-t-[65px] sm:rounded-t-[85px] rounded-b-lg"
                  unoptimized
                />
              </div>

              <div className="mt-3 text-center">
                <h3 className="font-serif text-base sm:text-lg font-bold text-[#1C1B18] group-hover:text-[#14372E] transition-colors">
                  {locale === "bn" ? cat.name_bn : cat.name_en}
                </h3>
                <p className="text-[11px] text-[#A8834A] font-medium mt-0.5 line-clamp-1">
                  {locale === "bn" ? cat.description_bn : cat.description_en}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 4. New In Arrivals Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#A8834A] tracking-widest uppercase flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
              {locale === "bn" ? "নতুন সংযোজন" : "Fresh Off the Loom"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14372E] mt-1">
              {locale === "bn" ? "নতুন আগমনী পোশাকসমূহ" : "New In Arrivals"}
            </h2>
          </div>
          <Link
            href={`/${locale}/shop?sort=newest`}
            className="text-xs sm:text-sm font-bold text-[#14372E] hover:text-[#A8834A] flex items-center gap-1.5 mt-2 sm:mt-0 transition-colors"
          >
            <span>{locale === "bn" ? "সকল নতুন পণ্য দেখুন" : "Explore All New In"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {newProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} locale={locale} priority={idx < 4} />
          ))}
        </div>
      </section>

      {/* 5. Complete 3-Piece Modest Set Feature Block */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#14372E] via-[#1C1B18] to-[#14372E] text-[#FBF7F0] p-6 sm:p-10 lg:p-12 border border-[#C5A059]/40 shadow-2xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4 sm:space-y-5">
              <span className="inline-block px-3 py-1 rounded-full bg-[#C5A059] text-[#1C1B18] text-xs font-bold uppercase tracking-wider">
                {locale === "bn" ? "কমপ্লিট শালীন কম্বো" : "The Complete Ensemble"}
              </span>

              <h2 className="font-serif text-2xl sm:text-4xl font-bold text-[#FBF7F0] leading-tight">
                {locale === "bn"
                  ? "রয়্যাল ৩-পিস শালীন কম্বো সেট: আবায়া + হিজাব + নিকাব"
                  : "Royal 3-Piece Modest Set: Abaya + Hijab + Niqab"}
              </h2>

              <p className="text-xs sm:text-sm text-[#E9DDC9]/90 max-w-xl leading-relaxed">
                {locale === "bn"
                  ? "একই শেড ও প্রিমিয়াম কোরিয়ান নিদায় তৈরি সম্পূর্ণ ম্যাচিং কম্বো। আলাদা আলাদা কেনায় যেখানে খরচ হয় ₹৫,২০০, কম্বো সেটে আপনি পাচ্ছেন মাত্র ₹৪,২৯৯ তে — সাথে ফ্রি এক্সপ্রেস ডেলিভারি!"
                  : "Color-matched elegance in breathable Korean Nida. Save over ₹900 compared to individual pieces and enjoy complimentary express delivery anywhere in Bengal."}
              </p>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-[#C5A059]">₹৪,২৯৯</span>
                  <span className="text-sm text-[#E9DDC9]/50 line-through ml-2">₹৫,২০০</span>
                </div>
                <Link
                  href={`/${locale}/product/royal-complete-three-piece-set-emerald`}
                  className="px-6 py-3 rounded-xl bg-[#C5A059] hover:bg-[#A8834A] text-[#1C1B18] font-bold text-xs sm:text-sm transition-all shadow-lg flex items-center gap-2"
                >
                  <span>{locale === "bn" ? "কম্বো সেটটি দেখুন" : "Shop the Set"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            <div className="lg:col-span-5 flex justify-center">
              <div className="relative w-64 h-84 rounded-t-[100px] rounded-b-2xl overflow-hidden border-2 border-[#C5A059]/60 shadow-2xl bg-[#FBF7F0]/10">
                <Image
                  src="/demo/set-complete-royal.webp"
                  alt="Royal 3-Piece Modest Set"
                  fill
                  className="object-cover"
                  unoptimized
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Drop Countdown Timer */}
      <DropCountdown locale={locale} />

      {/* 7. Best Sellers Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#A8834A] tracking-widest uppercase">
              {locale === "bn" ? "গ্রাহকদের সর্বাধিক পছন্দ" : "Most Loved Pieces"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-[#14372E] mt-1">
              {locale === "bn" ? "আজাদ হায়া বেস্টসেলার কালেকশন" : "AZAD HAYA Best Sellers"}
            </h2>
          </div>
          <Link
            href={`/${locale}/shop?sort=bestseller`}
            className="text-xs sm:text-sm font-bold text-[#14372E] hover:text-[#A8834A] flex items-center gap-1.5 mt-2 sm:mt-0 transition-colors"
          >
            <span>{locale === "bn" ? "সকল জনপ্রিয় পণ্য" : "View All Best Sellers"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} locale={locale} />
          ))}
        </div>
      </section>

      {/* 8. Customer Testimonials & Reviews */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-xs font-bold text-[#A8834A] tracking-widest uppercase">
            {locale === "bn" ? "গ্রাহকদের বিশ্বস্ত মন্তব্য" : "Verified Customer Feedback"}
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E] mt-1">
            {locale === "bn" ? "বাঙালি মুসলিম পরিবারের আস্থা" : "Trusted by Muslim Families in Bengal"}
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Review 1 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-[#C5A059] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#1C1B18]/80 leading-relaxed italic">
                &ldquo;কোরিয়ান নিদা কাপড়ের ফল অসাধারণ। কোনো স্বচ্ছ ভাব নেই এবং ওযু করার হাতাটা খুব সুবিধাজনক। আজাদ হায়া থেকে আরও অর্ডার করব ইনশাআল্লাহ।&rdquo;
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#E9DDC9]/50">
              <h4 className="text-xs font-bold text-[#14372E]">ফাতেমা বেগম</h4>
              <p className="text-[11px] text-[#1C1B18]/60">পার্ক সার্কাস, কলকাতা • ভেরিফায়েড ক্রেতা</p>
            </div>
          </div>

          {/* Review 2 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-[#C5A059] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#1C1B18]/80 leading-relaxed italic">
                &ldquo;দুবাই রয়্যাল কাফতান আবায়াটি যেমন ছবিতে দেখেছি বাস্তবেও ঠিক তেমনই রাজকীয়। ইনার স্লিপের সাথে বেল্টটি খুব সুন্দর লুক দেয়।&rdquo;
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#E9DDC9]/50">
              <h4 className="text-xs font-bold text-[#14372E]">রেহানা পারভীন</h4>
              <p className="text-[11px] text-[#1C1B18]/60">হাওড়া, পশ্চিমবঙ্গ • ভেরিফায়েড ক্রেতা</p>
            </div>
          </div>

          {/* Review 3 */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex gap-1 text-[#C5A059] mb-3">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-[#1C1B18]/80 leading-relaxed italic">
                &ldquo;লখনউই চিকেনকারি সুতি পাঞ্জাবিটির ফিনিশিং দুর্দান্ত। ঈদের সকালের নামাজের জন্য সেরা পছন্দ। সময়মতো ডেলিভারি পেয়েছি।&rdquo;
              </p>
            </div>
            <div className="mt-4 pt-4 border-t border-[#E9DDC9]/50">
              <h4 className="text-xs font-bold text-[#14372E]">তারিকুল ইসলাম</h4>
              <p className="text-[11px] text-[#1C1B18]/60">জাকারিয়া স্ট্রিট, কলকাতা • ভেরিফায়েড ক্রেতা</p>
            </div>
          </div>
        </div>
      </section>

      {/* 9. Bardhaman Showroom Location & Directions */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="bg-[#E9DDC9]/40 border border-[#E9DDC9] rounded-3xl p-6 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <span className="text-xs font-bold text-[#14372E] tracking-widest uppercase">
              {locale === "bn" ? "সরাসরি শোরুমে আসুন" : "Visit Our Bardhaman Showroom"}
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E]">
              {locale === "bn" ? "বর্ধমান স্টেশন ও কার্জন গেট শোরুম" : "Bardhaman Station & Curzon Gate Atelier"}
            </h2>
            <p className="text-xs sm:text-sm text-[#1C1B18]/80 leading-relaxed">
              {locale === "bn"
                ? "অনলাইনে অর্ডারের পাশাপাশি আমাদের বর্ধমান শোরুমে এসে সরাসরি ফ্যাব্রিক পরীক্ষা করে দেখুন ও দক্ষ কারিগর দিয়ে মাপ দিন।"
                : "Experience the touch of authentic Korean Nida and Medina Silk in person, with on-site custom tailoring fitting consultations at our Bardhaman atelier."}
            </p>

            <div className="space-y-2 text-xs sm:text-sm text-[#1C1B18] pt-1">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#A8834A] shrink-0 mt-0.5" />
                <span>{locale === "bn" ? brandConfig.shop.address.bn : brandConfig.shop.address.en}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#A8834A] shrink-0" />
                <span>{locale === "bn" ? brandConfig.shop.openingHours.bn : brandConfig.shop.openingHours.en}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#A8834A] shrink-0" />
                <span>{brandConfig.contact.phone}</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">
            <a
              href="https://maps.google.com/?q=Bardhaman+Railway+Station+West+Bengal"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-[#14372E] text-[#FBF7F0] font-bold text-xs sm:text-sm hover:bg-[#14372E]/90 transition-all shadow-md text-center flex items-center justify-center gap-2"
            >
              <MapPin className="w-4 h-4" />
              <span>{locale === "bn" ? "গুগল ম্যাপে দিকনির্দেশ" : "Get Directions"}</span>
            </a>
            <a
              href={`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(
                locale === "bn" ? "শোরুম ভিজিটের সময় ও লোকেশন জানতে চাই" : "Inquiry about showroom visit and location"
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl bg-white border border-[#E9DDC9] text-[#14372E] font-bold text-xs sm:text-sm hover:bg-[#FBF7F0] transition-colors text-center"
            >
              {locale === "bn" ? "ভিজিটের সময় নিশ্চিত করুন" : "Book Showroom Appointment"}
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
