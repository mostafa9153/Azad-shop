"use client";

import * as React from "react";
import Image from "next/image";
import { Star, Minus, Plus, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatPrice, Locale } from "@/lib/i18n";

// SKELETON
export function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-[#E9DDC9]/40", className)}
      {...props}
    />
  );
}

// PRICE DISPLAY
export interface PriceDisplayProps {
  pricePaise: number;
  originalPricePaise?: number;
  locale?: Locale;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function PriceDisplay({
  pricePaise,
  originalPricePaise,
  locale = "bn",
  size = "md",
  className,
}: PriceDisplayProps) {
  const isDiscounted = originalPricePaise && originalPricePaise > pricePaise;
  const discountPercent = isDiscounted
    ? Math.round(((originalPricePaise - pricePaise) / originalPricePaise) * 100)
    : 0;

  return (
    <div className={cn("inline-flex items-baseline gap-2 flex-wrap", className)}>
      <span
        className={cn(
          "font-semibold text-[#14372E]",
          size === "sm" && "text-sm",
          size === "md" && "text-base",
          size === "lg" && "text-xl",
          size === "xl" && "text-2xl md:text-3xl"
        )}
      >
        {formatPrice(pricePaise, locale)}
      </span>
      {isDiscounted && (
        <>
          <span
            className={cn(
              "text-[#1C1B18]/50 line-through font-normal",
              size === "sm" && "text-xs",
              size === "md" && "text-sm",
              size === "lg" && "text-base",
              size === "xl" && "text-lg"
            )}
          >
            {formatPrice(originalPricePaise, locale)}
          </span>
          <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
            {discountPercent}% OFF
          </span>
        </>
      )}
    </div>
  );
}

// QUANTITY STEPPER
export interface QuantityStepperProps {
  value: number;
  min?: number;
  max?: number;
  onChange: (val: number) => void;
  className?: string;
  disabled?: boolean;
}

export function QuantityStepper({
  value,
  min = 1,
  max = 99,
  onChange,
  className,
  disabled = false,
}: QuantityStepperProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border border-[#E9DDC9] bg-[#FBF7F0] p-0.5",
        className
      )}
    >
      <button
        type="button"
        disabled={disabled || value <= min}
        onClick={() => onChange(Math.max(min, value - 1))}
        className="flex h-9 w-9 items-center justify-center rounded text-[#14372E] transition-colors hover:bg-[#E9DDC9]/50 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Decrease quantity"
      >
        <Minus className="h-3.5 w-3.5" />
      </button>
      <span className="w-10 text-center text-sm font-medium text-[#1C1B18] select-none">
        {value}
      </span>
      <button
        type="button"
        disabled={disabled || value >= max}
        onClick={() => onChange(Math.min(max, value + 1))}
        className="flex h-9 w-9 items-center justify-center rounded text-[#14372E] transition-colors hover:bg-[#E9DDC9]/50 disabled:opacity-30 disabled:hover:bg-transparent"
        aria-label="Increase quantity"
      >
        <Plus className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}

// STAR RATING
export interface RatingProps {
  value: number; // 0 to 5
  max?: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

export function Rating({ value, max = 5, count, size = "sm", className }: RatingProps) {
  return (
    <div className={cn("inline-flex items-center gap-1", className)}>
      <div className="flex items-center text-[#A8834A]">
        {Array.from({ length: max }).map((_, i) => (
          <Star
            key={i}
            className={cn(
              "fill-current",
              size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4",
              i < Math.floor(value) ? "text-[#A8834A]" : "text-[#E9DDC9]"
            )}
          />
        ))}
      </div>
      {count !== undefined && (
        <span className="text-xs text-[#1C1B18]/60 ml-1">({count})</span>
      )}
    </div>
  );
}

// SECTION HEADING
export interface SectionHeadingProps {
  title: string;
  subtitle?: string;
  tag?: string;
  centered?: boolean;
  className?: string;
}

export function SectionHeading({
  title,
  subtitle,
  tag,
  centered = true,
  className,
}: SectionHeadingProps) {
  return (
    <div
      className={cn(
        "mb-8 space-y-2",
        centered && "text-center mx-auto max-w-2xl",
        className
      )}
    >
      {tag && (
        <span className="inline-block text-xs font-semibold tracking-wider text-[#A8834A] uppercase bg-[#A8834A]/10 px-3 py-1 rounded-full mb-1">
          {tag}
        </span>
      )}
      <h2 className="text-2xl md:text-3xl lg:text-4xl font-serif text-[#14372E] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-sm md:text-base text-[#1C1B18]/70 leading-relaxed">
          {subtitle}
        </p>
      )}
      <div
        className={cn(
          "w-12 h-0.5 bg-[#A8834A]/40 mt-3",
          centered ? "mx-auto" : ""
        )}
      />
    </div>
  );
}

// ARCH IMAGE (Signature Mihrab Frame)
export interface ArchImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
}

export function ArchImage({
  src,
  alt,
  width = 600,
  height = 800,
  className,
  priority = false,
}: ArchImageProps) {
  return (
    <div
      className={cn(
        "relative overflow-hidden mihrab-arch bg-[#E9DDC9]/30 aspect-[3/4] shadow-sm transition-transform duration-500 hover:scale-[1.02]",
        className
      )}
    >
      <Image
        src={src}
        alt={alt}
        width={width}
        height={height}
        priority={priority}
        className="h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 pointer-events-none ring-1 ring-inset ring-[#14372E]/10 mihrab-arch" />
    </div>
  );
}

// IMAGE WITH FALLBACK
export function ImageWithFallback({
  src,
  alt,
  className,
  ...props
}: React.ComponentProps<typeof Image>) {
  const [error, setError] = React.useState(false);

  return (
    <Image
      src={error || !src ? "/placeholder-product.svg" : src}
      alt={alt}
      onError={() => setError(true)}
      className={className}
      {...props}
    />
  );
}

// BREADCRUMB
export interface BreadcrumbItem {
  label: string;
  href?: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center text-xs text-[#1C1B18]/60">
      {items.map((item, index) => {
        const isLast = index === items.length - 1;
        return (
          <React.Fragment key={index}>
            {index > 0 && <ChevronRight className="mx-2 h-3 w-3 shrink-0 text-[#1C1B18]/30" />}
            {isLast || !item.href ? (
              <span className="font-medium text-[#14372E] truncate max-w-[200px]">
                {item.label}
              </span>
            ) : (
              <a
                href={item.href}
                className="hover:text-[#14372E] transition-colors truncate max-w-[150px]"
              >
                {item.label}
              </a>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}
