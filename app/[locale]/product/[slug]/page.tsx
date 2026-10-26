import { notFound } from "next/navigation";
import { Locale, locales } from "@/lib/i18n";
import { db } from "@/lib/db";
import { ProductDetailView } from "@/components/product/product-detail-view";
import type { Metadata } from "next";

export async function generateStaticParams() {
  const products = await db.getProducts();
  const params: Array<{ locale: string; slug: string }> = [];

  for (const locale of locales) {
    for (const p of products) {
      params.push({
        locale,
        slug: p.slug,
      });
    }
  }

  return params;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: rawLocale, slug } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;
  const product = await db.getProductBySlug(slug);

  if (!product) return {};

  const title = locale === "bn" ? product.title_bn : product.title_en;
  const desc = locale === "bn" ? product.short_desc_bn : product.short_desc_en;

  return {
    title: `${title} | AZAD HAYA (আজাদ হায়া)`,
    description: desc,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: rawLocale, slug } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const product = await db.getProductBySlug(slug);
  if (!product) {
    notFound();
  }

  const [relatedProducts, reviews] = await Promise.all([
    db.getProducts({ categoryId: product.category_id, limit: 5 }),
    db.getReviews(product.id),
  ]);

  const filteredRelated = relatedProducts.filter((p) => p.id !== product.id);

  return (
    <ProductDetailView
      product={product}
      relatedProducts={filteredRelated}
      reviews={reviews}
      locale={locale}
    />
  );
}
