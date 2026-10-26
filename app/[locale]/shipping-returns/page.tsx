import { Locale } from "@/lib/i18n";
import { Truck, RotateCcw, ShieldCheck, CheckCircle2 } from "lucide-react";

export default async function ShippingReturnsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  return (
    <div className="min-h-screen bg-[#FBF7F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14372E]/10 text-[#14372E] text-xs font-semibold">
            <Truck className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{locale === "bn" ? "ডেলিভারি ও রিটার্ন নির্দেশিকা" : "Fulfillment & Return Policy"}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14372E]">
            {locale === "bn" ? "শিপিং ও ৭ দিনের রিটার্ন পলিসি" : "Shipping & 7-Day Return Policy"}
          </h1>
          <p className="text-xs sm:text-sm text-[#1C1B18]/70 max-w-xl mx-auto">
            {locale === "bn"
              ? "পশ্চিমবঙ্গ জুড়ে দ্রুততম ডেলিভারি ও সম্পূর্ণ চাপমুক্ত শালীন পোশাক রিটার্ন সুবিধা।"
              : "Express Bengal courier dispatch with our stress-free 7-day modesty return guarantee."}
          </p>
        </div>

        {/* Shipping Timelines */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-xs space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#14372E] flex items-center gap-2">
            <Truck className="w-5 h-5 text-[#A8834A]" />
            <span>{locale === "bn" ? "১. ডেলিভারি সময়সূচি ও চার্জ" : "1. Shipping Timelines & Charges"}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] space-y-1.5">
              <span className="font-bold text-[#14372E] text-sm block">
                {locale === "bn" ? "কলকাতা মেট্রো অঞ্চল" : "Kolkata Metro"}
              </span>
              <p className="text-[#A8834A] font-bold">২৪ থেকে ৪৮ ঘণ্টা</p>
              <p className="text-[#1C1B18]/70 text-[11px]">
                {locale === "bn" ? "কলকাতা, হাওড়া ও বিধাননগর" : "Kolkata, Howrah, Bidhannagar"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] space-y-1.5">
              <span className="font-bold text-[#14372E] text-sm block">
                {locale === "bn" ? "পশ্চিমবঙ্গের জেলাসমূহ" : "Bengal Districts"}
              </span>
              <p className="text-[#A8834A] font-bold">২ থেকে ৩ কার্যদিবস</p>
              <p className="text-[#1C1B18]/70 text-[11px]">
                {locale === "bn" ? "নদিয়া, মুর্শিদাবাদ, বর্ধমান, শিলিগুড়ি" : "Nadia, Murshidabad, Burdwan, Siliguri"}
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] space-y-1.5">
              <span className="font-bold text-[#14372E] text-sm block">
                {locale === "bn" ? "সমগ্র ভারত (Pan-India)" : "Rest of India"}
              </span>
              <p className="text-[#A8834A] font-bold">৪ থেকে ৬ কার্যদিবস</p>
              <p className="text-[#1C1B18]/70 text-[11px]">
                {locale === "bn" ? "ভারতের যেকোনো পিনকোডে ব্লু ডার্ট / দিল্লিভেরি" : "All PIN codes via Blue Dart / Delhivery"}
              </p>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-[#14372E] text-[#FBF7F0] flex items-center justify-between text-xs">
            <div>
              <span className="font-bold block">
                {locale === "bn" ? "বিনামূল্যে ডেলিভারি সুবিধা (Free Shipping):" : "Complimentary Delivery:"}
              </span>
              <span className="text-[#E9DDC9]/80 text-[11px]">
                {locale === "bn"
                  ? "₹১,৪৯৯ বা ততোধিক মূল্যের যেকোনো অর্ডারে ডেলিভারি চার্জ সম্পূর্ণ ফ্রি!"
                  : "All orders above ₹1,499 receive complimentary express shipping."}
              </span>
            </div>
            <span className="text-sm font-bold text-[#C5A059] font-mono shrink-0">₹০ (FREE)</span>
          </div>
        </div>

        {/* 7-Day Returns */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-xs space-y-6">
          <h2 className="font-serif text-xl font-bold text-[#14372E] flex items-center gap-2">
            <RotateCcw className="w-5 h-5 text-emerald-600" />
            <span>{locale === "bn" ? "২. ৭ দিনের সহজ শালীন রিটার্ন নীতি" : "2. 7-Day Modesty Return Policy"}</span>
          </h2>

          <p className="text-xs sm:text-sm text-[#1C1B18]/80 leading-relaxed">
            {locale === "bn"
              ? "আমরা চাই আজাদ হায়ার পোশাকে আপনি সম্পূর্ণ আত্মবিশ্বাসী ও স্বাচ্ছন্দ্যবোধ করুন। পোশাক ডেলিভারি পাওয়ার ৭ দিনের মধ্যে সাইজ বা ফিটিংয়ে কোনো সমস্যা হলে কোনো প্রশ্ন ছাড়াই রিটার্ন বা পরিবর্তন করা যাবে।"
              : "We want you to feel completely confident and content in your AZAD HAYA attire. If the fit or feel isn't ideal, return or exchange it within 7 days of receipt with zero hassle."}
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] space-y-2">
              <span className="font-bold text-[#14372E] block">
                {locale === "bn" ? "রিটার্নের শর্তাবলী:" : "Return Guidelines:"}
              </span>
              <ul className="space-y-1.5 text-[#1C1B18]/70 list-disc list-inside">
                <li>{locale === "bn" ? "পোশাক অব্যবহৃত ও না-ধোয়া অবস্থায় থাকতে হবে।" : "Unworn, unwashed condition."}</li>
                <li>{locale === "bn" ? "অরিজিনাল ব্র্যান্ড ট্যাগ ও প্যাকেজিং অক্ষত থাকতে হবে।" : "Original brand tags and security seal intact."}</li>
                <li>{locale === "bn" ? "ব্যক্তিগত কাস্টম মাপে সেলাই করা পণ্যে অল্টারেশন সুবিধা প্রযোজ্য।" : "Custom bespoke tailored items receive free alteration."}</li>
              </ul>
            </div>

            <div className="p-4 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] space-y-2">
              <span className="font-bold text-[#14372E] block">
                {locale === "bn" ? "রিফান্ড প্রক্রিয়াকরণ:" : "Refund Timeline:"}
              </span>
              <p className="text-[#1C1B18]/70 leading-relaxed">
                {locale === "bn"
                  ? "পণ্যটি আমাদের কলকাতা ওয়ার্কশপে ফেরত আসার ৪৮ ঘণ্টার মধ্যে আপনার মূল পেমেন্ট মাধ্যমে (UPI বা ব্যাঙ্ক অ্যাকাউন্ট) সম্পূর্ণ টাকা ফেরত দেওয়া হয়।"
                  : "Refunds are processed within 48 hours of return delivery back to your original payment method (UPI / Bank)."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
