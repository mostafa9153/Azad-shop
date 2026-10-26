"use client";

import { Locale } from "@/lib/i18n";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Ruler, CheckCircle2 } from "lucide-react";

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  categorySlug?: string;
  locale: Locale;
}

export function SizeGuideModal({ isOpen, onClose, categorySlug, locale }: SizeGuideModalProps) {
  const isPanjabi = categorySlug === "panjabi";
  const isKids = categorySlug === "kids";

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-2xl bg-[#FBF7F0] p-6 border border-[#E9DDC9] rounded-2xl shadow-2xl">
        <DialogHeader>
          <div className="flex items-center gap-2 text-[#14372E]">
            <Ruler className="w-5 h-5 text-[#A8834A]" />
            <DialogTitle className="font-serif text-xl sm:text-2xl font-bold">
              {locale === "bn" ? "আজাদ হায়া পরিমাপ ও সাইজ গাইড" : "AZAD HAYA Size & Fit Guide"}
            </DialogTitle>
          </div>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          <p className="text-xs sm:text-sm text-[#1C1B18]/80 leading-relaxed">
            {locale === "bn"
              ? "আমাদের সকল বোরকা ও আবায়া স্ট্যান্ডার্ড উচ্চতা ও ঢিলেঢালা শালীন অনুপাত মেনে তৈরি। আপনার সঠিক মাপ বেছে নিতে নিচের চার্টটি দেখুন:"
              : "All AZAD HAYA modest attire is tailored with full-coverage modest drape. Reference the charts below to choose your ideal fit:"}
          </p>

          {isPanjabi ? (
            /* Panjabi Chart */
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-[#E9DDC9]">
                <thead className="bg-[#14372E] text-[#FBF7F0]">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Chest (ইঞ্চি)</th>
                    <th className="p-2.5">Length (ইঞ্চি)</th>
                    <th className="p-2.5">Sleeve (ইঞ্চি)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9DDC9] bg-white">
                  <tr><td className="p-2.5 font-bold">M (38)</td><td className="p-2.5">40"</td><td className="p-2.5">40"</td><td className="p-2.5">24.5"</td></tr>
                  <tr><td className="p-2.5 font-bold">L (40)</td><td className="p-2.5">42"</td><td className="p-2.5">42"</td><td className="p-2.5">25"</td></tr>
                  <tr><td className="p-2.5 font-bold">XL (42)</td><td className="p-2.5">44"</td><td className="p-2.5">44"</td><td className="p-2.5">25.5"</td></tr>
                  <tr><td className="p-2.5 font-bold">XXL (44)</td><td className="p-2.5">46"</td><td className="p-2.5">46"</td><td className="p-2.5">26"</td></tr>
                </tbody>
              </table>
            </div>
          ) : isKids ? (
            /* Kids Chart */
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-[#E9DDC9]">
                <thead className="bg-[#14372E] text-[#FBF7F0]">
                  <tr>
                    <th className="p-2.5">Size</th>
                    <th className="p-2.5">Age Range</th>
                    <th className="p-2.5">Dress Length (ইঞ্চি)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9DDC9] bg-white">
                  <tr><td className="p-2.5 font-bold">24 / 26</td><td className="p-2.5">3–5 Years</td><td className="p-2.5">26"–28"</td></tr>
                  <tr><td className="p-2.5 font-bold">28 / 30</td><td className="p-2.5">6–8 Years</td><td className="p-2.5">30"–34"</td></tr>
                  <tr><td className="p-2.5 font-bold">32 / 36</td><td className="p-2.5">9–12 Years</td><td className="p-2.5">36"–42"</td></tr>
                </tbody>
              </table>
            </div>
          ) : (
            /* Standard Abaya / Burkha Chart */
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border border-[#E9DDC9]">
                <thead className="bg-[#14372E] text-[#FBF7F0]">
                  <tr>
                    <th className="p-2.5">Abaya Size</th>
                    <th className="p-2.5">Your Height (উচ্চতা)</th>
                    <th className="p-2.5">Garment Length</th>
                    <th className="p-2.5">Chest / Bust</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#E9DDC9] bg-white">
                  <tr><td className="p-2.5 font-bold">52</td><td className="p-2.5">4'11" – 5'1"</td><td className="p-2.5">52"</td><td className="p-2.5">42"–44" (Loose Fit)</td></tr>
                  <tr><td className="p-2.5 font-bold">54</td><td className="p-2.5">5'2" – 5'4"</td><td className="p-2.5">54"</td><td className="p-2.5">44"–46" (Loose Fit)</td></tr>
                  <tr><td className="p-2.5 font-bold">56</td><td className="p-2.5">5'5" – 5'7"</td><td className="p-2.5">56"</td><td className="p-2.5">46"–48" (Loose Fit)</td></tr>
                  <tr><td className="p-2.5 font-bold">58</td><td className="p-2.5">5'8" – 5'10"</td><td className="p-2.5">58"</td><td className="p-2.5">48"–50" (Loose Fit)</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* Measuring tips */}
          <div className="bg-[#E9DDC9]/40 p-4 rounded-xl border border-[#E9DDC9] space-y-2 text-xs text-[#1C1B18]">
            <h5 className="font-bold flex items-center gap-1.5 text-[#14372E]">
              <CheckCircle2 className="w-4 h-4 text-[#A8834A]" />
              {locale === "bn" ? "পরিমাপ নেওয়ার টিপস:" : "How to Measure:"}
            </h5>
            <ul className="list-disc list-inside space-y-1 text-[#1C1B18]/80">
              <li>{locale === "bn" ? "বোরকা বা আবায়ার মাপ কাঁধের শীর্ষ থেকে পায়ের গোড়ালি পর্যন্ত নিন।" : "Measure length from high shoulder point down to your ankle with desired shoes."}</li>
              <li>{locale === "bn" ? "যদি আপনি হিল পরেন, তবে ১-২ ইঞ্চি বেশি লম্বা সাইজ নির্বাচন করুন।" : "If you plan to wear heels, consider ordering one size longer."}</li>
              <li>{locale === "bn" ? "আপনার সঠিক মাপ না মিললে 'কাস্টম সাইজ' অপশন ব্যবহার করুন।" : "For bespoke lengths, choose 'Custom Tailoring' (+₹150)."}</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
