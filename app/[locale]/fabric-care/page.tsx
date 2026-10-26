import { Locale } from "@/lib/i18n";
import { Sparkles, Droplets, Sun, Shirt, ShieldCheck } from "lucide-react";

export default async function FabricCarePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  const locale = (rawLocale === "en" ? "en" : "bn") as Locale;

  const fabrics = [
    {
      name_bn: "কোরিয়ান প্রিমিয়াম নিদা (Korean Nida)",
      name_en: "Korean Premium Nida Fabric",
      desc_bn:
        "সর্বোচ্চ মানের নরম ও মসৃণ টেক্সচার। শতভাগ অপাক (স্বচ্ছ নয়), কুঁচকে যায় না এবং বাংলার গরম ও আর্দ্র আবহাওয়ায় শরীর ঠান্ডা রাখে। দৈনন্দিন ও আনুষ্ঠানিক আবায়ার জন্য সেরা পছন্দ।",
      desc_en:
        "Silky soft, 100% opaque, anti-static, and breathably cool. Drapes effortlessly without clinging. Resistant to wrinkles—the gold standard for luxury daily abayas.",
      wash_bn: "ঠান্ডা পানিতে মৃদু লিকুইড ডিটারজেন্ট দিয়ে হাতে ধোয়া বা জেন্টল ওয়াশ। ড্রায়ার পরিহার করুন।",
      wash_en: "Machine wash delicate in cold water or hand wash. Air dry in shade. Avoid high tumble drying.",
      iron_bn: "কম থেকে মাঝারি তাপে উল্টো দিক থেকে ইস্ত্রি করুন অথবা স্টিম আয়রন ব্যবহার করুন।",
      iron_en: "Low to medium heat on reverse side, or gentle garment steamer.",
    },
    {
      name_bn: "দুবাই চেরি ক্রেপ (Dubai Cherry Crepe)",
      name_en: "Dubai Cherry Crepe Fabric",
      desc_bn:
        "ম্যাট ফিনিশযুক্ত উচ্চমানের ক্রেপ ফেব্রিক। ফ্লেয়ার্ড কাটিং ও জিলবাবে অসাধারণ ড্রপ ও গভীর রঙ ধরে রাখে। সহজে দাগ পড়ে না এবং টেকসই।",
      desc_en:
        "Matte textured luxury crepe offering heavy, regal drape for flared abayas and overhead jilbabs. Exceptional color retention and durability.",
      wash_bn: "স্বাভাবিক ঠান্ডা পানিতে ধোয়া যাবে। ক্লোরিন ব্লিচ কখনোই ব্যবহার করবেন না।",
      wash_en: "Hand or machine wash gentle. Never use chlorine bleach.",
      iron_bn: "মাঝারি তাপে সাধারণ ইস্ত্রি করা যায়।",
      iron_en: "Medium heat standard iron or handheld steam.",
    },
    {
      name_bn: "তুর্কি মদিনা সিল্ক (Turkish Medina Silk)",
      name_en: "Turkish Medina Silk",
      desc_bn:
        "হিজাব ও স্পেশাল ওড়নার জন্য সর্বাধিক সমাদৃত। এতে রয়েছে হালকা সাটিন আভা, তবে পিছলে যায় না। পিনের ছিদ্র দাগ পড়ে না।",
      desc_en:
        "Renowned for headscarves and luxury wraps. Micro-textured so it doesn't slip, with a refined subtle luster. Self-healing micro-fibers resist pin snags.",
      wash_bn: "শুধুমাত্র ঠান্ডা পানিতে হালকা শ্যাম্পু বা মাইল্ড ওয়াশ। নিংড়াবেন না।",
      wash_en: "Gentle shampoo or mild wash by hand. Do not wring fiercely.",
      iron_bn: "সর্বনিম্ন তাপে সুতি কাপড়ের ওপর দিয়ে অথবা স্টিম দিয়ে ইস্ত্রি করুন।",
      iron_en: "Lowest silk setting or low steam through a protective pressing cloth.",
    },
    {
      name_bn: "খাঁটি বেঙ্গল হ্যান্ডলুম কটন (Pure Bengal Cotton)",
      name_en: "Pure Bengal Handloom Cotton",
      desc_bn:
        "ফুলিয়া ও শান্তিপুরের সুতা দিয়ে বোনা প্রাকৃতিক খাঁটি সুতি। লখনউই চিকেনকারি পাঞ্জাবি ও আরামদায়ক কুর্তির জন্য শতভাগ প্রাকৃতিক ও ত্বক-বান্ধব।",
      desc_en:
        "Traditional handloom woven natural cotton. Ultra-breathable, hypoallergenic, and ideal for Chikankari kurta sets and festive summer panjabis.",
      wash_bn: "প্রথম ধোয়ার সময় হালকা লবণ পানিতে ভিজিয়ে রাখলে রঙ চিরস্থায়ী হয়।",
      wash_en: "Gentle hand wash. For initial wash, soak briefly in mild salted water to lock pure organic dye.",
      iron_bn: "সুতি তাপে গরম ইস্ত্রি করা যেতে পারে (হালকা জল স্প্রে করে)।",
      iron_en: "High cotton setting with damp spray or steam.",
    },
  ];

  return (
    <div className="min-h-screen bg-[#FBF7F0] py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-10">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#14372E]/10 text-[#14372E] text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A059]" />
            <span>{locale === "bn" ? "ফেব্রিক সহায়িকা" : "Textile Guide"}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-[#14372E]">
            {locale === "bn" ? "ফেব্রিক পরিচিতি ও যত্ন নির্দেশিকা" : "Fabric & Garment Care Guide"}
          </h1>
          <p className="text-xs sm:text-sm text-[#1C1B18]/70 max-w-xl mx-auto">
            {locale === "bn"
              ? "আজাদ হায়ার প্রতিটি পোশাক বহু বছর সুন্দর ও নতুন রাখার সঠিক যত্ন ও ফ্যাব্রিক তথ্য।"
              : "Keep your handcrafted modest pieces pristine and enduring with our expert fabric care instructions."}
          </p>
        </div>

        {/* Fabric Cards */}
        <div className="space-y-6">
          {fabrics.map((f, i) => (
            <div
              key={i}
              className="bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-2xs space-y-4"
            >
              <div className="flex items-center justify-between border-b border-[#E9DDC9] pb-3">
                <h2 className="font-serif text-xl font-bold text-[#14372E]">
                  {locale === "bn" ? f.name_bn : f.name_en}
                </h2>
                <span className="px-3 py-1 rounded-full bg-[#FBF7F0] border border-[#E9DDC9] text-xs font-semibold text-[#A8834A]">
                  {locale === "bn" ? "প্রিমিয়াম কোয়ালিটি" : "Imported Grade"}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#1C1B18]/80 leading-relaxed">
                {locale === "bn" ? f.desc_bn : f.desc_en}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#14372E]">
                    <Droplets className="w-4 h-4 text-blue-600" />
                    <span>{locale === "bn" ? "ধোয়ার নিয়ম" : "Washing Care"}</span>
                  </div>
                  <p className="text-xs text-[#1C1B18]/70">
                    {locale === "bn" ? f.wash_bn : f.wash_en}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9] space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-[#14372E]">
                    <Sun className="w-4 h-4 text-amber-600" />
                    <span>{locale === "bn" ? "ইস্ত্রি ও শুকানো" : "Ironing & Drying"}</span>
                  </div>
                  <p className="text-xs text-[#1C1B18]/70">
                    {locale === "bn" ? f.iron_bn : f.iron_en}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
