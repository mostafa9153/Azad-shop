import { Locale, formatPrice } from "@/lib/i18n";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import Link from "next/link";
import Image from "next/image";
import { Plus, Edit, Search } from "lucide-react";

export default async function AdminProductsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; search?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;
  const { category, search } = await searchParams;

  const [products, categories] = await Promise.all([
    db.getProducts({
      categorySlug: category,
      search,
    }),
    db.getCategories(),
  ]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FBF7F0]">
      <AdminNav locale={locale} />

      <main className="flex-1 p-6 lg:p-10 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-[#14372E]">
              {locale === "bn" ? "পণ্য সম্ভার ব্যবস্থাপনা" : "Product Catalog Management"}
            </h1>
            <p className="text-xs text-[#1C1B18]/70 mt-1">
              {locale === "bn"
                ? `মোট ${products.length}টি পণ্য সংরক্ষিত রয়েছে।`
                : `Managing ${products.length} catalog items.`}
            </p>
          </div>

          <Link
            href={`/${locale}/admin/products/new`}
            className="px-4 py-2.5 rounded-xl bg-[#14372E] text-[#FBF7F0] text-xs font-bold shadow-md hover:bg-[#14372E]/90 transition-colors flex items-center gap-1.5 w-fit"
          >
            <Plus className="w-4 h-4" />
            <span>{locale === "bn" ? "নতুন পণ্য যোগ করুন" : "Add Product"}</span>
          </Link>
        </div>

        {/* Filter Bar */}
        <div className="bg-white p-4 rounded-2xl border border-[#E9DDC9] shadow-2xs flex flex-wrap gap-3 items-center justify-between">
          <form method="GET" className="flex items-center gap-2 flex-1 max-w-md">
            <input
              type="text"
              name="search"
              defaultValue={search || ""}
              placeholder={locale === "bn" ? "SKU বা নাম দিয়ে খুঁজুন..." : "Search by SKU or title..."}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-[#14372E]"
            />
            <button
              type="submit"
              className="p-2 rounded-xl bg-[#14372E] text-white hover:bg-[#14372E]/90"
              aria-label="Search"
            >
              <Search className="w-4 h-4" />
            </button>
          </form>

          <div className="flex gap-2">
            <Link
              href={`/${locale}/admin/products`}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                !category ? "bg-[#14372E] text-white font-bold" : "bg-[#FBF7F0] border border-[#E9DDC9]"
              }`}
            >
              {locale === "bn" ? "সব" : "All"}
            </Link>
            {categories.map((c) => (
              <Link
                key={c.id}
                href={`/${locale}/admin/products?category=${c.slug}`}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                  category === c.slug ? "bg-[#14372E] text-white font-bold" : "bg-[#FBF7F0] border border-[#E9DDC9]"
                }`}
              >
                {locale === "bn" ? c.name_bn : c.name_en}
              </Link>
            ))}
          </div>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-2xl border border-[#E9DDC9] shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead className="bg-[#14372E] text-[#FBF7F0]">
                <tr>
                  <th className="p-3.5">ছবি</th>
                  <th className="p-3.5">SKU & নাম</th>
                  <th className="p-3.5">ক্যাটাগরি</th>
                  <th className="p-3.5">মূল্য</th>
                  <th className="p-3.5">স্টক সংখ্যা</th>
                  <th className="p-3.5">কাস্টম সাইজ</th>
                  <th className="p-3.5 text-right">অ্যাকশন</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E9DDC9]">
                {products.map((p) => {
                  const totalStock = p.variants?.reduce((acc, v) => acc + v.stock_quantity, 0) || 0;
                  return (
                    <tr key={p.id} className="hover:bg-[#FBF7F0]/50 transition-colors">
                      <td className="p-3">
                        <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-[#FBF7F0] border border-[#E9DDC9]">
                          <Image
                            src={p.images?.[0]?.image_url || "/placeholder-product.svg"}
                            alt=""
                            fill
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      </td>
                      <td className="p-3">
                        <p className="font-bold text-[#14372E] text-sm">
                          {locale === "bn" ? p.title_bn : p.title_en}
                        </p>
                        <p className="font-mono text-[10px] text-[#1C1B18]/50">{p.sku}</p>
                      </td>
                      <td className="p-3 font-semibold text-[#A8834A]">
                        {p.category ? (locale === "bn" ? p.category.name_bn : p.category.name_en) : "-"}
                      </td>
                      <td className="p-3 font-bold text-[#14372E]">
                        {formatPrice(p.base_price_paise, locale)}
                      </td>
                      <td className="p-3">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${
                            totalStock <= 5 ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                          }`}
                        >
                          {totalStock} {locale === "bn" ? "পিস" : "pcs"}
                        </span>
                      </td>
                      <td className="p-3">
                        {p.allows_custom_size ? (
                          <span className="text-green-700 font-bold">✓ হ্যাঁ</span>
                        ) : (
                          <span className="text-gray-400">না</span>
                        )}
                      </td>
                      <td className="p-3 text-right">
                        <Link
                          href={`/${locale}/admin/products/${p.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-[#14372E] text-[#14372E] hover:bg-[#14372E] hover:text-white font-bold transition-colors"
                        >
                          <Edit className="w-3.5 h-3.5" />
                          <span>{locale === "bn" ? "সম্পাদনা" : "Edit"}</span>
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
