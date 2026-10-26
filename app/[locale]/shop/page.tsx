import { Locale } from "@/lib/i18n";
import { db } from "@/lib/db";
import { ShopContainer } from "@/components/shop/shop-container";

export default async function ShopPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string; collection?: string; q?: string; sort?: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;
  const { category, collection, q } = await searchParams;

  const [products, categories, collections] = await Promise.all([
    db.getProducts(),
    db.getCategories(),
    db.getCollections(),
  ]);

  return (
    <ShopContainer
      products={products}
      categories={categories}
      collections={collections}
      locale={locale}
      initialCategory={category}
      initialCollection={collection}
      initialSearch={q}
    />
  );
}
