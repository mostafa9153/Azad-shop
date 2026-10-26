import { Locale } from "@/lib/i18n";
import { Scissors, Clock, CheckCircle2, Ruler, Sparkles, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function CustomTailoringPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const steps = [
    {
      num: "০১",
      title_bn: "মাপ প্রদান করুন",
      title_en: "Submit Measurements",
      desc_bn: "প্রোডাক্ট পেজে 'কাস্টম সাইজ' ক্লিক করে আপনার উচ্চতা, বুকের মাপ, হাতার দৈর্ঘ্য ইঞ্চি ইউনিটে দিন।",
      desc_en: "Toggle 'Custom Size' on any product page and specify your exact height, bust, and sleeve length in inches.",
    },
    {
      num: "০২",
      title_bn: "কারিগর বরাদ্দ ও কাটিং",
      title_en: "Artisan Allocation",
      desc_bn: "আমাদের সিনিয়র উস্তাদ কারিগর আপনার মাপ অনুযায়ী সুনির্দিষ্টভাবে প্যাটার্ন তৈরি করে কাটিং সম্পন্ন করেন।",
      desc_en: "Our senior Kolkata master tailor personally drafts your custom pattern and hand-cuts the fabric.",
    },
    {
      num: "০৩",
      title_bn: "৪ দিনের মধ্যে সেলাই ও QC",
      title_en: "4-Day Stitch & QC",
      desc_bn: "দ্বিগুণ সেলাই, সুতা লক ও নিখুঁত আয়রনের পর কোয়ালিটি কন্ট্রোল টিম ফিনিশিং পরীক্ষা করে।",
      desc_en: "Interlocked reinforced stitching followed by rigorous millimeter quality inspection.",
    },
    {
      num: "০৪",
      title_bn: "নিরাপদ প্যাকেজিং ও ডেলিভারি",
      title_en: "Express Delivery",
      desc_bn: "লাক্সারি বক্সে প্যাকেজ করে কুরিয়ারের মাধ্যমে সরাসরি আপনার ঠিকানায় পৌঁছে দেওয়া হয়।",
      desc_en: "Packed in our signature gold-embossed box and dispatched via express Bengal courier.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF7F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14372E]/10 text-[#14372E] text-xs font-semibold">
            <Scissors className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{locale === "bn" ? "কলকাতা কারিগরি সেবা" : "Kolkata Atelier Service"}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-[#14372E]">
            {locale === "bn" ? "৪ দিনের বিশেষ কাস্টম দরজি সেবা (+₹১৫০)" : "4-Day Bespoke Tailoring Service (+₹150)"}
          </h1>
          <p className="text-xs sm:text-sm text-[#1C1B18]/70 max-w-xl mx-auto">
            {locale === "bn"
              ? "স্ট্যান্ডার্ড সাইজ নয়—সরাসরি আপনার ব্যক্তিগত শরীরের মাপে নিখুঁত আরাম ও শতভাগ শালীন আবায়া।"
              : "No ready-made compromises. Crafted millimeter-exact to your individual silhouette by master artisans."}
          </p>
        </div>

        {/* 4 Step Process Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {steps.map((st, i) => (
            <div
              key={i}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-2xs space-y-3 relative overflow-hidden"
            >
              <span className="font-serif text-4xl font-bold text-[#A8834A]/20 absolute top-4 right-6 select-none">
                {st.num}
              </span>
              <div className="w-10 h-10 rounded-xl bg-[#14372E] text-[#C5A059] flex items-center justify-center font-bold text-sm">
                {i + 1}
              </div>
              <h3 className="font-serif text-lg font-bold text-[#14372E]">
                {locale === "bn" ? st.title_bn : st.title_en}
              </h3>
              <p className="text-xs sm:text-sm text-[#1C1B18]/70 leading-relaxed">
                {locale === "bn" ? st.desc_bn : st.desc_en}
              </p>
            </div>
          ))}
        </div>

        {/* Guarantees */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-xs space-y-4">
          <h2 className="font-serif text-xl font-bold text-[#14372E]">
            {locale === "bn" ? "আমাদের কাস্টম দরজি অঙ্গীকার" : "Our Tailoring Commitment"}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-[#1C1B18]/80">
            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FBF7F0]">
              <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#14372E] block">
                  {locale === "bn" ? "৪ দিনের ডেলিভারি প্রতিশ্রুতি" : "4-Day Guarantee"}
                </span>
                <span>{locale === "bn" ? "অর্ডারের ৪ কার্যদিবসের মধ্যে সেলাই সম্পন্ন।" : "Dispatched within 4 business days."}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FBF7F0]">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#14372E] block">
                  {locale === "bn" ? "ফিটিং সন্তুষ্টি গ্যারান্টি" : "Fit Guarantee"}
                </span>
                <span>{locale === "bn" ? "মাপে অসঙ্গতি থাকলে বিনামূল্যে অল্টারেশন।" : "Free alteration if fit deviates."}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-[#FBF7F0]">
              <Scissors className="w-4 h-4 text-[#14372E] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold text-[#14372E] block">
                  {locale === "bn" ? "নামমাত্র ₹১৫০ ফি" : "Nominal ₹150 Fee"}
                </span>
                <span>{locale === "bn" ? "সরাসরি কারিগর মজুরির জন্য সংরক্ষিত।" : "Directly distributed to master tailors."}</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-4">
          <Link
            href={`/${locale}/shop`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-[#14372E] text-white font-bold text-xs shadow-lg hover:bg-[#14372E]/90 transition-all hover:scale-105"
          >
            <span>{locale === "bn" ? "কালেকশন থেকে পোশাক পছন্দ করুন" : "Browse Catalog to Customize"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
