import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { MapPin, Phone, Mail, Clock, ShieldCheck, HeartHandshake } from "lucide-react";

interface FooterProps {
  locale: Locale;
}

export function Footer({ locale }: FooterProps) {
  return (
    <footer className="bg-[#14372E] text-[#FBF7F0] border-t border-[#A8834A]/40 pt-14 pb-20 md:pb-12 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Top 4-Column Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#FBF7F0]/15">
          {/* Column 1: Brand & Atelier */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <svg width="26" height="12" viewBox="0 0 34 14" fill="none" className="text-[#C5A059]">
                <path d="M1 13C1 7 8 1 17 1C26 1 33 7 33 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                <circle cx="17" cy="1" r="1.5" fill="currentColor" />
              </svg>
              <h3 className="font-serif text-2xl font-bold tracking-wide text-[#FBF7F0]">
                {locale === "bn" ? brandConfig.name.bn : brandConfig.name.en}
              </h3>
            </div>
            <p className="text-xs sm:text-sm text-[#E9DDC9]/80 leading-relaxed">
              {locale === "bn" ? brandConfig.description.bn : brandConfig.description.en}
            </p>

            <div className="space-y-2.5 text-xs text-[#E9DDC9]/90 pt-2">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{locale === "bn" ? brandConfig.shop.address.bn : brandConfig.shop.address.en}</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`tel:${brandConfig.contact.phone}`} className="hover:text-[#C5A059] transition-colors">
                  {brandConfig.contact.phone}
                </a>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C5A059] shrink-0" />
                <a href={`mailto:${brandConfig.contact.email}`} className="hover:text-[#C5A059] transition-colors">
                  {brandConfig.contact.email}
                </a>
              </div>
              <div className="flex items-start gap-2">
                <Clock className="w-4 h-4 text-[#C5A059] shrink-0 mt-0.5" />
                <span>{locale === "bn" ? brandConfig.shop.openingHours.bn : brandConfig.shop.openingHours.en}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Catalog Categories */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#E9DDC9] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              {locale === "bn" ? "পোশাকের কালেকশন" : "Modest Collections"}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#E9DDC9]/80">
              <li>
                <Link href={`/${locale}/shop?category=burkha`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "প্রিমিয়াম বোরকা (কোরিয়ান নিদা)" : "Premium Burkha (Korean Nida)"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=abaya`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "দুবাই ও ফ্লেয়ার্ড আবায়া" : "Dubai & Flared Abayas"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=jilbab`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "ফ্রেঞ্চ টু-পিস জিলবাব" : "French Two-Piece Jilbab"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=hijab`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "শিফন ও জার্সি হিজাব" : "Chiffon & Modal Hijabs"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=niqab`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "সৌদি শিফন ৩-লেয়ার নিকাব" : "Saudi Chiffon 3-Layer Niqab"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=panjabi`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "লখনউই চিকেনকারি পাঞ্জাবি ও জুব্বা" : "Chikankari Panjabi & Jubba"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=kids`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "বাচ্চাদের আবায়া ও পাঞ্জাবি" : "Kids & Junior Attire"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shop?category=sets`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "ম্যাচিং ৩-পিস সম্পূর্ণ শালীন সেট" : "Complete 3-Piece Modest Sets"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Customer Care & Services */}
          <div>
            <h4 className="font-serif text-lg font-bold text-[#E9DDC9] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              {locale === "bn" ? "গ্রাহক সেবা ও পলিসি" : "Customer Care"}
            </h4>
            <ul className="space-y-2 text-xs sm:text-sm text-[#E9DDC9]/80">
              <li>
                <Link href={`/${locale}/track`} className="hover:text-[#FBF7F0] transition-colors flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{locale === "bn" ? "অর্ডার ট্র্যাক করুন (লগইন ছাড়া)" : "Track Order (No Login Required)"}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/custom-tailoring`} className="hover:text-[#FBF7F0] transition-colors flex items-center gap-1.5">
                  <HeartHandshake className="w-3.5 h-3.5 text-[#C5A059]" />
                  <span>{locale === "bn" ? "কাস্টম সাইজ ও দরজি সার্ভিস (+₹১৫০)" : "Custom Size Tailoring Service"}</span>
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/size-guide`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "সাইজ গাইড ও পরিমাপ সহায়িকা" : "Size Guide & Measurements"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/fabric-care`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "ফেব্রিক পরিচিতি ও যত্ন নির্দেশিকা" : "Fabric & Care Guide"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/shipping-returns`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "ডেলিভারি ও ৭ দিনের রিটার্ন পলিসি" : "Shipping & 7-Day Returns"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/contact`} className="hover:text-[#FBF7F0] transition-colors">
                  {locale === "bn" ? "যোগাযোগ ও শোরুম দিকনির্দেশ" : "Contact & Showroom Directions"}
                </Link>
              </li>
              <li>
                <Link href={`/${locale}/admin`} className="hover:text-[#FBF7F0] transition-colors text-[#C5A059]">
                  {locale === "bn" ? "অ্যাডমিন কনসোল" : "Admin Console"}
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: WhatsApp VIP & Payment Badges */}
          <div className="space-y-4">
            <h4 className="font-serif text-lg font-bold text-[#E9DDC9] flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#C5A059]" />
              {locale === "bn" ? "আজাদ হায়া ভিআইপি ক্লাব" : "VIP Updates"}
            </h4>
            <p className="text-xs text-[#E9DDC9]/80 leading-relaxed">
              {locale === "bn"
                ? "নতুন কালেকশন ও ঈদ অফারের আপডেট সরাসরি আপনার ফোনে পেতে আমাদের হোয়াটসঅ্যাপ চ্যানেলে যুক্ত হন।"
                : "Join our modest wear community for early drop access and exclusive Eid coupon privileges."}
            </p>

            <a
              href={`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(
                locale === "bn"
                  ? "আসসালামু আলাইকুম, আমি আজাদ হায়া ভিআইপি ক্লাবে যুক্ত হতে চাই।"
                  : "Assalamu Alaikum, I would like to join the AZAD HAYA VIP Club."
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full py-2.5 px-4 rounded-lg bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs shadow-md transition-colors"
            >
              <Phone className="w-4 h-4" />
              <span>{locale === "bn" ? "হোয়াটসঅ্যাপে যুক্ত হন" : "Join via WhatsApp"}</span>
            </a>

            {/* Payment security badges */}
            <div className="pt-2">
              <p className="text-[11px] font-semibold text-[#E9DDC9]/70 mb-2">
                {locale === "bn" ? "সুরক্ষিত পেমেন্ট মাধ্যম:" : "Accepted Payments:"}
              </p>
              <div className="flex flex-wrap gap-1.5 text-[10px] font-bold text-[#14372E]">
                <span className="px-2 py-1 bg-[#FBF7F0] rounded border border-[#E9DDC9]">UPI (GPay / PhonePe)</span>
                <span className="px-2 py-1 bg-[#FBF7F0] rounded border border-[#E9DDC9]">RuPay</span>
                <span className="px-2 py-1 bg-[#FBF7F0] rounded border border-[#E9DDC9]">Visa / Master</span>
                <span className="px-2 py-1 bg-[#FBF7F0] rounded border border-[#E9DDC9]">Netbanking</span>
                <span className="px-2 py-1 bg-[#FBF7F0] rounded border border-[#E9DDC9]">COD (Cash on Delivery)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Legal & GST Notice Bar */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-[#E9DDC9]/60 gap-4 text-center md:text-left">
          <p>
            &copy; {new Date().getFullYear()} {brandConfig.name.en} ({brandConfig.name.bn}).{" "}
            {locale === "bn" ? brandConfig.tax.gstNotice.bn : brandConfig.tax.gstNotice.en}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs">
            <Link href={`/${locale}/privacy-policy`} className="hover:text-[#FBF7F0] transition-colors">
              {locale === "bn" ? "গোপনীয়তা নীতি" : "Privacy Policy"}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/terms`} className="hover:text-[#FBF7F0] transition-colors">
              {locale === "bn" ? "শর্তাবলী" : "Terms & Conditions"}
            </Link>
            <span>•</span>
            <Link href={`/${locale}/shipping-returns`} className="hover:text-[#FBF7F0] transition-colors">
              {locale === "bn" ? "শিপিং ও রিটার্ন" : "Shipping & Returns"}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
