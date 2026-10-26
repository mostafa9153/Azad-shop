import { Locale } from "@/lib/i18n";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { SettingsEditor } from "@/components/admin/settings-editor";

export default async function AdminSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const settings = await db.getSiteSettings();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FBF7F0]">
      <AdminNav locale={locale} />
      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-7xl">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E]">
            {locale === "bn" ? "সাইট সেটিংস ও কনফিগারেশন" : "Store Settings & Controls"}
          </h1>
          <p className="text-xs text-[#1C1B18]/70 mt-1">
            {locale === "bn"
              ? "অ্যানাউন্সমেন্ট ব্যানার, ফ্রি শিপিং থ্রেশহোল্ড ও সোশ্যাল সাপোর্ট কনফিগার করুন।"
              : "Manage storewide promotional banners, WhatsApp integration and shipping rules."}
          </p>
        </div>

        <SettingsEditor locale={locale} initialSettings={settings} />
      </main>
    </div>
  );
}
