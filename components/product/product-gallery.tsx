"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Image from "next/image";
import { ProductImage } from "@/lib/types";
import { Locale } from "@/lib/i18n";
import { ZoomIn, ZoomOut, ChevronLeft, ChevronRight, X, Maximize2 } from "lucide-react";

interface ProductGalleryProps {
  images: ProductImage[];
  title: string;
  locale?: Locale;
}

export function ProductGallery({ images, title, locale = "bn" }: ProductGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isHoverZooming, setIsHoverZooming] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const [lightboxZoom, setLightboxZoom] = useState(1);
  const [lightboxPan, setLightboxPan] = useState({ x: 50, y: 50 });

  const stageRef = useRef<HTMLDivElement>(null);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lightboxTouchStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastTapRef = useRef<number>(0);

  const safeImages =
    images && images.length > 0
      ? images
      : [{ id: "placeholder", product_id: "", image_url: "/placeholder-product.svg", display_order: 0, is_primary: true }];

  // Reset indices and zoom if image list changes
  useEffect(() => {
    setActiveIndex(0);
    setLightboxZoom(1);
    setLightboxPan({ x: 50, y: 50 });
  }, [images]);

  // Lock body scroll when Lightbox is active
  useEffect(() => {
    if (!isLightboxOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isLightboxOpen]);

  const currentIndex = activeIndex >= 0 && activeIndex < safeImages.length ? activeIndex : 0;
  const activeImage = safeImages[currentIndex]?.image_url || "/placeholder-product.svg";

  // Navigation handlers
  const handleNext = useCallback(() => {
    setActiveIndex((prev) => (prev + 1) % safeImages.length);
    setLightboxZoom(1);
    setLightboxPan({ x: 50, y: 50 });
  }, [safeImages.length]);

  const handlePrev = useCallback(() => {
    setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
    setLightboxZoom(1);
    setLightboxPan({ x: 50, y: 50 });
  }, [safeImages.length]);

  // Stage mouse movement for lens zoom
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageRef.current) return;
    const rect = stageRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  };

  const handleMouseEnter = () => setIsHoverZooming(true);
  const handleMouseLeave = () => {
    setIsHoverZooming(false);
    setZoomOrigin({ x: 50, y: 50 });
  };

  // Stage touch swipe handlers
  const handleStageTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleStageTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!touchStartRef.current) return;
    const deltaX = e.changedTouches[0].clientX - touchStartRef.current.x;
    const deltaY = e.changedTouches[0].clientY - touchStartRef.current.y;
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
      if (deltaX < 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }
    touchStartRef.current = null;
  };

  // Lightbox keyboard navigation & escape listener
  useEffect(() => {
    if (!isLightboxOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsLightboxOpen(false);
        setLightboxZoom(1);
      } else if (e.key === "ArrowRight") {
        handleNext();
      } else if (e.key === "ArrowLeft") {
        handlePrev();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isLightboxOpen, handleNext, handlePrev]);

  // Lightbox mouse pan for zoomed-in mode
  const handleLightboxMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (lightboxZoom <= 1) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setLightboxPan({ x, y });
  };

  // Lightbox touch pan & swipe
  const handleLightboxTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (e.touches.length === 1) {
      lightboxTouchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
  };

  const handleLightboxTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (lightboxZoom <= 1) return;
    if (e.touches.length === 1) {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((e.touches[0].clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((e.touches[0].clientY - rect.top) / rect.height) * 100));
      setLightboxPan({ x, y });
    }
  };

  const handleLightboxTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    // Check for double-tap zoom
    const now = Date.now();
    if (now - lastTapRef.current < 300) {
      toggleLightboxZoom();
      lastTapRef.current = 0;
      return;
    }
    lastTapRef.current = now;

    // Check for swipe when not zoomed
    if (lightboxZoom === 1 && lightboxTouchStartRef.current) {
      const deltaX = e.changedTouches[0].clientX - lightboxTouchStartRef.current.x;
      const deltaY = e.changedTouches[0].clientY - lightboxTouchStartRef.current.y;
      if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX < 0) {
          handleNext();
        } else {
          handlePrev();
        }
      }
    }
    lightboxTouchStartRef.current = null;
  };

  const toggleLightboxZoom = () => {
    setLightboxZoom((prev) => (prev > 1 ? 1 : 2.5));
  };

  return (
    <div className="space-y-4 select-none">
      {/* Main Image Stage */}
      <div
        ref={stageRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={handleStageTouchStart}
        onTouchEnd={handleStageTouchEnd}
        onClick={() => {
          setIsLightboxOpen(true);
          setLightboxZoom(1);
        }}
        className="relative aspect-[3/4] w-full rounded-3xl overflow-hidden bg-[#FBF7F0] border-2 border-[#E9DDC9] shadow-md group cursor-crosshair"
      >
        <Image
          src={activeImage}
          alt={title}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 50vw"
          className="object-cover transition-transform duration-200 pointer-events-none"
          style={{
            transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
            transform: isHoverZooming ? "scale(2.2)" : "scale(1)",
          }}
          unoptimized
        />

        {/* Hover Hint Overlay (disappears when hovering) */}
        {!isHoverZooming && (
          <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-xs text-[#FBF7F0] text-[11px] font-medium pointer-events-none transition-opacity">
            {locale === "bn" ? "জুম করতে মাউস ঘুরান" : "Hover or tap to zoom details"}
          </div>
        )}

        {/* Image Counter Badge */}
        {safeImages.length > 1 && (
          <div className="absolute top-4 right-4 px-2.5 py-1 rounded-full bg-white/80 backdrop-blur-xs text-[#14372E] text-xs font-bold shadow-xs pointer-events-none">
            {currentIndex + 1} / {safeImages.length}
          </div>
        )}

        {/* Lightbox Trigger Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setIsLightboxOpen(true);
            setLightboxZoom(1);
          }}
          className="absolute bottom-4 right-4 p-2.5 rounded-full bg-white/90 backdrop-blur-xs text-[#1C1B18] shadow-md hover:bg-white hover:text-[#14372E] transition-all"
          title={locale === "bn" ? "পূর্ণ পর্দায় দেখুন" : "Open Lightbox"}
          aria-label="Open Lightbox"
        >
          <Maximize2 className="w-5 h-5" />
        </button>

        {/* Prev / Next Arrows on Main Stage */}
        {safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handlePrev();
              }}
              className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#1C1B18] shadow-md transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleNext();
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-white/80 hover:bg-white text-[#1C1B18] shadow-md transition-all opacity-80 sm:opacity-0 sm:group-hover:opacity-100 hover:scale-105"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails row */}
      {safeImages.length > 1 && (
        <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin">
          {safeImages.map((img, idx) => (
            <button
              key={img.id || idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative w-20 h-24 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                currentIndex === idx
                  ? "border-[#14372E] ring-2 ring-[#14372E]/30 scale-102"
                  : "border-[#E9DDC9] opacity-70 hover:opacity-100"
              }`}
            >
              <Image
                src={img.image_url}
                alt={`${title} view ${idx + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isLightboxOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={title}
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-in fade-in duration-200"
          onClick={() => {
            setIsLightboxOpen(false);
            setLightboxZoom(1);
          }}
        >
          {/* Lightbox Header Bar */}
          <div
            className="flex items-center justify-between z-10 w-full max-w-6xl mx-auto gap-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-white/90 min-w-0 pr-2">
              <h3 className="font-serif text-base sm:text-lg font-bold truncate">{title}</h3>
              <p className="text-xs text-white/60">
                {locale === "bn"
                  ? `ছবি ${currentIndex + 1} / ${safeImages.length}`
                  : `Image ${currentIndex + 1} of ${safeImages.length}`}
              </p>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              {/* Zoom toggle in lightbox */}
              <button
                type="button"
                onClick={toggleLightboxZoom}
                className="p-2 sm:px-3 sm:py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title={lightboxZoom > 1 ? "1x Zoom" : "2.5x Zoom"}
              >
                {lightboxZoom > 1 ? (
                  <>
                    <ZoomOut className="w-4 h-4" />
                    <span className="hidden sm:inline">{locale === "bn" ? "আসল মাপ" : "Reset Zoom"}</span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="w-4 h-4" />
                    <span className="hidden sm:inline">{locale === "bn" ? "বড় করে দেখুন" : "2.5x Zoom"}</span>
                  </>
                )}
              </button>

              {/* Close Button */}
              <button
                type="button"
                onClick={() => {
                  setIsLightboxOpen(false);
                  setLightboxZoom(1);
                }}
                className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lightbox Stage Center */}
          <div
            className="relative flex-1 w-full max-w-5xl mx-auto flex items-center justify-center overflow-hidden my-4"
            onClick={(e) => e.stopPropagation()}
            onMouseMove={handleLightboxMouseMove}
            onTouchStart={handleLightboxTouchStart}
            onTouchMove={handleLightboxTouchMove}
            onTouchEnd={handleLightboxTouchEnd}
          >
            <div
              onClick={toggleLightboxZoom}
              className={`relative w-full h-full max-h-[75vh] aspect-[3/4] transition-transform duration-200 ${
                lightboxZoom > 1 ? "cursor-zoom-out" : "cursor-zoom-in"
              }`}
            >
              <Image
                src={activeImage}
                alt={title}
                fill
                priority
                className="object-contain"
                style={{
                  transformOrigin: `${lightboxPan.x}% ${lightboxPan.y}%`,
                  transform: `scale(${lightboxZoom})`,
                  transition: lightboxZoom === 1 ? "transform 0.25s ease-out" : "none",
                }}
                unoptimized
              />
            </div>

            {/* Prev / Next Arrows in Lightbox */}
            {safeImages.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePrev();
                  }}
                  className="absolute left-2 sm:left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 shadow-xl transition-all"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleNext();
                  }}
                  className="absolute right-2 sm:right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 shadow-xl transition-all"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>

          {/* Lightbox Bottom Thumbnail Bar */}
          <div
            className="flex justify-center items-center gap-2 z-10 overflow-x-auto py-2 max-w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {safeImages.map((img, idx) => (
              <button
                key={img.id || idx}
                type="button"
                onClick={() => {
                  setActiveIndex(idx);
                  setLightboxZoom(1);
                }}
                className={`relative w-14 h-18 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                  currentIndex === idx
                    ? "border-[#C5A059] ring-2 ring-[#C5A059]/40 scale-105"
                    : "border-white/20 opacity-60 hover:opacity-100"
                }`}
              >
                <Image
                  src={img.image_url}
                  alt={`Thumbnail ${idx + 1}`}
                  fill
                  className="object-cover"
                  unoptimized
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
