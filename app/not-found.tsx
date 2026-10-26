import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-[#FBF7F0] text-[#1C1B18] text-center">
      <h1 className="text-4xl font-bold font-serif mb-4 text-[#14372E]">৪০৪ — পৃষ্ঠাটি পাওয়া যায়নি</h1>
      <p className="text-gray-600 mb-8 max-w-md font-sans">
        দুঃখিত, আপনি যে পৃষ্ঠাটি খুঁজছেন তা বিদ্যমান নেই বা সরানো হয়েছে।
      </p>
      <Link
        href="/bn"
        className="px-6 py-3 rounded-lg bg-[#14372E] text-[#FBF7F0] font-medium hover:bg-[#14372E]/90 transition-colors"
      >
        হোমপেজে ফিরে যান (Return Home)
      </Link>
    </div>
  );
}
