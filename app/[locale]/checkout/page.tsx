import { Locale } from "@/lib/i18n";
import { CheckoutForm } from "@/components/checkout/checkout-form";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  return <CheckoutForm locale={locale} />;
}
