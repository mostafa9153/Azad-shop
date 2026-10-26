import { Locale } from "@/lib/i18n";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { OrdersManager } from "@/components/admin/orders-manager";

export default async function AdminOrdersPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const orders = await db.getOrders();

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FBF7F0]">
      <AdminNav locale={locale} />
      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-7xl">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E]">
            {locale === "bn" ? "অর্ডার ও শিপিং ব্যবস্থাপনা" : "Order Fulfillment & Shipping"}
          </h1>
          <p className="text-xs text-[#1C1B18]/70 mt-1">
            {locale === "bn"
              ? "গ্রাহকের অর্ডার প্রসেসিং, পেমেন্ট ভেরিফিকেশন ও জিএসটি ইনভয়েস জেনারেশন।"
              : "Manage customer purchases, payment verification and GST tax invoices."}
          </p>
        </div>

        <OrdersManager locale={locale} initialOrders={orders} />
      </main>
    </div>
  );
}
