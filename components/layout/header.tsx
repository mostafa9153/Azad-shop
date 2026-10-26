"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/i18n";
import { brandConfig } from "@/config/brand.config";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { SearchOverlay } from "./search-overlay";
import { CartDrawer } from "./cart-drawer";
import {
  Search,
  ShoppingBag,
  Heart,
  Menu,
  X,
  Globe,
  Sparkles,
} from "lucide-react";

interface HeaderProps {
  locale: Locale;
}

export function Header({ locale }: HeaderProps) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const { openCart, getItemCount: getCartCount } = useCartStore();
  const { getItemCount: getWishlistCount } = useWishlistStore();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  // Navigation Links
  const navLinks = [
    { href: `/${locale}/shop?category=burkha`, labelEn: "Burkha", labelBn: "বোরকা" },
    { href: `/${locale}/shop?category=abaya`, labelEn: "Abaya", labelBn: "আবায়া" },
    { href: `/${locale}/shop?category=jilbab`, labelEn: "Jilbab", labelBn: "জিলবাব" },
    { href: `/${locale}/shop?category=hijab`, labelEn: "Hijab", labelBn: "হিজাব" },
    { href: `/${locale}/shop?category=niqab`, labelEn: "Niqab", labelBn: "নিকাব" },
    { href: `/${locale}/shop?category=panjabi`, labelEn: "Panjabi", labelBn: "পাঞ্জাবি" },
    { href: `/${locale}/shop?category=kids`, labelEn: "Kids", labelBn: "শিশু" },
    { href: `/${locale}/shop?collection=eid-collection`, labelEn: "Eid '26", labelBn: "ঈদ অফার", highlight: true },
  ];

  // Helper to switch locale
  const getSwitchedLocalePath = (targetLocale: Locale) => {
    if (!pathname) return `/${targetLocale}`;
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length === 0) return `/${targetLocale}`;
    segments[0] = targetLocale;
    return `/${segments.join("/")}`;
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-[#FBF7F0]/95 backdrop-blur-md border-b border-[#E9DDC9] shadow-xs">
        {/* Main Grid: 1fr auto 1fr ensures absolute center alignment without overlapping */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-18 sm:h-20 grid grid-cols-[1fr_auto_1fr] items-center">
          {/* LEFT: Mobile Menu Button & Desktop Nav */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 -ml-2 text-[#1C1B18] hover:text-[#14372E] rounded-md transition-colors"
              aria-label="Open Navigation Menu"
            >
              <Menu className="w-6 h-6" />
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-5 xl:gap-6 text-sm font-medium">
              {navLinks.slice(0, 5).map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className="text-[#1C1B18] hover:text-[#14372E] transition-colors relative py-1 hover:after:w-full after:w-0 after:h-0.5 after:bg-[#14372E] after:absolute after:bottom-0 after:left-0 after:transition-all"
                >
                  {locale === "bn" ? link.labelBn : link.labelEn}
                </Link>
              ))}
            </nav>
          </div>

          {/* CENTER: Mihrab Arch Brand Identity Logo */}
          <div className="flex flex-col items-center justify-center text-center px-2">
            <Link href={`/${locale}`} className="group flex flex-col items-center">
              {/* Islamic Decorative Mihrab Crown Arch SVG */}
              <svg
                width="34"
                height="14"
                viewBox="0 0 34 14"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="text-[#A8834A] group-hover:scale-110 transition-transform mb-0.5"
              >
                <path
                  d="M1 13C1 7 8 1 17 1C26 1 33 7 33 13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <circle cx="17" cy="1" r="1.5" fill="currentColor" />
              </svg>

              <span className="font-serif text-2xl sm:text-3xl tracking-wide font-bold text-[#14372E] group-hover:text-[#A8834A] transition-colors leading-none">
                {locale === "bn" ? brandConfig.name.bn : brandConfig.name.en}
              </span>

              <span className="text-[10px] tracking-widest uppercase font-medium text-[#A8834A] mt-1 hidden sm:block">
                {locale === "bn" ? brandConfig.tagline.bn : brandConfig.tagline.en}
              </span>
            </Link>
          </div>

          {/* RIGHT: Actions (Search, Lang Switch, Wishlist, Cart) */}
          <div className="flex items-center justify-end gap-2 sm:gap-4">
            {/* Desktop More Nav */}
            <nav className="hidden lg:flex items-center gap-4 text-sm font-medium mr-2">
              {navLinks.slice(5).map((link, idx) => (
                <Link
                  key={idx}
                  href={link.href}
                  className={
                    link.highlight
                      ? "px-2.5 py-1 rounded bg-[#A8834A]/15 text-[#805F2B] font-semibold border border-[#A8834A]/40 hover:bg-[#A8834A] hover:text-[#FBF7F0] transition-all flex items-center gap-1 text-xs"
                      : "text-[#1C1B18] hover:text-[#14372E] transition-colors"
                  }
                >
                  {link.highlight && <Sparkles className="w-3 h-3 text-[#C5A059]" />}
                  {locale === "bn" ? link.labelBn : link.labelEn}
                </Link>
              ))}
            </nav>

            {/* Language Switcher */}
            <Link
              href={getSwitchedLocalePath(locale === "bn" ? "en" : "bn")}
              className="flex items-center gap-1 px-2 py-1 rounded border border-[#E9DDC9] text-xs font-semibold text-[#1C1B18] hover:bg-[#E9DDC9]/50 transition-colors"
              title={locale === "bn" ? "Switch to English" : "বাংলায় দেখুন"}
            >
              <Globe className="w-3.5 h-3.5 text-[#A8834A]" />
              <span>{locale === "bn" ? "EN" : "বাংলা"}</span>
            </Link>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-[#1C1B18] hover:text-[#14372E] hover:bg-[#E9DDC9]/40 rounded-full transition-colors"
              aria-label="Search Catalog"
            >
              <Search className="w-5 h-5" />
            </button>

            {/* Wishlist Icon */}
            <Link
              href={`/${locale}/wishlist`}
              className="p-2 text-[#1C1B18] hover:text-[#14372E] hover:bg-[#E9DDC9]/40 rounded-full transition-colors relative"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#A8834A] text-[#FBF7F0] text-[10px] font-bold rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart Drawer Trigger */}
            <button
              onClick={openCart}
              className="p-2 text-[#FBF7F0] bg-[#14372E] hover:bg-[#14372E]/90 rounded-full transition-all relative shadow-sm"
              aria-label="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#A8834A] text-[#FBF7F0] text-xs font-bold rounded-full flex items-center justify-center shadow-xs border-2 border-[#FBF7F0]">
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-[#FBF7F0] p-6 shadow-2xl flex flex-col justify-between overflow-y-auto animate-in slide-in-from-left duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-[#E9DDC9]">
                <span className="font-serif text-xl font-bold text-[#14372E]">
                  {locale === "bn" ? brandConfig.name.bn : brandConfig.name.en}
                </span>
                <button
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-2 text-[#1C1B18]/60 hover:text-[#1C1B18]"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Navigation list */}
              <div className="py-4 space-y-1">
                <Link
                  href={`/${locale}`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#1C1B18] hover:bg-[#E9DDC9]/50"
                >
                  {locale === "bn" ? "হোম পেজ" : "Home"}
                </Link>
                <Link
                  href={`/${locale}/shop`}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block px-3 py-2.5 rounded-lg text-sm font-semibold text-[#14372E] hover:bg-[#E9DDC9]/50"
                >
                  {locale === "bn" ? "সম্পূর্ণ শপ কালেকশন" : "All Products"}
                </Link>
                <div className="my-2 border-t border-[#E9DDC9]" />

                {navLinks.map((link, idx) => (
                  <Link
                    key={idx}
                    href={link.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium text-[#1C1B18] hover:bg-[#E9DDC9]/50"
                  >
                    <span>{locale === "bn" ? link.labelBn : link.labelEn}</span>
                    {link.highlight && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#A8834A] text-[#FBF7F0]">
                        {locale === "bn" ? "ঈদ অফার" : "EID"}
                      </span>
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Mobile Drawer Bottom Info */}
            <div className="pt-4 border-t border-[#E9DDC9] text-xs text-[#1C1B18]/70 space-y-2">
              <p>
                <strong>{locale === "bn" ? "শোরুম:" : "Store:"}</strong> {brandConfig.shop.city},{" "}
                {brandConfig.shop.state}
              </p>
              <p>
                <strong>{locale === "bn" ? "হেল্পলাইন:" : "Helpline:"}</strong>{" "}
                <a href={`tel:${brandConfig.contact.phone}`} className="text-[#14372E] font-semibold underline">
                  {brandConfig.contact.phone}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Global Overlays */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} locale={locale} />
      <CartDrawer locale={locale} />
    </>
  );
}
