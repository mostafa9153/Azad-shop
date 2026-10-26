"use client";

import { use } from "react";
import { Locale } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, Sparkles } from "lucide-react";

export default function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = use(params);
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  return (
    <div className="min-h-screen bg-[#FBF7F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14372E]/10 text-[#14372E] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{locale === "bn" ? "যোগাযোগ ও কাস্টমার সাপোর্ট" : "Get in Touch"}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14372E]">
            {locale === "bn" ? "আমাদের সাথে যোগাযোগ করুন" : "Contact & Atelier Visits"}
          </h1>
          <p className="text-xs sm:text-sm text-[#1C1B18]/70 max-w-xl mx-auto">
            {locale === "bn"
              ? "যেকোনো অনুসন্ধান, কাস্টম মাপ বা শোরুম পরিদর্শনের জন্য আমাদের কলকাতা টিম সর্বদা আপনার সেবায় নিয়োজিত।"
              : "Questions about sizes, bespoke custom stitching, or showroom visits? Our team is always here to assist."}
          </p>
        </div>

        {/* Contact Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E9DDC9] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#14372E] text-[#C5A059] flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#14372E] text-base">
              {locale === "bn" ? "ফ্ল্যাগশিপ শোরুম" : "Kolkata Showroom"}
            </h3>
            <p className="text-xs text-[#1C1B18]/70 leading-relaxed">
              {locale === "bn" ? brandConfig.shop.address.bn : brandConfig.shop.address.en}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9DDC9] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#14372E] text-[#C5A059] flex items-center justify-center">
              <Phone className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#14372E] text-base">
              {locale === "bn" ? "সাপোর্ট হেল্পলাইন" : "Direct Helpline"}
            </h3>
            <p className="text-xs text-[#1C1B18]/70 font-mono">
              {brandConfig.contact.phone}
            </p>
            <p className="text-xs text-[#1C1B18]/70">
              {brandConfig.contact.email}
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E9DDC9] shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#14372E] text-[#C5A059] flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-serif font-bold text-[#14372E] text-base">
              {locale === "bn" ? "খোলার সময়সূচি" : "Opening Hours"}
            </h3>
            <p className="text-xs text-[#1C1B18]/70 leading-relaxed">
              {locale === "bn" ? brandConfig.shop.openingHours.bn : brandConfig.shop.openingHours.en}
              <br />
              <span className="text-[#A8834A] font-medium">
                {locale === "bn" ? "সপ্তাহের ৭ দিনই উন্মুক্ত" : "Open 7 Days a Week"}
              </span>
            </p>
          </div>
        </div>

        {/* WhatsApp & Contact Form Split */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          {/* WhatsApp Direct Action Box */}
          <div className="bg-[#14372E] text-[#FBF7F0] p-8 rounded-3xl space-y-6">
            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-widest text-[#C5A059]">
                {locale === "bn" ? "দ্রুততম প্রতিক্রিয়া" : "Instant Assistance"}
              </span>
              <h3 className="font-serif text-2xl font-bold">
                {locale === "bn" ? "সরাসরি হোয়াটসঅ্যাপে কথা বলুন" : "Chat Directly on WhatsApp"}
              </h3>
              <p className="text-xs text-[#E9DDC9]/80 leading-relaxed">
                {locale === "bn"
                  ? "আমাদের স্টাইলিস্ট ও কারিগরদের সাথে ছবি পাঠিয়ে তাৎক্ষণিক সাইজ ও ফিটিং পরামর্শ পেতে মেসেজ দিন।"
                  : "Message our Kolkata styling advisors directly with reference photos, measurements, or order queries."}
              </p>
            </div>

            <a
              href={`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(
                locale === "bn"
                  ? "আসসালামু আলাইকুম, আমি আজাদ হায়ার পোশাক সম্পর্কে জানতে আগ্রহী।"
                  : "Assalamu Alaikum, I would like to inquire about AZAD HAYA modest wear."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-3 px-5 rounded-2xl bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-lg transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{locale === "bn" ? "হোয়াটসঅ্যাপে চ্যাট শুরু করুন" : "Open WhatsApp Chat"}</span>
            </a>
          </div>

          {/* Contact Message Form */}
          <div className="bg-white p-8 rounded-3xl border border-[#E9DDC9] shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-[#14372E]">
              {locale === "bn" ? "আমাদের একটি বার্তা পাঠান" : "Send Us a Message"}
            </h3>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                alert(locale === "bn" ? "আপনার বার্তাটি গৃহীত হয়েছে। আমরা শীঘ্রই যোগাযোগ করব ইনশাআল্লাহ।" : "Message sent successfully!");
              }}
              className="space-y-3"
            >
              <div>
                <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
                  {locale === "bn" ? "আপনার নাম *" : "Your Name *"}
                </label>
                <input
                  type="text"
                  required
                  placeholder={locale === "bn" ? "মোসাম্মত ফাতিমা" : "Fatima Khan"}
                  className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#14372E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
                  {locale === "bn" ? "মোবাইল নম্বর *" : "Phone Number *"}
                </label>
                <input
                  type="tel"
                  required
                  placeholder="+91 98765 43210"
                  className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#14372E]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
                  {locale === "bn" ? "বার্তা / অনুসন্ধান *" : "Message *"}
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder={
                    locale === "bn"
                      ? "আপনার অনুসন্ধান এখানে লিখুন..."
                      : "How can our atelier assist you?"
                  }
                  className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl p-3 text-xs focus:outline-none focus:border-[#14372E]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[#14372E] text-white font-bold text-xs shadow-md hover:bg-[#14372E]/90 flex items-center justify-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{locale === "bn" ? "বার্তা পাঠান" : "Submit Inquiry"}</span>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
