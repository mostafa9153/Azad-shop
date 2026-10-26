import { Locale } from "@/lib/i18n";
import { Ruler, Scissors, CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export default async function SizeGuidePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const abayaSizes = [
    { size: "50", height: "4'10\" - 5'0\" (147 - 152 cm)", length: "50\"", bust: "42\" - 44\"", sleeve: "26\"" },
    { size: "52", height: "5'0\" - 5'2\" (152 - 157 cm)", length: "52\"", bust: "44\" - 46\"", sleeve: "27\"" },
    { size: "54", height: "5'2\" - 5'4\" (157 - 162 cm)", length: "54\"", bust: "46\" - 48\"", sleeve: "28\"" },
    { size: "56", height: "5'4\" - 5'6\" (162 - 167 cm)", length: "56\"", bust: "48\" - 50\"", sleeve: "29\"" },
    { size: "58", height: "5'6\" - 5'8\" (167 - 172 cm)", length: "58\"", bust: "50\" - 52\"", sleeve: "30\"" },
    { size: "60", height: "5'8\" - 5'10\" (172 - 178 cm)", length: "60\"", bust: "52\" - 54\"", sleeve: "30.5\"" },
  ];

  const kurtiSizes = [
    { size: "M (38)", chest: "38\"", waist: "34\"", hips: "40\"", shoulder: "14.5\"" },
    { size: "L (40)", chest: "40\"", waist: "36\"", hips: "42\"", shoulder: "15\"" },
    { size: "XL (42)", chest: "42\"", waist: "38\"", hips: "44\"", shoulder: "15.5\"" },
    { size: "XXL (44)", chest: "44\"", waist: "40\"", hips: "46\"", shoulder: "16\"" },
    { size: "3XL (46)", chest: "46\"", waist: "42\"", hips: "48\"", shoulder: "16.5\"" },
  ];

  return (
    <div className="min-h-screen bg-[#FBF7F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14372E]/10 text-[#14372E] text-xs font-semibold">
            <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{locale === "bn" ? "পরিমাপ নির্দেশিকা" : "Measurement Chart"}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14372E]">
            {locale === "bn" ? "সাইজ গাইড ও মাপার নিয়ম" : "Size Guide & Fit Manual"}
          </h1>
          <p className="text-xs sm:text-sm text-[#1C1B18]/70 max-w-xl mx-auto">
            {locale === "bn"
              ? "আবায়া নির্বাচন সাধারণত শরীরের উচ্চতা অনুযায়ী হয়ে থাকে। নিচে আপনার জন্য সঠিক সাইজ খুঁজে নিন।"
              : "Abaya sizing is primarily based on total height from shoulder to floor. Find your ideal fit below."}
          </p>
        </div>

        {/* Abaya Height Table */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9DDC9]">
            <h2 className="font-serif text-xl font-bold text-[#14372E]">
              {locale === "bn" ? "১. আবায়া ও বোরকা উচ্চতা রূপান্তর চার্ট" : "1. Abaya & Burkha Height Chart"}
            </h2>
            <span className="text-xs font-bold text-[#A8834A]">
              {locale === "bn" ? "শালীন ঢিলেঢালা ফিট" : "Modest Comfort Fit"}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#14372E] text-[#FBF7F0]">
                <tr>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4">{locale === "bn" ? "আপনার উচ্চতা (ফুট / সেমি)" : "Customer Height"}</th>
                  <th className="py-3 px-4 text-center">{locale === "bn" ? "পোশাকের লম্বা" : "Garment Length"}</th>
                  <th className="py-3 px-4 text-center">{locale === "bn" ? "বুকের মাপ" : "Bust / Chest"}</th>
                  <th className="py-3 px-4 text-center">{locale === "bn" ? "হাতার লম্বা" : "Sleeve"}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9DDC9]">
                {abayaSizes.map((row) => (
                  <tr key={row.size} className="hover:bg-[#FBF7F0]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-sm text-[#14372E]">{row.size}</td>
                    <td className="py-3 px-4 font-medium text-[#1C1B18]">{row.height}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#14372E]">{row.length}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#1C1B18]/70">{row.bust}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#1C1B18]/70">{row.sleeve}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Kurti & Set Table */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E9DDC9]">
            <h2 className="font-serif text-xl font-bold text-[#14372E]">
              {locale === "bn" ? "২. কুর্তি, পাঞ্জাবি ও কো-অর্ড সেট চার্ট" : "2. Kurti, Panjabi & Co-ord Chart"}
            </h2>
            <span className="text-xs font-bold text-[#A8834A]">ইঞ্চি (Inches)</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#14372E] text-[#FBF7F0]">
                <tr>
                  <th className="py-3 px-4">Size</th>
                  <th className="py-3 px-4 text-center">Chest (বুক)</th>
                  <th className="py-3 px-4 text-center">Waist (কোমর)</th>
                  <th className="py-3 px-4 text-center">Hips (হিপ)</th>
                  <th className="py-3 px-4 text-center">Shoulder (কাঁধ)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9DDC9]">
                {kurtiSizes.map((row) => (
                  <tr key={row.size} className="hover:bg-[#FBF7F0]/60 transition-colors">
                    <td className="py-3 px-4 font-bold text-sm text-[#14372E]">{row.size}</td>
                    <td className="py-3 px-4 text-center font-mono font-bold text-[#14372E]">{row.chest}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#1C1B18]/70">{row.waist}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#1C1B18]/70">{row.hips}</td>
                    <td className="py-3 px-4 text-center font-mono text-[#1C1B18]/70">{row.shoulder}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Bespoke Tailoring CTA */}
        <div className="bg-[#14372E] text-[#FBF7F0] p-8 rounded-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-[#C5A059] text-xs font-bold">
              <Scissors className="w-4 h-4" />
              <span>{locale === "bn" ? "স্ট্যান্ডার্ড সাইজে ফিট হচ্ছে না?" : "Standard sizes don't fit?"}</span>
            </div>
            <h3 className="font-serif text-2xl font-bold">
              {locale === "bn" ? "আমাদের ৪ দিনের কাস্টম দরজি সেবা নিন" : "Try Our 4-Day Custom Tailoring (+₹150)"}
            </h3>
            <p className="text-xs text-[#E9DDC9]/80 max-w-lg">
              {locale === "bn"
                ? "যেকোনো প্রোডাক্ট পেজ থেকে আপনার উচ্চতা ও বুকের মাপ ইনপুট দিলে আমাদের কলকাতা কারিগররা বিশেষভাবে আপনার জন্য সেলাই করবে।"
                : "Enter your exact measurements on any product detail page for artisan-crafted bespoke sizing."}
            </p>
          </div>

          <Link
            href={`/${locale}/custom-tailoring`}
            className="px-6 py-3 rounded-xl bg-[#C5A059] text-[#1C1B18] font-bold text-xs hover:bg-[#C5A059]/90 transition-colors shrink-0 flex items-center gap-1.5"
          >
            <span>{locale === "bn" ? "দরজি সেবা সম্পর্কে জানুন" : "Learn More"}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
