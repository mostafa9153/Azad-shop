"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/i18n";
import {
  LayoutDashboard,
  Package,
  Layers,
  ShoppingBag,
  Scissors,
  Settings,
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

export function AdminNav({ locale }: { locale: Locale }) {
  const pathname = usePathname();

  const links = [
    { href: `/${locale}/admin`, label: locale === "bn" ? "ড্যাশবোর্ড" : "Dashboard", icon: LayoutDashboard },
    { href: `/${locale}/admin/products`, label: locale === "bn" ? "পণ্য তালিকা" : "Products", icon: Package },
    { href: `/${locale}/admin/inventory`, label: locale === "bn" ? "ইনভেন্টরি ও লেজার" : "Inventory", icon: Layers },
    { href: `/${locale}/admin/orders`, label: locale === "bn" ? "অর্ডার সমূহ" : "Orders", icon: ShoppingBag },
    { href: `/${locale}/admin/tailoring`, label: locale === "bn" ? "দরজি কিউ" : "Tailoring Queue", icon: Scissors },
    { href: `/${locale}/admin/settings`, label: locale === "bn" ? "সাইট সেটিংস" : "Settings", icon: Settings },
  ];

  return (
    <aside className="w-full lg:w-64 bg-[#14372E] text-[#FBF7F0] p-4 lg:p-6 lg:min-h-screen shrink-0 border-r border-[#A8834A]/30">
      <div className="flex items-center justify-between lg:flex-col lg:items-start gap-4 pb-6 border-b border-white/10">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#C5A059] font-bold">
            {locale === "bn" ? "আজাদ হায়া অ্যাডমিন" : "AZAD HAYA Management"}
          </span>
          <h2 className="font-serif text-xl font-bold text-white">
            {locale === "bn" ? "ম্যানেজমেন্ট কনসোল" : "Control Panel"}
          </h2>
        </div>

        <Link
          href={`/${locale}`}
          target="_blank"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-semibold text-[#E9DDC9] transition-colors"
        >
          <span>{locale === "bn" ? "শপ ভিউ" : "Live Store"}</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <nav className="mt-6 flex flex-row lg:flex-col gap-1.5 overflow-x-auto lg:overflow-visible pb-2 lg:pb-0">
        {links.map((link) => {
          const Icon = link.icon;
          const isActive = pathname === link.href || (link.href !== `/${locale}/admin` && pathname?.startsWith(link.href));
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all shrink-0 ${
                isActive
                  ? "bg-[#C5A059] text-[#1C1B18] shadow-md font-bold"
                  : "text-[#E9DDC9]/80 hover:bg-white/10 hover:text-white"
              }`}
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{link.label}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
