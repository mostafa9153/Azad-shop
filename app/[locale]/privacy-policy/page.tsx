import { Locale } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { ShieldCheck } from "lucide-react";

export default async function PrivacyPolicyPage({
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
            <ShieldCheck className="w-4 h-4 text-[#C5A059]" />
            <span>{locale === "bn" ? "আইনি ও ডেটা সুরক্ষা" : "Legal & Privacy"}</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E]">
            {locale === "bn" ? "গোপনীয়তা নীতি (Privacy Policy)" : "Privacy Policy"}
          </h1>
          <p className="text-[11px] text-[#1C1B18]/60 mt-1">
            {locale === "bn" ? "সর্বশেষ সংস্করণ: অক্টোবর ২০২৬ (ভারত ডিজিটাল ডেটা সুরক্ষা আইন ২০২৩ অনুবর্তী)" : "Last Updated: October 2026 (Compliant with India DPDP Act 2023)"}
          </p>
        </div>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#14372E]">
            {locale === "bn" ? "১. তথ্যের গোপনীয়তা রক্ষা" : "1. Customer Data Protection"}
          </h2>
          <p>
            {locale === "bn"
              ? "আজাদ হায়া (AZAD HAYA) গ্রাহকের ব্যক্তিগত তথ্যের পবিত্রতা রক্ষায় সর্বোচ্চ দায়বদ্ধ। আমরা কেবলমাত্র অর্ডার প্রক্রিয়াকরণ, কাস্টম দরজি সেলাই এবং ডেলিভারির উদ্দেশ্যে আপনার নাম, ফোন নম্বর ও ডেলিভারি ঠিকানা সংগ্রহ করি। কোনো তৃতীয় পক্ষের কাছে আপনার তথ্য কখনোই বিক্রয় বা হস্তান্তর করা হয় না।"
              : "AZAD HAYA is strictly committed to protecting your personal data. Information such as your name, mobile number, delivery address, and custom measurements is collected strictly for order dispatch, custom tailoring, and customer service. We never sell or lease customer records."}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#14372E]">
            {locale === "bn" ? "২. পেমেন্ট ও আর্থিক তথ্যের নিরাপত্তা" : "2. Payment Data Security"}
          </h2>
          <p>
            {locale === "bn"
              ? "আমাদের ওয়েবসাইটে আপনার ক্রেডিট/ডেবিট কার্ড বা ইউপিআই পিন নম্বর কখনোই সংরক্ষণ করা হয় না। সমস্ত লেনদেন সরাসরি ভারতীয় রিজার্ভ ব্যাংক (RBI) অনুমোদিত নিরাপদ পেমেন্ট গেটওয়ে এবং এনক্রিপ্ট করা ইউপিআই কিউআর কোডের মাধ্যমে সম্পন্ন হয়।"
              : "We never store raw credit card numbers or UPI PINs on our servers. All transactions are processed through RBI-authorized payment infrastructure and encrypted UPI QR protocols."}
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="font-serif text-base font-bold text-[#14372E]">
            {locale === "bn" ? "৩. যোগাযোগ" : "3. Grievance Officer Contact"}
          </h2>
          <p>
            {locale === "bn"
              ? "গোপনীয়তা সংক্রান্ত যেকোনো জিজ্ঞাসা বা আপনার তথ্য মুছে ফেলার অনুরোধের জন্য আমাদের গ্রিভ্যান্স অফিসারের সাথে যোগাযোগ করুন: contact@azadhaya.com | +91 90000 00000 | ৪২ জাকারিয়া স্ট্রিট, কলকাতা ৭০০০৭৩।"
              : "For privacy queries or data removal requests, contact our Grievance Officer at contact@azadhaya.com | +91 90000 00000 | 42 Zakaria Street, Kolkata 700073."}
          </p>
        </section>
      </div>
    </div>
  );
}
