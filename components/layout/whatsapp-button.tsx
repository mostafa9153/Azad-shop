"use client";

import { Locale } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  locale: Locale;
}

export function WhatsAppButton({ locale }: WhatsAppButtonProps) {
  const message =
    locale === "bn"
      ? "আসসালামু আলাইকুম, আমি আজাদ হায়া থেকে প্রিমিয়াম শালীন পোশাক সম্পর্কে জানতে চাই।"
      : "Assalamu Alaikum, I would like to inquire about AZAD HAYA modest wear.";

  const whatsappUrl = `https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(message)}`;

  return (
    <aside
      aria-label="Direct WhatsApp Assistance"
      className="fixed bottom-[calc(5rem+env(safe-area-inset-bottom))] md:bottom-8 right-4 md:right-8 z-40"
    >
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2.5 bg-[#25D366] text-white p-3 md:px-4 md:py-3 rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all group"
        aria-label="Chat on WhatsApp"
      >
        <MessageCircle className="w-6 h-6 fill-white text-[#25D366]" />
        <span className="hidden md:inline-block text-xs font-bold font-sans">
          {locale === "bn" ? "হোয়াটসঅ্যাপে সাহায্য" : "WhatsApp Help"}
        </span>
      </a>
    </aside>
  );
}
