"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";
import { SiteSettings } from "@/lib/types";
import {
  Settings,
  Save,
  CheckCircle2,
  AlertCircle,
  Bell,
  MessageCircle,
  Truck,
} from "lucide-react";

interface SettingsEditorProps {
  locale: Locale;
  initialSettings: SiteSettings;
}

export function SettingsEditor({ locale, initialSettings }: SettingsEditorProps) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [thresholdInr, setThresholdInr] = useState(
    (initialSettings.free_shipping_threshold_paise / 100).toString()
  );

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      const parsedThreshold = Math.round(parseFloat(thresholdInr || "1499") * 100);
      const payload: Partial<SiteSettings> = {
        ...settings,
        free_shipping_threshold_paise: parsedThreshold,
      };

      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to update settings");

      setSettings(data.settings);
      setSuccess(true);
    } catch (err: any) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSave} className="space-y-6 max-w-4xl">
      {success && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{locale === "bn" ? "সাইট সেটিংস সফলভাবে সংরক্ষিত হয়েছে!" : "Settings saved successfully!"}</span>
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1. Announcement Bar */}
      <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-[#A8834A]" />
            <h2 className="font-serif text-base font-bold text-[#14372E]">
              {locale === "bn" ? "১. নোটিস ও অ্যানাউন্সমেন্ট বার" : "1. Announcement Bar Banner"}
            </h2>
          </div>

          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={settings.announcement_active}
              onChange={(e) =>
                setSettings({ ...settings, announcement_active: e.target.checked })
              }
              className="rounded text-[#14372E]"
            />
            <span className="font-semibold text-[#14372E]">
              {locale === "bn" ? "ব্যানার প্রদর্শন করুন" : "Enable Banner"}
            </span>
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "ব্যানার টেক্সট (বাংলা)" : "Banner Text (Bengali)"}
            </label>
            <input
              type="text"
              value={settings.announcement_bar_bn}
              onChange={(e) =>
                setSettings({ ...settings, announcement_bar_bn: e.target.value })
              }
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "ব্যানার টেক্সট (English)" : "Banner Text (English)"}
            </label>
            <input
              type="text"
              value={settings.announcement_bar_en}
              onChange={(e) =>
                setSettings({ ...settings, announcement_bar_en: e.target.value })
              }
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
          </div>
        </div>
      </div>

      {/* 2. WhatsApp Integration */}
      <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageCircle className="w-4 h-4 text-emerald-600" />
            <h2 className="font-serif text-base font-bold text-[#14372E]">
              {locale === "bn" ? "২. হোয়াটসঅ্যাপ অর্ডার সহায়তা" : "2. WhatsApp 1-Click Ordering"}
            </h2>
          </div>

          <label className="flex items-center gap-2 text-xs cursor-pointer">
            <input
              type="checkbox"
              checked={settings.whatsapp_enabled}
              onChange={(e) =>
                setSettings({ ...settings, whatsapp_enabled: e.target.checked })
              }
              className="rounded text-[#14372E]"
            />
            <span className="font-semibold text-[#14372E]">
              {locale === "bn" ? "হোয়াটসঅ্যাপ বাটন সক্রিয়" : "Active Float Button"}
            </span>
          </label>
        </div>

        <p className="text-xs text-[#1C1B18]/70">
          {locale === "bn"
            ? "আজাদ হায়ার অফিসিয়াল হোয়াটসঅ্যাপ সাপোর্ট নম্বর (+91 90000 00000) এ ১-ক্লিকে কার্ট বা প্রোডাক্ট সংক্রান্ত যোগাযোগ করার সুবিধা।"
            : "Connect customers directly to the Kolkata showroom WhatsApp hotline (+91 90000 00000)."}
        </p>
      </div>

      {/* 3. Shipping Threshold */}
      <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Truck className="w-4 h-4 text-[#14372E]" />
          <h2 className="font-serif text-base font-bold text-[#14372E]">
            {locale === "bn" ? "৩. ফ্রি ডেলিভারি সীমা (ফ্রি শিপিং মিটার)" : "3. Free Shipping Threshold"}
          </h2>
        </div>

        <div className="max-w-xs">
          <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
            {locale === "bn" ? "ন্যূনতম অর্ডার মূল্য (₹ INR)" : "Minimum Order Amount (₹ INR)"}
          </label>
          <input
            type="number"
            step="1"
            value={thresholdInr}
            onChange={(e) => setThresholdInr(e.target.value)}
            className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2 text-xs font-bold text-[#14372E] focus:outline-none focus:border-[#14372E]"
          />
          <span className="text-[11px] text-[#1C1B18]/60 mt-1 block">
            {locale === "bn"
              ? "এই পরিমাণের অধিক অর্ডারে গ্রাহক পুরো পশ্চিমবঙ্গে ফ্রি শিপিং পাবেন।"
              : "Orders above this value qualify for complimentary Bengal express delivery."}
          </span>
        </div>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2.5 rounded-xl bg-[#14372E] text-white font-bold text-xs shadow-md hover:bg-[#14372E]/90 flex items-center gap-2 disabled:opacity-50"
        >
          <Save className="w-4 h-4" />
          <span>{saving ? (locale === "bn" ? "সংরক্ষণ হচ্ছে..." : "Saving...") : locale === "bn" ? "সেটিংস সংরক্ষণ করুন" : "Save All Settings"}</span>
        </button>
      </div>
    </form>
  );
}
