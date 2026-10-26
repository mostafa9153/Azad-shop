import { Locale, locales } from "@/lib/i18n";
import { notFound } from "next/navigation";
import { AnnouncementBar } from "@/components/layout/announcement-bar";
import { Header } from "@/components/layout/header";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { WhatsAppButton } from "@/components/layout/whatsapp-button";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!locales.includes(locale as Locale)) {
    notFound();
  }

  const loc = locale as Locale;

  return (
    <div className={`min-h-screen flex flex-col ${loc === "bn" ? "bn-text" : "en-text"}`}>
      <AnnouncementBar locale={loc} />
      <Header locale={loc} />
      <main className="flex-1">{children}</main>
      <Footer locale={loc} />
      <MobileNav locale={loc} />
      <WhatsAppButton locale={loc} />
      <CookieBanner locale={loc} />
    </div>
  );
}
