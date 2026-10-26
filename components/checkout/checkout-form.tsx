"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Locale, formatPrice } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { useCartStore } from "@/lib/cart-store";
import {
  ShieldCheck,
  Truck,
  CreditCard,
  QrCode,
  Banknote,
  MessageCircle,
  Check,
  ArrowRight,
  ArrowLeft,
  Scissors,
  Store,
  Clock,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";

interface CheckoutFormProps {
  locale: Locale;
}

export function CheckoutForm({ locale }: CheckoutFormProps) {
  const router = useRouter();
  const { items, clearCart, getTotalPaise } = useCartStore();

  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Step 1: Shipping info
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [addressLine1, setAddressLine1] = useState("");
  const [addressLine2, setAddressLine2] = useState("");
  const [city, setCity] = useState("Kolkata");
  const [state, setState] = useState("West Bengal");
  const [pincode, setPincode] = useState("700017");
  const [deliveryType, setDeliveryType] = useState<"courier" | "pickup">("courier");
  const [notes, setNotes] = useState("");

  // Step 2 & 3: Payment & Coupon
  const [couponCode, setCouponCode] = useState("");
  const [appliedCoupon, setAppliedCoupon] = useState<{ code: string; discountPaise: number } | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<
    "demo_upi" | "manual_upi" | "cod" | "card" | "whatsapp"
  >("demo_upi");

  // Payment states
  const [qrDataUrl, setQrDataUrl] = useState<string>("");
  const [utrNumber, setUtrNumber] = useState("");
  const [cardNumber, setCardNumber] = useState("4111 2222 3333 4444");
  const [cardExpiry, setCardExpiry] = useState("12/28");
  const [cardCvv, setCardCvv] = useState("123");
  const [submitting, setSubmitting] = useState(false);

  // Financial calculations
  const rawSubtotalPaise = getTotalPaise();
  const isFreeShipping = rawSubtotalPaise >= brandConfig.shipping.freeShippingThresholdPaise || deliveryType === "pickup";
  const shippingFeePaise = isFreeShipping ? 0 : 6000;
  const codFeePaise = paymentMethod === "cod" ? brandConfig.payments.codFeePaise : 0;
  const discountPaise = appliedCoupon ? appliedCoupon.discountPaise : 0;
  const grandTotalPaise = Math.max(0, rawSubtotalPaise - discountPaise + shippingFeePaise + codFeePaise);

  // Load QR code for UPI
  useEffect(() => {
    if (step === 3 && (paymentMethod === "demo_upi" || paymentMethod === "manual_upi")) {
      fetch(`/api/payments/upi-qr?amountPaise=${grandTotalPaise}&ref=AH-${Date.now().toString().slice(-4)}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.qrDataUrl) setQrDataUrl(data.qrDataUrl);
        })
        .catch(console.error);
    }
  }, [step, paymentMethod, grandTotalPaise]);

  // If cart is empty, redirect to cart page
  useEffect(() => {
    if (items.length === 0) {
      router.push(`/${locale}/cart`);
    }
  }, [items, locale, router]);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !phone.trim() || !addressLine1.trim() || !pincode.trim()) {
      toast.error(locale === "bn" ? "সকল আবশ্যকীয় তথ্য পূরণ করুন।" : "Please fill in all required fields.");
      return;
    }
    setStep(2);
  };

  const handleStep2Submit = () => {
    setStep(3);
  };

  const handleFinalOrderPlacement = async () => {
    setSubmitting(true);
    try {
      const orderPayload = {
        customer_name: name.trim(),
        customer_email: email.trim() || `${phone.trim()}@customer.demo`,
        customer_phone: phone.trim(),
        shipping_address: {
          name: name.trim(),
          phone: phone.trim(),
          address_line1: addressLine1.trim(),
          address_line2: addressLine2.trim() || undefined,
          city: city.trim(),
          state: state.trim(),
          pincode: pincode.trim(),
        },
        items: items.map((i) => ({
          product_id: i.productId,
          variant_id: i.variantId,
          sku: i.sku,
          title_en: i.titleEn,
          title_bn: i.titleBn,
          size: i.size,
          color_en: i.colorEn,
          color_bn: i.colorBn,
          quantity: i.quantity,
          price_paise: i.pricePaise,
          is_custom_size: i.isCustomSize,
          custom_measurements: i.customMeasurements,
          image_url: i.imageUrl,
        })),
        payment_method: paymentMethod === "whatsapp" ? "cod" : paymentMethod,
        payment_status: paymentMethod === "cod" || paymentMethod === "whatsapp" ? "pending" : "paid",
        shipping_fee_paise: shippingFeePaise,
        cod_fee_paise: codFeePaise,
        coupon_code: appliedCoupon ? appliedCoupon.code : undefined,
        notes: notes.trim() || (utrNumber ? `Manual UPI UTR: ${utrNumber}` : undefined),
      };

      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        clearCart();

        if (paymentMethod === "whatsapp") {
          const ord = data.order;
          const msg =
            locale === "bn"
              ? `আসসালামু আলাইকুম, আমি আজাদ হায়াতে একটি অর্ডার সম্পন্ন করেছি!\n\n*অর্ডার নং:* ${ord.order_number}\n*নাম:* ${name}\n*ফোন:* ${phone}\n*ঠিকানা:* ${addressLine1}, ${city} - ${pincode}\n*সর্বমোট:* ${formatPrice(ord.total_paise, locale)}\n\nদয়া করে আমার অর্ডারটি কনফার্ম করুন।`
              : `Assalamu Alaikum, I placed order ${ord.order_number} on AZAD HAYA for ${formatPrice(ord.total_paise, locale)}. Please confirm my order!`;

          window.open(`https://wa.me/${brandConfig.contact.whatsapp}?text=${encodeURIComponent(msg)}`, "_blank");
        }

        toast.success(
          locale === "bn"
            ? `মাশাআল্লাহ! অর্ডার সফলভাবে গৃহীত হয়েছে: ${data.order.order_number}`
            : `Order successfully placed: ${data.order.order_number}`
        );

        router.push(`/${locale}/order-success/${data.order.order_number}`);
      } else {
        toast.error(data.error || "Failed to place order.");
      }
    } catch (err: any) {
      toast.error(err.message || "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-8 sm:py-12">
      {/* 3-Step Wizard Navigation Indicator */}
      <div className="flex items-center justify-between mb-8 pb-6 border-b border-[#E9DDC9]">
        {[
          { num: 1, bn: "১. ডেলিভারি ঠিকানা", en: "1. Address" },
          { num: 2, bn: "২. অর্ডার পর্যালোচনা", en: "2. Review" },
          { num: 3, bn: "৩. পেমেন্ট ও নিশ্চিতকরণ", en: "3. Payment" },
        ].map((s) => (
          <div key={s.num} className="flex items-center gap-2">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                step >= s.num
                  ? "bg-[#14372E] text-[#FBF7F0] ring-4 ring-[#E9DDC9]"
                  : "bg-white border-2 border-[#E9DDC9] text-[#1C1B18]/40"
              }`}
            >
              {s.num}
            </div>
            <span
              className={`text-xs sm:text-sm font-semibold hidden sm:inline ${
                step >= s.num ? "text-[#14372E]" : "text-[#1C1B18]/50"
              }`}
            >
              {locale === "bn" ? s.bn : s.en}
            </span>
          </div>
        ))}
      </div>

      {/* STEP 1: Customer Info & Address */}
      {step === 1 && (
        <form onSubmit={handleStep1Submit} className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-md animate-in fade-in">
          <div className="border-b border-[#E9DDC9] pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#14372E]">
              {locale === "bn" ? "গ্রাহকের তথ্য ও ডেলিভারি ঠিকানা" : "Customer & Shipping Information"}
            </h2>
            <p className="text-xs text-[#1C1B18]/70 mt-1">
              {locale === "bn" ? "পশ্চিমবঙ্গ জুড়ে হোম ডেলিভারি বা পার্ক সার্কাস শোরুম পিকআপ।" : "Courier delivery across India or store pickup at Park Circus, Kolkata."}
            </p>
          </div>

          {/* Delivery Method Choice */}
          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => setDeliveryType("courier")}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                deliveryType === "courier"
                  ? "border-[#14372E] bg-[#14372E]/5 shadow-xs"
                  : "border-[#E9DDC9] bg-[#FBF7F0] opacity-75"
              }`}
            >
              <Truck className="w-5 h-5 text-[#14372E] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#14372E]">
                  {locale === "bn" ? "হোম ডেলিভারি (কুরিয়ার)" : "Home Express Courier"}
                </h4>
                <p className="text-[11px] text-[#1C1B18]/60 mt-0.5">
                  {locale === "bn" ? "কলকাতা ১-২ দিন, অন্যান্য জেলা ২-৪ দিন" : "1–3 business days"}
                </p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setDeliveryType("pickup")}
              className={`p-3.5 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                deliveryType === "pickup"
                  ? "border-[#14372E] bg-[#14372E]/5 shadow-xs"
                  : "border-[#E9DDC9] bg-[#FBF7F0] opacity-75"
              }`}
            >
              <Store className="w-5 h-5 text-[#14372E] shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-bold text-[#14372E]">
                  {locale === "bn" ? "পার্ক সার্কাস শোরুম পিকআপ" : "Showroom Pickup (Free)"}
                </h4>
                <p className="text-[11px] text-[#1C1B18]/60 mt-0.5">
                  {locale === "bn" ? "সরাসরি শোরুমে এসে সংগ্রহ করুন" : "Pick up at Kolkata store"}
                </p>
              </div>
            </button>
          </div>

          {/* Personal details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-bold text-[#1C1B18] mb-1">
                {locale === "bn" ? "আপনার পূর্ণ নাম *" : "Full Name *"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={locale === "bn" ? "যেমন: ফাতেমা বেগম" : "e.g. Fatima Begum"}
                className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1B18] focus:outline-none focus:border-[#14372E]"
                required
              />
            </div>

            <div>
              <label className="block font-bold text-[#1C1B18] mb-1">
                {locale === "bn" ? "মোবাইল নম্বর (+৯১) *" : "Mobile Phone (+91) *"}
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="9000000000"
                className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1B18] focus:outline-none focus:border-[#14372E]"
                required
              />
            </div>
          </div>

          {/* Address lines */}
          <div className="space-y-3 text-xs">
            <div>
              <label className="block font-bold text-[#1C1B18] mb-1">
                {locale === "bn" ? "বাড়ির নম্বর, রাস্তা ও এলাকা *" : "Street Address / Landmark *"}
              </label>
              <input
                type="text"
                value={addressLine1}
                onChange={(e) => setAddressLine1(e.target.value)}
                placeholder={locale === "bn" ? "যেমন: ১২/এ, জাকারিয়া স্ট্রিট, পার্ক সার্কাস" : "Flat / House, Street, Landmark"}
                className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1B18] focus:outline-none focus:border-[#14372E]"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block font-bold text-[#1C1B18] mb-1">
                  {locale === "bn" ? "শহর *" : "City *"}
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1B18] focus:outline-none focus:border-[#14372E]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#1C1B18] mb-1">
                  {locale === "bn" ? "রাজ্য *" : "State *"}
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2.5 text-xs text-[#1C1B18] focus:outline-none focus:border-[#14372E]"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-[#1C1B18] mb-1">
                  {locale === "bn" ? "পিনকোড (৬ সংখ্যা) *" : "Pincode (6-digit) *"}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="700017"
                  className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-[#14372E] focus:outline-none focus:border-[#14372E]"
                  required
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-[#E9DDC9]">
            <button
              type="submit"
              className="px-8 py-3.5 rounded-xl bg-[#14372E] text-[#FBF7F0] font-bold text-xs sm:text-sm hover:bg-[#14372E]/90 transition-all shadow-md flex items-center gap-2"
            >
              <span>{locale === "bn" ? "পরবর্তী ধাপ: পর্যালোচনা" : "Next: Review Order"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      )}

      {/* STEP 2: Review Order & Tailoring Details */}
      {step === 2 && (
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-md animate-in fade-in">
          <div className="border-b border-[#E9DDC9] pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#14372E]">
              {locale === "bn" ? "অর্ডারের সামগ্রিক পর্যালোচনা" : "Review Order & Tailoring"}
            </h2>
            <p className="text-xs text-[#1C1B18]/70 mt-1">
              {locale === "bn" ? "ডেলিভারি ঠিকানা ও পণ্যগুলোর সাইজ পুনরায় মিলিয়ে নিন।" : "Please verify your items, sizes, and shipping destination."}
            </p>
          </div>

          {/* Delivery Address Snapshot */}
          <div className="p-4 rounded-xl bg-[#FBF7F0] border border-[#E9DDC9] text-xs space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-bold text-[#14372E]">
                {locale === "bn" ? "ডেলিভারি প্রাপক:" : "Recipient:"} {name} (+91 {phone})
              </span>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="text-[#A8834A] underline font-semibold"
              >
                {locale === "bn" ? "পরিবর্তন" : "Edit"}
              </button>
            </div>
            <p className="text-[#1C1B18]/70">
              {addressLine1}, {city}, {state} - {pincode}
            </p>
          </div>

          {/* Items review list */}
          <div className="space-y-3 divide-y divide-[#E9DDC9]">
            {items.map((item) => (
              <div key={item.id} className="pt-3 flex items-center justify-between text-xs sm:text-sm">
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-16 rounded-lg overflow-hidden bg-[#FBF7F0] shrink-0 border border-[#E9DDC9]">
                    <Image src={item.imageUrl} alt="" fill className="object-cover" unoptimized />
                  </div>
                  <div>
                    <h4 className="font-bold text-[#14372E]">
                      {locale === "bn" ? item.titleBn : item.titleEn}
                    </h4>
                    <p className="text-[11px] text-[#1C1B18]/60">
                      {locale === "bn" ? `সাইজ: ${item.size}` : `Size: ${item.size}`} • Qty: {item.quantity}
                    </p>
                    {item.isCustomSize && (
                      <span className="text-[10px] text-[#A8834A] font-bold">
                        {locale === "bn" ? "✓ কাস্টম দরজি সেলাই (+₹১৫০)" : "✓ Custom Tailoring (+₹150)"}
                      </span>
                    )}
                  </div>
                </div>

                <span className="font-bold text-[#14372E]">
                  {formatPrice((item.pricePaise + (item.isCustomSize ? 15000 : 0)) * item.quantity, locale)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing summary snapshot */}
          <div className="p-4 rounded-2xl bg-[#E9DDC9]/30 border border-[#E9DDC9] space-y-2 text-xs">
            <div className="flex justify-between">
              <span>{locale === "bn" ? "পণ্যের মূল্য:" : "Subtotal:"}</span>
              <span>{formatPrice(rawSubtotalPaise, locale)}</span>
            </div>
            <div className="flex justify-between">
              <span>{locale === "bn" ? "ডেলিভারি চার্জ:" : "Delivery:"}</span>
              <span>{shippingFeePaise === 0 ? (locale === "bn" ? "ফ্রি" : "FREE") : formatPrice(shippingFeePaise, locale)}</span>
            </div>
            <div className="flex justify-between text-base font-bold text-[#14372E] pt-2 border-t border-[#E9DDC9]">
              <span>{locale === "bn" ? "মোট প্রদেয়:" : "Total Payable:"}</span>
              <span>{formatPrice(grandTotalPaise, locale)}</span>
            </div>
          </div>

          <div className="flex justify-between items-center pt-4 border-t border-[#E9DDC9]">
            <button
              type="button"
              onClick={() => setStep(1)}
              className="px-4 py-2 text-xs font-bold text-[#1C1B18]/70 hover:text-[#1C1B18]"
            >
              &larr; {locale === "bn" ? "ঠিকানা পরিবর্তন" : "Back to Address"}
            </button>
            <button
              type="button"
              onClick={handleStep2Submit}
              className="px-8 py-3.5 rounded-xl bg-[#14372E] text-[#FBF7F0] font-bold text-xs sm:text-sm hover:bg-[#14372E]/90 transition-all shadow-md flex items-center gap-2"
            >
              <span>{locale === "bn" ? "পরবর্তী ধাপ: পেমেন্ট নির্বাচন" : "Next: Payment Method"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Payment Selection & Final Placement */}
      {step === 3 && (
        <div className="space-y-6 bg-white p-6 sm:p-8 rounded-3xl border border-[#E9DDC9] shadow-md animate-in fade-in">
          <div className="border-b border-[#E9DDC9] pb-4">
            <h2 className="font-serif text-xl sm:text-2xl font-bold text-[#14372E]">
              {locale === "bn" ? "পেমেন্ট মাধ্যম ও অর্ডার নিশ্চিতকরণ" : "Select Payment Method"}
            </h2>
            <p className="text-xs text-[#1C1B18]/70 mt-1">
              {locale === "bn" ? "ডেমো পে ইউপিআই, ম্যানুয়াল কিউআর, কার্ড অথবা ক্যাশ অন ডেলিভারি (COD)।" : "Select your preferred payment mode below."}
            </p>
          </div>

          {/* Payment Method Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {[
              { id: "demo_upi", bn: "ডেমো পে UPI", en: "Demo Pay UPI", icon: QrCode },
              { id: "manual_upi", bn: "ম্যানুয়াল UPI QR", en: "Manual UPI", icon: QrCode },
              { id: "card", bn: "কার্ড / নেটব্যাংকিং", en: "Card / Netbanking", icon: CreditCard },
              { id: "cod", bn: "ক্যাশ অন ডেলিভারি", en: "Cash on Delivery", icon: Banknote },
            ].map((m) => {
              const Icon = m.icon;
              return (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => setPaymentMethod(m.id as any)}
                  className={`p-3 rounded-2xl border text-center flex flex-col items-center justify-center gap-1.5 transition-all ${
                    paymentMethod === m.id
                      ? "border-[#14372E] bg-[#14372E] text-[#FBF7F0] shadow-sm"
                      : "border-[#E9DDC9] bg-[#FBF7F0] text-[#1C1B18] hover:border-[#14372E]"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="text-[11px] font-bold">{locale === "bn" ? m.bn : m.en}</span>
                </button>
              );
            })}
          </div>

          {/* Payment Body based on selection */}
          <div className="p-5 rounded-2xl bg-[#FBF7F0] border border-[#E9DDC9]">
            {/* DEMO PAY UPI QR */}
            {paymentMethod === "demo_upi" && (
              <div className="flex flex-col items-center text-center space-y-3">
                <span className="px-3 py-1 rounded-full bg-green-100 text-green-800 text-[11px] font-bold">
                  {locale === "bn" ? "ইনস্ট্যান্ট পেমেন্ট সিমুলেশন" : "Instant Simulated UPI Pay"}
                </span>
                <p className="text-xs text-[#1C1B18]/70 max-w-sm">
                  {locale === "bn"
                    ? "যেকোনো UPI অ্যাপ (GPay, PhonePe, Paytm) দ্বারা স্ক্যান করতে ডেমো কিউআর কোডটি প্রস্তুত করা হয়েছে।"
                    : "Scan with any UPI app to transfer to azadhaya@demo."}
                </p>

                {qrDataUrl && (
                  <div className="p-3 bg-white rounded-2xl border-2 border-[#14372E] shadow-md">
                    <img src={qrDataUrl} alt="UPI QR" className="w-52 h-52 object-contain" />
                  </div>
                )}

                <p className="font-mono text-xs font-bold text-[#14372E]">
                  VPA: {brandConfig.payments.demoUpiVpa}
                </p>
              </div>
            )}

            {/* MANUAL UPI QR */}
            {paymentMethod === "manual_upi" && (
              <div className="space-y-4">
                <div className="text-center space-y-1">
                  <h4 className="font-bold text-xs text-[#14372E]">
                    {locale === "bn" ? "ম্যানুয়াল ইউপিআই পেমেন্ট ও UTR নম্বর" : "Manual UPI Payment & UTR Submission"}
                  </h4>
                  <p className="text-[11px] text-[#1C1B18]/70">
                    {brandConfig.payments.demoUpiVpa} -এ টাকা পাঠিয়ে প্রাপ্ত ১২ সংখ্যার ইউটিআর (UTR) নম্বরটি নিচে লিখুন।
                  </p>
                </div>

                {qrDataUrl && (
                  <div className="flex justify-center">
                    <div className="p-2 bg-white rounded-xl border border-[#E9DDC9]">
                      <img src={qrDataUrl} alt="UPI QR" className="w-40 h-40 object-contain" />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block text-xs font-bold text-[#1C1B18] mb-1">
                    {locale === "bn" ? "১২ সংখ্যার UTR / ট্রানজ্যাকশন আইডি:" : "12-digit UTR / Ref Number:"}
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 408712345678"
                    className="w-full bg-white border border-[#E9DDC9] rounded-xl px-3 py-2 text-xs font-mono font-bold focus:outline-none focus:border-[#14372E]"
                  />
                </div>
              </div>
            )}

            {/* TEST CARD / NETBANKING */}
            {paymentMethod === "card" && (
              <div className="space-y-3 text-xs">
                <span className="inline-block px-2.5 py-0.5 rounded bg-blue-100 text-blue-800 text-[10px] font-bold">
                  DEMO TEST CARDS ACTIVE
                </span>
                <div>
                  <label className="block font-bold text-[#1C1B18] mb-1">Card Number:</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-white border border-[#E9DDC9] rounded-xl px-3 py-2 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-[#1C1B18] mb-1">Expiry:</label>
                    <input
                      type="text"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-white border border-[#E9DDC9] rounded-xl px-3 py-2 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-[#1C1B18] mb-1">CVV:</label>
                    <input
                      type="password"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value)}
                      className="w-full bg-white border border-[#E9DDC9] rounded-xl px-3 py-2 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* CASH ON DELIVERY */}
            {paymentMethod === "cod" && (
              <div className="text-center space-y-2 p-2">
                <Banknote className="w-8 h-8 text-[#14372E] mx-auto" />
                <h4 className="font-bold text-xs text-[#14372E]">
                  {locale === "bn" ? "ক্যাশ অন ডেলিভারি (COD)" : "Cash on Delivery"}
                </h4>
                <p className="text-[11px] text-[#1C1B18]/70 max-w-sm mx-auto">
                  {locale === "bn"
                    ? "পণ্য হাতে পেয়ে কুরিয়ার ডেলিভারিম্যানকে নগদ অর্থ পরিশোধ করুন। সিওডি হ্যান্ডলিং চার্জ ₹৪০ যুক্ত হয়েছে।"
                    : "Pay with cash upon package receipt. A standard ₹40 COD processing charge applies."}
                </p>
              </div>
            )}
          </div>

          {/* Grand Total Display */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[#14372E] text-[#FBF7F0]">
            <div>
              <span className="text-xs text-[#E9DDC9]/80 font-medium">
                {locale === "bn" ? "সর্বমোট পরিশোধযোগ্য মূল্য:" : "Grand Total to Pay:"}
              </span>
              <p className="text-2xl font-bold font-serif text-[#C5A059]">
                {formatPrice(grandTotalPaise, locale)}
              </p>
            </div>

            <button
              type="button"
              onClick={handleFinalOrderPlacement}
              disabled={submitting}
              className="px-6 py-3.5 rounded-xl bg-[#C5A059] hover:bg-[#A8834A] text-[#1C1B18] font-bold text-xs sm:text-sm shadow-md transition-all flex items-center gap-2"
            >
              <Check className="w-4 h-4" />
              <span>{submitting ? "প্রসেসিং..." : locale === "bn" ? "অর্ডার নিশ্চিত করুন" : "Confirm & Pay"}</span>
            </button>
          </div>

          <div className="flex justify-between items-center pt-2">
            <button
              type="button"
              onClick={() => setStep(2)}
              className="text-xs font-bold text-[#1C1B18]/70 hover:text-[#1C1B18]"
            >
              &larr; {locale === "bn" ? "অর্ডার পর্যালোচনায় ফিরুন" : "Back to Review"}
            </button>

            {/* WhatsApp Alternative */}
            <button
              type="button"
              onClick={() => {
                setPaymentMethod("whatsapp");
                setTimeout(handleFinalOrderPlacement, 50);
              }}
              className="text-xs font-bold text-[#25D366] hover:underline flex items-center gap-1"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-[#25D366]" />
              <span>{locale === "bn" ? "হোয়াটসঅ্যাপে সরাসরি ১-ক্লিক অর্ডার" : "1-Click WhatsApp Order"}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
