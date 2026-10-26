"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Locale } from "@/lib/i18n";
import { useCartStore } from "@/lib/cart-store";
import { useWishlistStore } from "@/lib/wishlist-store";
import { Home, Compass, Heart, ShoppingBag, Search } from "lucide-react";
import { useState } from "react";
import { SearchOverlay } from "./search-overlay";

interface MobileNavProps {
  locale: Locale;
}

export function MobileNav({ locale }: MobileNavProps) {
  const pathname = usePathname();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const { openCart, getItemCount: getCartCount } = useCartStore();
  const { getItemCount: getWishlistCount } = useWishlistStore();

  const cartCount = getCartCount();
  const wishlistCount = getWishlistCount();

  const isHome = pathname === `/${locale}`;
  const isShop = pathname?.startsWith(`/${locale}/shop`);
  const isWishlist = pathname?.startsWith(`/${locale}/wishlist`);

  return (
    <>
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FBF7F0]/95 backdrop-blur-md border-t border-[#E9DDC9] shadow-lg pb-[env(safe-area-inset-bottom)]"
      >
        <div className="grid grid-cols-5 h-16 items-center px-1">
          {/* Home */}
          <Link
            href={`/${locale}`}
            className={`flex flex-col items-center justify-center min-h-[48px] text-[11px] font-medium transition-colors ${
              isHome ? "text-[#14372E] font-bold" : "text-[#1C1B18]/70 hover:text-[#14372E]"
            }`}
          >
            <Home className="w-5 h-5 mb-0.5" />
            <span>{locale === "bn" ? "হোম" : "Home"}</span>
          </Link>

          {/* Shop */}
          <Link
            href={`/${locale}/shop`}
            className={`flex flex-col items-center justify-center min-h-[48px] text-[11px] font-medium transition-colors ${
              isShop ? "text-[#14372E] font-bold" : "text-[#1C1B18]/70 hover:text-[#14372E]"
            }`}
          >
            <Compass className="w-5 h-5 mb-0.5" />
            <span>{locale === "bn" ? "শপ" : "Shop"}</span>
          </Link>

          {/* Search */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex flex-col items-center justify-center min-h-[48px] text-[11px] font-medium text-[#1C1B18]/70 hover:text-[#14372E] transition-colors"
            aria-label="Search"
          >
            <Search className="w-5 h-5 mb-0.5" />
            <span>{locale === "bn" ? "সার্চ" : "Search"}</span>
          </button>

          {/* Wishlist */}
          <Link
            href={`/${locale}/wishlist`}
            className={`flex flex-col items-center justify-center min-h-[48px] text-[11px] font-medium transition-colors relative ${
              isWishlist ? "text-[#14372E] font-bold" : "text-[#1C1B18]/70 hover:text-[#14372E]"
            }`}
          >
            <div className="relative">
              <Heart className="w-5 h-5 mb-0.5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#A8834A] text-[#FBF7F0] text-[9px] font-bold flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </div>
            <span>{locale === "bn" ? "পছন্দ" : "Saved"}</span>
          </Link>

          {/* Cart Bag */}
          <button
            onClick={openCart}
            className="flex flex-col items-center justify-center min-h-[48px] text-[11px] font-medium text-[#1C1B18]/70 hover:text-[#14372E] transition-colors relative"
            aria-label="Cart"
          >
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5 text-[#14372E]" />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-2 w-4 h-4 rounded-full bg-[#14372E] text-[#FBF7F0] text-[9px] font-bold flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </div>
            <span className="text-[#14372E] font-bold">{locale === "bn" ? "ব্যাগ" : "Bag"}</span>
          </button>
        </div>
      </nav>

      {/* Floating search for bottom nav */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} locale={locale} />
    </>
  );
}
