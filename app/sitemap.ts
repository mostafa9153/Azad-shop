import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://azadhaya.com";
  const locales = ["bn", "en"];
  const now = new Date();

  // Static routes
  const staticPaths = [
    "",
    "/shop",
    "/about",
    "/fabric-care",
    "/size-guide",
    "/custom-tailoring",
    "/contact",
    "/track",
    "/privacy-policy",
    "/terms",
    "/shipping-returns",
  ];

  const staticEntries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const path of staticPaths) {
      staticEntries.push({
        url: `${baseUrl}/${locale}${path}`,
        lastModified: now,
        changeFrequency: path === "" || path === "/shop" ? "daily" : "weekly",
        priority: path === "" ? 1.0 : path === "/shop" ? 0.9 : 0.7,
      });
    }
  }

  // Dynamic products
  const products = await db.getProducts();
  const productEntries: MetadataRoute.Sitemap = [];
  for (const locale of locales) {
    for (const p of products) {
      productEntries.push({
        url: `${baseUrl}/${locale}/product/${p.slug}`,
        lastModified: new Date(p.updated_at || now),
        changeFrequency: "weekly",
        priority: p.is_bestseller || p.is_featured ? 0.9 : 0.8,
      });
    }
  }

  return [...staticEntries, ...productEntries];
}
