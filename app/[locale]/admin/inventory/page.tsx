import { Locale } from "@/lib/i18n";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { InventoryManager } from "@/components/admin/inventory-manager";

export default async function AdminInventoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const [variants, ledger] = await Promise.all([
    db.getAllVariants(),
    db.getStockLedger(100),
  ]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FBF7F0]">
      <AdminNav locale={locale} />
      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E]">
              {locale === "bn" ? "ইনভেন্টরি ও অডিট লেজার" : "Inventory & Stock Ledger"}
            </h1>
            <p className="text-xs text-[#1C1B18]/70 mt-1">
              {locale === "bn"
                ? "রিয়েল-টাইম স্টক ট্র্যাকিং, লো-স্টক অ্যালার্ট এবং অপরিবর্তনীয় অডিট লেজার রেকর্ড।"
                : "Real-time stock monitoring, low-stock thresholds, and immutable ledger audit."}
            </p>
          </div>
        </div>

        <InventoryManager
          locale={locale}
          initialVariants={variants}
          initialLedger={ledger}
        />
      </main>
    </div>
  );
}
