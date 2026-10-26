"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { brandConfig } from "@/config/brand.config";
import { Locale, translate } from "@/lib/i18n";
import { Button } from "@/components/ui/button";
import { Input, Textarea } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox, Radio, Select } from "@/components/ui/selection";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  Sheet,
} from "@/components/ui/dialog";
import {
  PriceDisplay,
  QuantityStepper,
  Rating,
  SectionHeading,
  ArchImage,
  Breadcrumb,
  Skeleton,
  Pagination,
} from "@/components/ui/display";
import { Reveal } from "@/components/ui/reveal";
import { MessageCircle, ShoppingBag, Heart, Sparkles, Globe } from "lucide-react";
import { toast } from "sonner";

export default function DesignSystemPage() {
  const params = useParams();
  const locale = (params?.locale as Locale) || "bn";

  const [qty, setQty] = React.useState(1);
  const [sheetOpen, setSheetOpen] = React.useState(false);
  const [checked, setChecked] = React.useState(true);
  const [currentPage, setCurrentPage] = React.useState(2);

  const t = (k: string) => translate(locale, k);

  return (
    <div className="min-h-screen bg-[#FBF7F0] px-4 py-12 md:px-8 max-w-6xl mx-auto">
      {/* Top Header & Language Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-8 border-b border-[#E9DDC9] gap-4">
        <div>
          <span className="text-xs uppercase tracking-widest font-semibold text-[#A8834A]">
            Design System & Component Library
          </span>
          <h1 className="text-3xl md:text-4xl font-serif text-[#14372E] font-bold mt-1">
            {brandConfig.name[locale]} — {brandConfig.tagline[locale]}
          </h1>
          <p className="text-sm text-[#1C1B18]/70 mt-1">
            Warm Premium Islamic E-Commerce UI Kit (Phase 0 Acceptance)
          </p>
        </div>

        {/* Locale Toggle */}
        <div className="flex items-center gap-2 bg-[#E9DDC9]/50 p-1 rounded-lg">
          <Globe className="h-4 w-4 ml-2 text-[#14372E]" />
          <Link
            href="/bn/design-system"
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              locale === "bn"
                ? "bg-[#14372E] text-[#FBF7F0] shadow-xs"
                : "text-[#1C1B18] hover:bg-[#E9DDC9]"
            }`}
          >
            বাংলা
          </Link>
          <Link
            href="/en/design-system"
            className={`px-3 py-1.5 text-xs rounded-md font-medium transition-colors ${
              locale === "en"
                ? "bg-[#14372E] text-[#FBF7F0] shadow-xs"
                : "text-[#1C1B18] hover:bg-[#E9DDC9]"
            }`}
          >
            English
          </Link>
        </div>
      </div>

      <Breadcrumb
        items={[
          { label: t("common.home"), href: `/${locale}` },
          { label: "Design System" },
        ]}
      />

      {/* 1. Color Palette Tokens */}
      <section className="my-12">
        <SectionHeading
          title={locale === "bn" ? "রং ও প্যালেট টোকেন" : "Brand Color Tokens"}
          subtitle="Warm Premium: Cream, Sand, Forest Green, Antique Gold, Charcoal & Sage"
          centered={false}
        />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E9DDC9] text-center shadow-xs">
            <div className="w-full h-12 rounded-lg bg-[#FBF7F0] border border-[#E9DDC9] mb-2" />
            <div className="text-xs font-semibold text-[#1C1B18]">Cream Base</div>
            <div className="text-[10px] text-[#1C1B18]/60 font-mono">#FBF7F0</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E9DDC9] text-center shadow-xs">
            <div className="w-full h-12 rounded-lg bg-[#E9DDC9] mb-2" />
            <div className="text-xs font-semibold text-[#1C1B18]">Sand Accent</div>
            <div className="text-[10px] text-[#1C1B18]/60 font-mono">#E9DDC9</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E9DDC9] text-center shadow-xs">
            <div className="w-full h-12 rounded-lg bg-[#14372E] mb-2" />
            <div className="text-xs font-semibold text-[#1C1B18]">Forest Green</div>
            <div className="text-[10px] text-[#1C1B18]/60 font-mono">#14372E</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E9DDC9] text-center shadow-xs">
            <div className="w-full h-12 rounded-lg bg-[#A8834A] mb-2" />
            <div className="text-xs font-semibold text-[#1C1B18]">Antique Gold</div>
            <div className="text-[10px] text-[#1C1B18]/60 font-mono">#A8834A</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E9DDC9] text-center shadow-xs">
            <div className="w-full h-12 rounded-lg bg-[#1C1B18] mb-2" />
            <div className="text-xs font-semibold text-[#1C1B18]">Charcoal</div>
            <div className="text-[10px] text-[#1C1B18]/60 font-mono">#1C1B18</div>
          </div>
          <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E9DDC9] text-center shadow-xs">
            <div className="w-full h-12 rounded-lg bg-[#DDE5DB] mb-2" />
            <div className="text-xs font-semibold text-[#1C1B18]">Sage Green</div>
            <div className="text-[10px] text-[#1C1B18]/60 font-mono">#DDE5DB</div>
          </div>
        </div>
      </section>

      {/* 2. Buttons & Actions */}
      <section className="my-12">
        <SectionHeading
          title={locale === "bn" ? "বাটন ও অ্যাকশন ভ্যারিয়েন্ট" : "Buttons & Actions"}
          subtitle="Forest Primary, Sand Secondary, Gold Accent, Outline & WhatsApp"
          centered={false}
        />
        <div className="flex flex-wrap gap-4 items-center">
          <Button variant="forest" onClick={() => toast.success("Added to bag!")}>
            <ShoppingBag className="h-4 w-4" />
            {t("common.addToBag")}
          </Button>

          <Button variant="sand">
            {t("common.viewDetails")}
          </Button>

          <Button variant="gold">
            <Sparkles className="h-4 w-4" />
            {t("common.buyNow")}
          </Button>

          <Button variant="outline">
            <Heart className="h-4 w-4" />
            {t("common.wishlist")}
          </Button>

          <Button variant="whatsapp">
            <MessageCircle className="h-4 w-4" />
            {t("common.orderOnWhatsApp")}
          </Button>
        </div>
      </section>

      {/* 3. Badges & Chips */}
      <section className="my-12">
        <SectionHeading
          title={locale === "bn" ? "ব্যাজ ও স্ট্যাটাস চিপস" : "Badges & Status"}
          centered={false}
        />
        <div className="flex flex-wrap gap-3">
          <Badge variant="forest">বোরকা / Burkha</Badge>
          <Badge variant="gold">প্রিমিয়াম কোয়ালিটি</Badge>
          <Badge variant="sage">ফ্রি সাইজ</Badge>
          <Badge variant="sale">20% ছাড়</Badge>
          <Badge variant="new">নতুন এসেছে</Badge>
          <Badge variant="soldOut">স্টক শেষ</Badge>
        </div>
      </section>

      {/* 4. Form Controls */}
      <section className="my-12">
        <SectionHeading
          title={locale === "bn" ? "ইনপুট ও ফর্ম কন্ট্রোল" : "Form Elements"}
          centered={false}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-white/50 p-6 rounded-xl border border-[#E9DDC9]">
          <Input placeholder={t("home.newsletterPlaceholder")} />
          <Select
            options={[
              { value: "52", label: "Length 52 (Height 5'0\" - 5'2\")" },
              { value: "54", label: "Length 54 (Height 5'3\" - 5'4\")" },
              { value: "56", label: "Length 56 (Height 5'5\" - 5'6\")" },
            ]}
          />
          <Textarea placeholder={t("product.customSizeDesc")} />
          <div className="space-y-4">
            <Checkbox
              label={locale === "bn" ? "ক্যাশ অন ডেলিভারি (COD) প্রযোজ্য" : "Enable Cash on Delivery"}
              checked={checked}
              onChange={(e) => setChecked(e.target.checked)}
            />
            <Radio
              name="payment"
              label={locale === "bn" ? "ইউপিআই কিউআর (UPI QR)" : "Pay via UPI QR Code"}
              defaultChecked
            />
            <Radio
              name="payment"
              label={locale === "bn" ? "কার্ড / নেটব্যাঙ্কিং" : "Debit / Credit Card"}
            />
          </div>
        </div>
      </section>

      {/* 5. Pricing, Stepper & Ratings */}
      <section className="my-12">
        <SectionHeading
          title={locale === "bn" ? "মূল্য ও সংখ্যা নিয়ন্ত্রণ" : "Price & Quantities"}
          centered={false}
        />
        <div className="flex flex-wrap items-center gap-8 bg-white/50 p-6 rounded-xl border border-[#E9DDC9]">
          <div>
            <span className="text-xs text-[#1C1B18]/60 block mb-1">PriceDisplay:</span>
            <PriceDisplay
              pricePaise={189900}
              originalPricePaise={249900}
              locale={locale}
              size="xl"
            />
          </div>

          <div>
            <span className="text-xs text-[#1C1B18]/60 block mb-1">QuantityStepper:</span>
            <QuantityStepper value={qty} onChange={setQty} />
          </div>

          <div>
            <span className="text-xs text-[#1C1B18]/60 block mb-1">Customer Rating:</span>
            <Rating value={4.8} count={128} size="md" />
          </div>
        </div>
      </section>

      {/* 6. Signature Arch Image Frame */}
      <section className="my-12">
        <SectionHeading
          title={locale === "bn" ? "মিহরাব আর্চ ফ্রেম" : "Signature Mihrab Arch Frame"}
          subtitle="Signature Islamic architecture arch curve for product & category showcases"
          centered={false}
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          <ArchImage
            src="/placeholder-product.svg"
            alt="Azad Haya Burkha Frame"
          />
          <div className="space-y-4 p-6 rounded-xl border border-[#E9DDC9] bg-white/40 flex flex-col justify-center">
            <Badge variant="gold">Signature Aesthetic</Badge>
            <h3 className="text-xl font-serif font-bold text-[#14372E]">
              {locale === "bn" ? "মিহরাব খাঁজ আর্চ ফ্রেম" : "Mihrab Arch Geometry"}
            </h3>
            <p className="text-sm text-[#1C1B18]/70 leading-relaxed">
              {locale === "bn"
                ? "আমাদের প্রতিটি পণ্যের কার্ড ও ক্যাটাগরি ব্যানার ইসলামিক স্থাপত্যের মিহরাব আকৃতিতে সুনিপুণভাবে তৈরি।"
                : "Every product card and hero visual is framed in our signature Mihrab arch shape, honoring Islamic heritage with modern luxury."}
            </p>
          </div>
        </div>
      </section>

      {/* 7. Dialog & Drawer */}
      <section className="my-12">
        <SectionHeading
          title={locale === "bn" ? "মোডাল ও সাইড ড্রয়ার" : "Dialogs & Drawers"}
          centered={false}
        />
        <div className="flex gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">{t("product.sizeGuide")}</Button>
            </DialogTrigger>
            <DialogContent>
              <h3 className="text-lg font-serif font-bold text-[#14372E]">
                {t("product.sizeGuide")} (বোরকা ও আবায়া)
              </h3>
              <p className="text-sm text-[#1C1B18]/70 mt-2">
                উচ্চতা ৫ ফুট ০ ইঞ্চি থেকে ৫ ফুট ২ ইঞ্চি হলে সাইজ ৫২ বেছে নিন। ৫ ফুট ৩ ইঞ্চি থেকে ৫ ফুট ৪ ইঞ্চি হলে সাইজ ৫৪।
              </p>
            </DialogContent>
          </Dialog>

          <Button variant="sand" onClick={() => setSheetOpen(true)}>
            {locale === "bn" ? "মিনি-ব্যাগ ড্রয়ার দেখুন" : "Open Mini-Bag Drawer"}
          </Button>

          <Sheet
            open={sheetOpen}
            onOpenChange={setSheetOpen}
            title={t("cart.title")}
          >
            <div className="space-y-4">
              <p className="text-sm text-[#1C1B18]/70">
                {t("cart.emptySubtitle")}
              </p>
              <Button
                variant="forest"
                className="w-full"
                onClick={() => setSheetOpen(false)}
              >
                {t("cart.continueShopping")}
              </Button>
            </div>
          </Sheet>
        </div>
      </section>

      {/* 8. Accordion & Tabs */}
      <section className="my-12">
        <SectionHeading
          title={locale === "bn" ? "অ্যাকর্ডিয়ন ও ট্যাব কন্ট্রোল" : "Accordion & Tabs"}
          centered={false}
        />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <Accordion type="single" collapsible defaultValue="item-1">
              <AccordionItem value="item-1">
                <AccordionTrigger>{t("product.description")}</AccordionTrigger>
                <AccordionContent>
                  প্রিমিয়াম কোরিয়ান নিদা ফেব্রিক, হালকা ও দীর্ঘস্থায়ী পরিধানে আরামদায়ক।
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="item-2">
                <AccordionTrigger>{t("product.fabricAndCare")}</AccordionTrigger>
                <AccordionContent>
                  ঠান্ডা জলে মৃদু ডিটারজেন্ট দিয়ে ধুয়ে নিন। ছায়ায় শুকান।
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </div>

          <div>
            <Tabs defaultValue="women">
              <TabsList className="w-full">
                <TabsTrigger value="women" className="flex-1">{t("home.tabWomen")}</TabsTrigger>
                <TabsTrigger value="men" className="flex-1">{t("home.tabMen")}</TabsTrigger>
                <TabsTrigger value="kids" className="flex-1">{t("home.tabKids")}</TabsTrigger>
              </TabsList>
              <TabsContent value="women" className="p-4 bg-white/40 rounded-lg border border-[#E9DDC9]">
                বোরকা, আবায়া, জিলবাব, হিজাব ও খিমার কালেকশন।
              </TabsContent>
              <TabsContent value="men" className="p-4 bg-white/40 rounded-lg border border-[#E9DDC9]">
                প্রিমিয়াম পাঞ্জাবি, কাবলি সেট, টুপি ও পায়জামা।
              </TabsContent>
              <TabsContent value="kids" className="p-4 bg-white/40 rounded-lg border border-[#E9DDC9]">
                ছোটদের আবায়া, হিজাব ও পাঞ্জাবি।
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </section>

      {/* 9. Pagination */}
      <section className="my-12">
        <SectionHeading
          title={locale === "bn" ? "পৃষ্ঠা নম্বর ও পেজিনেশন" : "Numbered Pagination"}
          centered={false}
        />
        <div className="rounded-xl border border-[#E9DDC9] bg-white/50 p-6">
          <Pagination
            currentPage={currentPage}
            totalPages={8}
            onPageChange={setCurrentPage}
            locale={locale}
          />
          <p className="text-center text-xs text-[#1C1B18]/60 mt-2">
            {locale === "bn"
              ? `বর্তমান পৃষ্ঠা: ${currentPage} (মোট ৮টি পৃষ্ঠা)`
              : `Current Page: ${currentPage} of 8`}
          </p>
        </div>
      </section>

      {/* 10. Toasts & Feedback */}
      <section className="my-12">
        <SectionHeading
          title={locale === "bn" ? "টোস্ট নোটিফিকেশন" : "Toast Notifications"}
          centered={false}
        />
        <div className="flex flex-wrap gap-4">
          <Button
            variant="forest"
            size="sm"
            onClick={() =>
              toast.success(
                locale === "bn"
                  ? "পণ্যটি সফলভাবে ব্যাগে যুক্ত হয়েছে"
                  : "Item successfully added to bag"
              )
            }
          >
            {locale === "bn" ? "সাকসেস টোস্ট" : "Success Toast"}
          </Button>
          <Button
            variant="sand"
            size="sm"
            onClick={() =>
              toast.info(
                locale === "bn"
                  ? "কুপন কোড EID10 প্রয়োগ করা হয়েছে"
                  : "Coupon EID10 applied"
              )
            }
          >
            {locale === "bn" ? "ইনফো টোস্ট" : "Info Toast"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              toast.error(
                locale === "bn"
                  ? "দুঃখিত, স্টক সীমাবদ্ধ রয়েছে"
                  : "Sorry, stock is limited"
              )
            }
          >
            {locale === "bn" ? "এরর টোস্ট" : "Error Toast"}
          </Button>
        </div>
      </section>
    </div>
  );
}
