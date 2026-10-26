import { Locale, formatPrice } from "@/lib/i18n";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import Link from "next/link";
import {
  DollarSign,
  ShoppingBag,
  Package,
  AlertTriangle,
  Scissors,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default async function AdminDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const [products, orders, tailoringJobs] = await Promise.all([
    db.getProducts(),
    db.getOrders(),
    db.getTailoringQueue(),
  ]);

  const totalRevenuePaise = orders
    .filter((o) => o.payment_status === "paid")
    .reduce((acc, o) => acc + o.total_paise, 0);

  const pendingOrders = orders.filter((o) => o.order_status === "pending" || o.order_status === "processing");
  const activeTailoring = tailoringJobs.filter((j) => j.status !== "completed");

  // Collect low stock variants
  const lowStockItems: Array<{ sku: string; title: string; qty: number; threshold: number }> = [];
  products.forEach((p) => {
    p.variants?.forEach((v) => {
      if (v.stock_quantity <= v.low_stock_threshold) {
        lowStockItems.push({
          sku: v.sku,
          title: locale === "bn" ? p.title_bn : p.title_en,
          qty: v.stock_quantity,
          threshold: v.low_stock_threshold,
        });
      }
    });
  });

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FBF7F0]">
      <AdminNav locale={locale} />

      <main className="flex-1 p-6 lg:p-10 space-y-8 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E]">
              {locale === "bn" ? "অ্যাডমিন ড্যাশবোর্ড ও সার্বিক পরিসংখ্যান" : "Executive Dashboard"}
            </h1>
            <p className="text-xs text-[#1C1B18]/70 mt-1">
              {locale === "bn"
                ? "বিক্রয়, অর্ডার প্রসেসিং, ইনভেন্টরি সতর্কতা ও দরজি কাজের লাইভ চিত্র।"
                : "Real-time overview of revenue, pending shipments, inventory, and atelier queue."}
            </p>
          </div>

          <Link
            href={`/${locale}/admin/products/new`}
            className="px-4 py-2.5 rounded-xl bg-[#14372E] text-[#FBF7F0] text-xs font-bold shadow-md hover:bg-[#14372E]/90 transition-colors w-fit flex items-center gap-1.5"
          >
            <Sparkles className="w-4 h-4 text-[#C5A059]" />
            <span>{locale === "bn" ? "+ নতুন পণ্য যুক্ত করুন" : "+ Add New Product"}</span>
          </Link>
        </div>

        {/* 4 Stat Cards Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Revenue */}
          <div className="bg-white p-5 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#A8834A] uppercase tracking-wider">
              {locale === "bn" ? "মোট বিক্রয় রাজস্ব" : "Total Revenue"}
            </span>
            <p className="text-2xl font-bold text-[#14372E] font-serif">
              {formatPrice(totalRevenuePaise, locale)}
            </p>
            <p className="text-[10px] text-[#1C1B18]/50">
              {orders.length} {locale === "bn" ? "টি অর্ডারের মাধ্যমে" : "orders processed"}
            </p>
          </div>

          {/* Pending Orders */}
          <div className="bg-white p-5 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-amber-600 uppercase tracking-wider">
              {locale === "bn" ? "চলমান অর্ডার" : "Pending Shipments"}
            </span>
            <p className="text-2xl font-bold text-[#14372E] font-serif">
              {pendingOrders.length}
            </p>
            <p className="text-[10px] text-[#1C1B18]/50">
              {locale === "bn" ? "প্রক্রিয়াকরণ ও শিপিং বাকি" : "Awaiting dispatch"}
            </p>
          </div>

          {/* Low Stock Alerts */}
          <div className="bg-white p-5 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider">
              {locale === "bn" ? "সীমিত স্টক সতর্কতা" : "Low Stock Alerts"}
            </span>
            <p className="text-2xl font-bold text-red-600 font-serif">
              {lowStockItems.length}
            </p>
            <p className="text-[10px] text-[#1C1B18]/50">
              {locale === "bn" ? "দ্রুত রিস্টক প্রয়োজন" : "Items below threshold"}
            </p>
          </div>

          {/* Tailoring Queue */}
          <div className="bg-white p-5 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-[#14372E] uppercase tracking-wider">
              {locale === "bn" ? "দরজি সেলাই কিউ" : "Active Tailoring"}
            </span>
            <p className="text-2xl font-bold text-[#14372E] font-serif">
              {activeTailoring.length}
            </p>
            <p className="text-[10px] text-[#1C1B18]/50">
              {locale === "bn" ? "কাস্টম সাইজের কাজ চলছে" : "Custom orders in progress"}
            </p>
          </div>
        </div>

        {/* 2-Column Split: Recent Orders & Low Stock Table */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Orders */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-[#14372E]">
                {locale === "bn" ? "সাম্প্রতিক অর্ডার সমূহ" : "Recent Orders"}
              </h3>
              <Link
                href={`/${locale}/admin/orders`}
                className="text-xs font-semibold text-[#A8834A] hover:underline"
              >
                {locale === "bn" ? "সকল অর্ডার" : "View All"} &rarr;
              </Link>
            </div>

            {orders.length === 0 ? (
              <p className="text-xs text-[#1C1B18]/60 py-6 text-center italic">
                {locale === "bn" ? "এখনও কোনো অর্ডার আসেনি।" : "No orders recorded yet."}
              </p>
            ) : (
              <div className="divide-y divide-[#E9DDC9] text-xs">
                {orders.slice(0, 5).map((o) => (
                  <div key={o.id} className="py-3 flex items-center justify-between">
                    <div>
                      <p className="font-mono font-bold text-[#14372E]">{o.order_number}</p>
                      <p className="text-[11px] text-[#1C1B18]/60">{o.customer_name} • +91 {o.customer_phone}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#1C1B18]">{formatPrice(o.total_paise, locale)}</p>
                      <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold bg-[#14372E] text-white uppercase">
                        {o.order_status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Low Stock Warning List */}
          <div className="bg-white p-6 rounded-2xl border border-[#E9DDC9] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-red-700 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <span>{locale === "bn" ? "জরুরি রিস্টক সতর্কতা" : "Low Stock Alerts"}</span>
              </h3>
              <Link
                href={`/${locale}/admin/inventory`}
                className="text-xs font-semibold text-[#A8834A] hover:underline"
              >
                {locale === "bn" ? "ইনভেন্টরি দেখুন" : "View Inventory"} &rarr;
              </Link>
            </div>

            {lowStockItems.length === 0 ? (
              <p className="text-xs text-green-700 py-6 text-center font-semibold">
                ✓ {locale === "bn" ? "সকল পণ্যের স্টক সন্তোষজনক।" : "All stock levels healthy."}
              </p>
            ) : (
              <div className="divide-y divide-[#E9DDC9] text-xs">
                {lowStockItems.slice(0, 5).map((item, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-[#1C1B18]">{item.title}</p>
                      <p className="font-mono text-[10px] text-[#1C1B18]/50">{item.sku}</p>
                    </div>
                    <div className="text-right">
                      <span className="px-2 py-0.5 rounded-full bg-red-100 text-red-800 font-bold text-xs">
                        {item.qty} left
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
