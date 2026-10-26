"use client";

import { useState } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/types";
import { ZoomIn, ChevronLeft, ChevronRight } from "lucide-react";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
}

export function ProductGallery({ images, title }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const activeImage = images[activeIndex]?.image_url || "/placeholder-product.svg";

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[#FBF7F0] border-2 border-[#E9DDC9] shadow-md group">
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          unoptimized
        />

        {/* Zoom Action Button */}
        <button
          onClick={() => setIsZoomed(true)}
          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/80 backdrop-blur-xs text-[#1C1B18] shadow-md hover:bg-white hover:text-[#14372E] transition-all"
          aria-label="Enlarge image"
        >
          <ZoomIn className="w-5 h-5" />
        </button>

        {/* Prev / Next Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={() => setActiveIndex((prev) => (prev - 1 + images.length) % images.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-[#1C1B18] shadow-md transition-all opacity-0 group-hover:opacity-100"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveIndex((prev) => (prev + 1) % images.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/70 hover:bg-white text-[#1C1B18] shadow-md transition-all opacity-0 group-hover:opacity-100"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {images.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2">
          {images.map((img, idx) => (
            <button
              key={img.id || idx}
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-24 rounded-xl overflow-hidden border-2 shrink-0 transition-all ${
                activeIndex === idx
                  ? "border-[#14372E] ring-2 ring-[#14372E]/20"
                  : "border-[#E9DDC9] opacity-70 hover:opacity-100"
              }`}
            >
              <Image src={img.image_url} alt="" fill className="object-cover" unoptimized />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox Modal */}
      {isZoomed && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setIsZoomed(false)}
        >
          <div className="relative max-w-4xl max-h-[90vh] w-full aspect-[3/4]">
            <Image
              src={activeImage}
              alt={title}
              fill
              className="object-contain"
              unoptimized
            />
          </div>
          <button
            onClick={() => setIsZoomed(false)}
            className="absolute top-6 right-6 text-white text-sm font-bold bg-white/20 hover:bg-white/30 px-4 py-2 rounded-full"
          >
            ESC / Close
          </button>
        </div>
      )}
    </div>
  );
}
