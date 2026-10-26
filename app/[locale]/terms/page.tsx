import { Locale } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { Scale } from "lucide-react";

export default async function TermsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  return (
    <div className="min-h-screen bg-[#FBF7F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto space-y-8 bg-white p-6 sm:p-10 rounded-3xl border border-[#E9DDC9] shadow-xs text-[#1C1B18] text-xs sm:text-sm leading-relaxed">
        <div className="border-b border-[#E9DDC9] pb-4">
          <div className="inline-flex items-center gap-1.5 text-[#14372E] font-bold text-xs mb-1">
            <Scale className="w-4 h-4 text-[#C5A059]" />
            <span>{locale === "bn" ? "আইনি নীতিমালা" : "Terms & Conditions"}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E]">
            {locale === "bn" ? "ব্যবহারের নিয়ম ও শর্তাবলী" : "Terms of Service"}
          </h1>
          <p className="text-[11px] text-[#1C1B18]/60 mt-1">
            GSTIN: <span className="font-mono font-bold text-[#14372E]">19AAACA0000A1Z5</span> (West Bengal State Code 19)
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#14372E]">
            {locale === "bn" ? "১. জিএসটি ও পণ্যের মূল্য নির্ধারণ" : "1. GST & Pricing Compliance"}
          </h2>
          <p>
            {locale === "bn"
              ? "আজাদ হায়ার সমস্ত প্রদর্শিত মূল্য ভারতীয় জিএসটি (GST) কর সহ নির্ধারিত। ভারতীয় কর আইন অনুযায়ী ₹২,৫০০ পর্যন্ত মূল্যের পোশাকে ৫% এবং ₹২,৫০০ এর অধিক মূল্যের পোশাকে ১৮% জিএসটি অন্তর্ভুক্ত রয়েছে। চেকআউটের পর সরকার স্বীকৃত ট্যাক্স ইনভয়েস প্রদান করা হয়।"
              : "All item prices displayed on AZAD HAYA are inclusive of applicable Indian Goods and Services Tax (GST: 5% for pieces priced up to ₹2,500, and 18% above ₹2,500). Formal GST tax invoices are automatically generated with HSN codes."}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#14372E]">
            {locale === "bn" ? "২. কাস্টম সাইজ ও অর্ডার বাতিল নীতি" : "2. Custom Sizes & Cancellation"}
          </h2>
          <p>
            {locale === "bn"
              ? "স্ট্যান্ডার্ড সাইজের অর্ডার কুরিয়ারে প্রেরণের পূর্বে যেকোনো সময় বাতিল করা যাবে। তবে ব্যক্তিগত মাপে বিশেষভাবে কাটা ও সেলাই করা কাস্টম সাইজের পোশাক কাটিং শুরু হওয়ার পর বাতিলযোগ্য নয়।"
              : "Standard size orders may be cancelled before shipment for a full refund. Bespoke tailored orders cut to custom measurements cannot be cancelled once the atelier has begun fabric drafting."}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#14372E]">
            {locale === "bn" ? "৩. আইন ও বিচারসীমা" : "3. Governing Jurisdiction"}
          </h2>
          <p>
            {locale === "bn"
              ? "এই শর্তাবলী ভারতের আইন অনুসারে পরিচালিত হবে। যেকোনো আইনি বিরোধ শুধুমাত্র কলকাতা উচ্চ আদালত এবং কলকাতা সিটি দেওয়ানি আদালতের একচ্ছত্র এখতিয়ারভুক্ত থাকবে।"
              : "These terms and conditions are governed by Indian law, subject to the exclusive jurisdiction of the competent courts in Kolkata, West Bengal."}
          </p>
        </section>
      </div>
    </div>
  );
}
