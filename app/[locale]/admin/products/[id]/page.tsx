import { Locale } from "@/lib/i18n";
import { db } from "@/lib/db";
import { AdminNav } from "@/components/admin/admin-nav";
import { ProductEditor } from "@/components/admin/product-editor";
import { notFound } from "next/navigation";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale: rawLocale, id } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const [product, categories, collections] = await Promise.all([
    db.getProductById(id),
    db.getCategories(),
    db.getCollections(),
  ]);

  if (!product) {
    notFound();
  }

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#FBF7F0]">
      <AdminNav locale={locale} />
      <main className="flex-1 p-6 lg:p-10">
        <ProductEditor
          locale={locale}
          initialProduct={product}
          categories={categories}
          collections={collections}
        />
      </main>
    </div>
  );
}
