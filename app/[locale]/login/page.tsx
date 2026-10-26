"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Locale } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { Lock, Phone, ArrowRight, ShieldCheck, Check } from "lucide-react";
import { toast } from "sonner";

export default function LoginPage() {
  const params = useParams();
  const router = useRouter();
  const locale = ((params?.locale as string) || "bn") as Locale;

  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) return;

    setLoading(true);
    setTimeout(() => {
      setOtpSent(true);
      setLoading(false);
      toast.success(
        locale === "bn"
          ? `আপনার ফোন ${phone}-এ ডেমো ওটিপি পাঠানো হয়েছে: ১২৩৪৫৬`
          : `Demo OTP sent to ${phone}: 123456`
      );
    }, 600);
  };

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp !== "123456" && otp.length !== 6) {
      toast.error(locale === "bn" ? "ভুল ওটিপি কোড।" : "Invalid OTP code. Try 123456.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("azad_haya_user_phone", phone);
        localStorage.setItem("azad_haya_logged_in", "true");
      }
      toast.success(locale === "bn" ? "স্বাগতম! সফলভাবে লগইন সম্পন্ন হয়েছে।" : "Welcome! Login successful.");
      router.push(`/${locale}/account`);
    }, 500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 sm:py-24">
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-full bg-[#14372E]/10 flex items-center justify-center mx-auto text-[#14372E]">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E]">
            {locale === "bn" ? "আজাদ হায়া অ্যাকাউন্টে প্রবেশ" : "Customer Sign In"}
          </h1>
          <p className="text-xs text-[#1C1B18]/70">
            {locale === "bn"
              ? "আপনার মোবাইল নম্বর দিয়ে ওটিপি মাধ্যমে পাসওয়ার্ড ছাড়াই সহজে লগইন করুন।"
              : "Sign in with your mobile number via instant OTP."}
          </p>
        </div>

        {!otpSent ? (
          <form onSubmit={handleSendOtp} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-[#1C1B18] mb-1">
                {locale === "bn" ? "মোবাইল নম্বর (+৯১):" : "Mobile Number (+91):"}
              </label>
              <div className="flex">
                <span className="px-3 py-2.5 bg-[#FBF7F0] border border-r-0 border-[#E9DDC9] rounded-l-xl text-xs font-bold text-[#14372E]">
                  +91
                </span>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="9000000000"
                  className="flex-1 bg-white border border-[#E9DDC9] rounded-r-xl px-3 py-2.5 text-xs font-semibold focus:outline-none focus:border-[#14372E]"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#14372E] text-[#FBF7F0] font-bold text-xs sm:text-sm hover:bg-[#14372E]/90 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <span>{loading ? "..." : locale === "bn" ? "ওটিপি কোড পাঠান" : "Send OTP"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-4 animate-in fade-in">
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-xs text-amber-800">
              {locale === "bn"
                ? `আমরা ${phone} নম্বরে ৬ সংখ্যার ওটিপি পাঠিয়েছি। ডেমো কোড: ১২৩৪৫৬`
                : `Enter the 6-digit OTP sent to ${phone}. Demo code: 123456`}
            </div>

            <div>
              <label className="block text-xs font-bold text-[#1C1B18] mb-1">
                {locale === "bn" ? "ওটিপি লিখুন:" : "Enter OTP:"}
              </label>
              <input
                type="text"
                maxLength={6}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3 py-2.5 text-center text-lg font-mono tracking-widest font-bold text-[#14372E] focus:outline-none focus:border-[#14372E]"
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-xl bg-[#14372E] text-[#FBF7F0] font-bold text-xs sm:text-sm hover:bg-[#14372E]/90 transition-all shadow-md flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{loading ? "..." : locale === "bn" ? "যাচাই ও প্রবেশ করুন" : "Verify & Sign In"}</span>
            </button>
          </form>
        )}

        <div className="pt-2 text-center text-xs text-[#1C1B18]/70">
          <span>{locale === "bn" ? "লগইন ছাড়া সরাসরি ট্র্যাক করতে চান?" : "Want to track without signing in?"} </span>
          <Link href={`/${locale}/track`} className="font-bold text-[#14372E] underline">
            {locale === "bn" ? "এখানে ক্লিক করুন" : "Track Order"}
          </Link>
        </div>
      </div>
    </div>
  );
}
