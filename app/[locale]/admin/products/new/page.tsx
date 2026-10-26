import { Locale } from "@/lib/i18n";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { ProductEditor } from "@/components/admin/product-editor";

export default async function NewProductPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const [categories, collections] = await Promise.all([
    db.getCategories(),
    db.getCollections(),
  ]);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FBF7F0]">
      <AdminNav locale={locale} />
      <main className="flex-1 p-6 lg:p-10">
        <ProductEditor
          locale={locale}
          categories={categories}
          collections={collections}
        />
      </main>
    </div>
  );
}
