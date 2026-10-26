"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";
import { Review } from "@/lib/types";
import { Star, CheckCircle, MessageSquarePlus, Send } from "lucide-react";
import { toast } from "sonner";

interface ProductReviewsProps {
  productId: string;
  initialReviews: Review[];
  locale: Locale;
}

export function ProductReviews({ productId, initialReviews, locale }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [name, setName] = useState("");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;

    setSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product_id: productId,
          customer_name: name.trim(),
          rating,
          comment: comment.trim(),
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setReviews([data.review, ...reviews]);
        setName("");
        setComment("");
        setIsFormOpen(false);
        toast.success(
          locale === "bn"
            ? "আপনার আন্তরিক মতামতের জন্য শুকরিয়া! রিভিউটি প্রকাশিত হয়েছে।"
            : "Thank you for your review! It has been published."
        );
      }
    } catch (err) {
      console.error(err);
      toast.error(locale === "bn" ? "রিভিউ জমা দিতে সমস্যা হয়েছে।" : "Failed to submit review.");
    } finally {
      setSubmitting(false);
    }
  };

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
      : "5.0";

  return (
    <section className="pt-12 border-t border-[#E9DDC9]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h3 className="font-serif text-2xl font-bold text-[#14372E]">
            {locale === "bn" ? "গ্রাহক রিভিউ ও অভিজ্ঞতা" : "Customer Reviews & Ratings"}
          </h3>
          <div className="flex items-center gap-2 mt-1">
            <div className="flex text-[#C5A059]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
            </div>
            <span className="text-xs font-bold text-[#14372E]">
              {avgRating} / 5.0 ({reviews.length} {locale === "bn" ? "টি রিভিউ" : "reviews"})
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsFormOpen(!isFormOpen)}
          className="px-4 py-2.5 rounded-xl border border-[#14372E] text-[#14372E] hover:bg-[#14372E] hover:text-[#FBF7F0] font-bold text-xs transition-colors flex items-center gap-2 w-fit"
        >
          <MessageSquarePlus className="w-4 h-4" />
          <span>{locale === "bn" ? "আপনার মতামত লিখুন" : "Write a Review"}</span>
        </button>
      </div>

      {/* Review Submission Form */}
      {isFormOpen && (
        <form onSubmit={handleSubmit} className="bg-white p-5 rounded-2xl border border-[#E9DDC9] shadow-xs mb-8 space-y-4 animate-in fade-in duration-300">
          <h4 className="font-bold text-sm text-[#14372E]">
            {locale === "bn" ? "আজাদ হায়া পোশাকে আপনার অভিজ্ঞতা জানান" : "Share your experience with AZAD HAYA"}
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
                {locale === "bn" ? "আপনার নাম ও শহর:" : "Your Name & City:"}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={locale === "bn" ? "যেমন: আয়েশা সিদ্দিকী (কলকাতা)" : "e.g. Ayesha Siddiqui (Kolkata)"}
                className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-lg px-3 py-2 text-xs text-[#1C1B18] focus:outline-none focus:border-[#14372E]"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
                {locale === "bn" ? "রেটিং নির্বাচন করুন:" : "Rating:"}
              </label>
              <div className="flex gap-2 items-center pt-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    className="p-1 hover:scale-110 transition-transform"
                  >
                    <Star
                      className={`w-5 h-5 ${
                        star <= rating ? "text-[#C5A059] fill-current" : "text-[#E9DDC9]"
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#1C1B18] mb-1">
              {locale === "bn" ? "আপনার মন্তব্য (কাপড়ের মান, সেলাই ও পরিধানের অভিজ্ঞতা):" : "Your Review:"}
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={locale === "bn" ? "কাপড়ের আরাম ও ফিটিং কেমন লেগেছে লিখুন..." : "Describe the drape, fit, and modest coverage..."}
              rows={3}
              className="w-full bg-[#FBF7F0] border border-[#E9DDC9] rounded-lg p-2.5 text-xs text-[#1C1B18] focus:outline-none focus:border-[#14372E]"
              required
            />
          </div>

          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={() => setIsFormOpen(false)}
              className="px-3 py-2 rounded-lg text-xs font-medium text-[#1C1B18]/70 hover:bg-gray-100"
            >
              {locale === "bn" ? "বাতিল" : "Cancel"}
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2 rounded-lg bg-[#14372E] text-[#FBF7F0] font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{locale === "bn" ? "জমা দিন" : "Submit Review"}</span>
            </button>
          </div>
        </form>
      )}

      {/* Review List */}
      <div className="space-y-4">
        {reviews.length === 0 ? (
          <p className="text-xs text-[#1C1B18]/60 italic">
            {locale === "bn"
              ? "এই পোশাকে এখনও কোনো রিভিউ জমা পড়েনি। আপনিই প্রথম রিভিউ দিন!"
              : "No customer reviews yet. Be the first to share your thoughts!"}
          </p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className="bg-white p-5 rounded-2xl border border-[#E9DDC9] shadow-2xs space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <h5 className="font-bold text-xs text-[#14372E]">{r.customer_name}</h5>
                  {r.is_verified_purchase && (
                    <span className="flex items-center gap-1 text-[10px] text-green-700 bg-green-50 px-2 py-0.5 rounded-full font-semibold border border-green-200">
                      <CheckCircle className="w-3 h-3" />
                      {locale === "bn" ? "ভেরিফায়েড ক্রেতা" : "Verified Purchase"}
                    </span>
                  )}
                </div>
                <div className="flex text-[#C5A059]">
                  {[...Array(r.rating)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
              </div>
              <p className="text-xs text-[#1C1B18]/80 leading-relaxed">&ldquo;{r.comment}&rdquo;</p>
            </div>
          ))
        )}
      </div>
    </section>
  );
}
