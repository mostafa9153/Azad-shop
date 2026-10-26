"use client";

import { useState } from "react";
import { Locale } from "@/lib/i18n";
import { TailoringJob, TailoringStatus } from "@/lib/types";
import {
  Scissors,
  CheckCircle2,
  Clock,
  User,
  Phone,
  Ruler,
  AlertCircle,
  Calendar,
  Sparkles,
} from "lucide-react";

interface TailoringManagerProps {
  locale: Locale;
  initialJobs: TailoringJob[];
}

const STAGES: Array<{ id: TailoringStatus; label_bn: string; label_en: string; step: number }> = [
  { id: "queued", label_bn: "কিউতে অপেক্ষমান", label_en: "Queued", step: 1 },
  { id: "measuring", label_bn: "মাপ যাচাই", label_en: "Measuring", step: 2 },
  { id: "cutting", label_bn: "কাপড় কাটিং", label_en: "Cutting", step: 3 },
  { id: "stitching", label_bn: "সেলাই চলছে", label_en: "Stitching", step: 4 },
  { id: "qc", label_bn: "কোয়ালিটি চেক (QC)", label_en: "Quality Check", step: 5 },
  { id: "completed", label_bn: "সম্পন্ন", label_en: "Completed", step: 6 },
];

const MASTER_TAILORS = ["ওস্তাদ রফিক (Zakaria St)", "ওস্তাদ করিম (Park Circus)", "ওস্তাদ ফারুক (Metiabruz)"];

export function TailoringManager({ locale, initialJobs }: TailoringManagerProps) {
  const [jobs, setJobs] = useState<TailoringJob[]>(initialJobs);
  const [filterStage, setFilterStage] = useState<string>("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const filteredJobs = jobs.filter((j) => {
    if (filterStage !== "all" && j.status !== filterStage) return false;
    return true;
  });

  const handleUpdateStatus = async (
    jobId: string,
    newStatus: TailoringStatus,
    tailorName?: string
  ) => {
    setUpdatingId(jobId);
    try {
      const res = await fetch(`/api/admin/tailoring/${jobId}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus, tailor: tailorName }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setJobs((prev) =>
        prev.map((j) =>
          j.id === jobId ? { ...j, status: newStatus, assigned_tailor: tailorName || j.assigned_tailor } : j
        )
      );
    } catch (err: any) {
      alert(err.message || "Tailoring status update failed");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-[#14372E] text-[#FBF7F0] p-6 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-xl bg-white/10 text-[#C5A059]">
            <Scissors className="w-6 h-6" />
          </div>
          <div>
            <h2 className="font-serif text-lg font-bold">
              {locale === "bn" ? "কলকাতা কারিগর ও দরজি ওয়ার্কফ্লো" : "Kolkata Master Atelier Tailoring"}
            </h2>
            <p className="text-xs text-[#E9DDC9]/70 mt-0.5">
              {locale === "bn"
                ? "গ্রাহকদের কাস্টম মাপ অনুযায়ী ৪ দিনের বিশেষ কারিগরি সেবা ও রিয়েলটাইম কিউ ট্র্যাকিং।"
                : "4-Day bespoke tailoring turnaround with artisan assignment and measurement audit."}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="text-center">
            <span className="text-lg font-bold text-[#C5A059] block">
              {jobs.filter((j) => j.status !== "completed").length}
            </span>
            <span className="text-[10px] text-[#E9DDC9]/70">
              {locale === "bn" ? "চলমান কাজ" : "Active Jobs"}
            </span>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <span className="text-lg font-bold text-emerald-400 block">
              {jobs.filter((j) => j.status === "completed").length}
            </span>
            <span className="text-[10px] text-[#E9DDC9]/70">
              {locale === "bn" ? "সম্পন্ন" : "Finished"}
            </span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-1.5 overflow-x-auto pb-2">
        <button
          onClick={() => setFilterStage("all")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
            filterStage === "all"
              ? "bg-[#14372E] text-white font-bold"
              : "bg-white border border-[#E9DDC9] text-[#1C1B18]"
          }`}
        >
          {locale === "bn" ? "সব কাজ" : "All Jobs"} ({jobs.length})
        </button>
        {STAGES.map((st) => (
          <button
            key={st.id}
            onClick={() => setFilterStage(st.id)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
              filterStage === st.id
                ? "bg-[#14372E] text-white font-bold"
                : "bg-white border border-[#E9DDC9] text-[#1C1B18]"
            }`}
          >
            {locale === "bn" ? st.label_bn : st.label_en} (
            {jobs.filter((j) => j.status === st.id).length})
          </button>
        ))}
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white p-12 rounded-2xl border border-[#E9DDC9] text-center text-xs text-[#1C1B18]/60">
          <Scissors className="w-8 h-8 text-[#A8834A] mx-auto mb-2 opacity-50" />
          <p>{locale === "bn" ? "এই ধাপে কোন কাস্টম দরজি কাজ নেই।" : "No jobs in this tailoring stage."}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredJobs.map((job) => {
            const currentStageObj = STAGES.find((s) => s.id === job.status) || STAGES[0];

            return (
              <div
                key={job.id}
                className="bg-white rounded-2xl border border-[#E9DDC9] p-5 shadow-2xs space-y-4 hover:border-[#14372E]/40 transition-colors"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-[#E9DDC9] pb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-[#A8834A]">
                      {job.order_number}
                    </span>
                    <h3 className="font-serif font-bold text-[#14372E] text-sm mt-0.5">
                      {locale === "bn" ? job.product_title_bn : job.product_title_en}
                    </h3>
                  </div>

                  <span
                    className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      job.status === "completed"
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {locale === "bn" ? currentStageObj.label_bn : currentStageObj.label_en} (ধাপ {currentStageObj.step}/6)
                  </span>
                </div>

                {/* Customer & Due Date */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-[#1C1B18]/60 text-[10px] block">
                      {locale === "bn" ? "ক্রেতার তথ্য" : "Customer"}
                    </span>
                    <p className="font-bold text-[#1C1B18]">{job.customer_name}</p>
                    <p className="font-mono text-[11px] text-[#1C1B18]/70">{job.customer_phone}</p>
                  </div>

                  <div>
                    <span className="text-[#1C1B18]/60 text-[10px] block">
                      {locale === "bn" ? "ডেলিভারি লক্ষ্য তারিখ" : "Target Due Date"}
                    </span>
                    <p className="font-bold text-[#14372E] flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-[#A8834A]" />
                      <span>
                        {new Date(job.due_date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                    </p>
                  </div>
                </div>

                {/* Measurements Box */}
                <div className="p-3.5 rounded-xl bg-[#FBF7F0] border border-[#E9DDC9] space-y-2">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[#14372E]">
                    <Ruler className="w-3.5 h-3.5 text-[#C5A059]" />
                    <span>{locale === "bn" ? "কাস্টম মাপ (ইঞ্চি):" : "Custom Measurements (Inches):"}</span>
                  </div>

                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 text-[11px] font-mono">
                    <div className="bg-white p-1.5 rounded-lg border border-[#E9DDC9] text-center">
                      <span className="text-[9px] text-[#1C1B18]/60 block">লম্বা / Length</span>
                      <span className="font-bold text-[#14372E]">{job.measurements.length_inches || "—"}&quot;</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-[#E9DDC9] text-center">
                      <span className="text-[9px] text-[#1C1B18]/60 block">বুক / Chest</span>
                      <span className="font-bold text-[#14372E]">{job.measurements.chest_inches || "—"}&quot;</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-[#E9DDC9] text-center">
                      <span className="text-[9px] text-[#1C1B18]/60 block">কোমর / Waist</span>
                      <span className="font-bold text-[#14372E]">{job.measurements.waist_inches || "—"}&quot;</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-[#E9DDC9] text-center">
                      <span className="text-[9px] text-[#1C1B18]/60 block">হিপ / Hips</span>
                      <span className="font-bold text-[#14372E]">{job.measurements.hips_inches || "—"}&quot;</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-[#E9DDC9] text-center">
                      <span className="text-[9px] text-[#1C1B18]/60 block">হাতা / Sleeve</span>
                      <span className="font-bold text-[#14372E]">{job.measurements.sleeve_inches || "—"}&quot;</span>
                    </div>
                    <div className="bg-white p-1.5 rounded-lg border border-[#E9DDC9] text-center">
                      <span className="text-[9px] text-[#1C1B18]/60 block">কাঁধ / Shoulder</span>
                      <span className="font-bold text-[#14372E]">{job.measurements.shoulder_inches || "—"}&quot;</span>
                    </div>
                  </div>

                  {(job.measurements.special_notes || job.notes) && (
                    <p className="text-[11px] text-[#1C1B18]/80 italic pt-1 border-t border-[#E9DDC9]/50">
                      &quot;{job.measurements.special_notes || job.notes}&quot;
                    </p>
                  )}
                </div>

                {/* Assigned Tailor & Workflow Update */}
                <div className="space-y-2 pt-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-[#1C1B18]/70 font-medium">
                      {locale === "bn" ? "দায়িত্বপ্রাপ্ত ওস্তাদ:" : "Assigned Master Tailor:"}
                    </span>
                    <select
                      value={job.assigned_tailor || MASTER_TAILORS[0]}
                      onChange={(e) => handleUpdateStatus(job.id, job.status, e.target.value)}
                      className="bg-white border border-[#E9DDC9] rounded-lg px-2 py-1 text-xs font-semibold text-[#14372E]"
                    >
                      {MASTER_TAILORS.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={job.status}
                      disabled={updatingId === job.id}
                      onChange={(e) =>
                        handleUpdateStatus(job.id, e.target.value as TailoringStatus, job.assigned_tailor)
                      }
                      className="flex-1 bg-[#14372E] text-white border border-[#14372E] rounded-xl px-3 py-2 text-xs font-bold focus:outline-none"
                    >
                      {STAGES.map((st) => (
                        <option key={st.id} value={st.id}>
                          {st.step}. {locale === "bn" ? st.label_bn : st.label_en}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
