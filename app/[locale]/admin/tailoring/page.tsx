import { Locale } from "@/lib/i18n";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { TailoringManager } from "@/components/admin/tailoring-manager";

export default async function AdminTailoringPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const queue = await db.getTailoringQueue();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FBF7F0]">
      <AdminNav locale={locale} />
      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-7xl">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E]">
            {locale === "bn" ? "দরজি কিউ ও কারিগর কর্মশালা" : "Tailoring Queue & Atelier Workshop"}
          </h1>
          <p className="text-xs text-[#1C1B18]/70 mt-1">
            {locale === "bn"
              ? "কাস্টম মাপের আবায়া ও বোরখার সুনির্দিষ্ট সেলাই অগ্রগতি ও গুণগত মান নিয়ন্ত্রণ।"
              : "Monitor custom measurements, 6-stage stitching workflow and master tailor allocations."}
          </p>
        </div>

        <TailoringManager locale={locale} initialJobs={queue} />
      </main>
    </div>
  );
}
