"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { publicPath } from "@/lib/public-path";
import type { GalleryPhoto } from "@/lib/wedding-config";

type PhotoGalleryProps = {
  photos: GalleryPhoto[];
};

const SLIDE_INTERVAL_MS = 4000;

export function PhotoGallery({ photos }: PhotoGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const showPrevious = () =>
    setCurrentIndex((current) => (current - 1 + photos.length) % photos.length);
  const showNext = () => setCurrentIndex((current) => (current + 1) % photos.length);

  const closeLightbox = () => setActiveIndex(null);
  const showLightboxPrevious = () =>
    setActiveIndex((current) =>
      current === null ? current : (current - 1 + photos.length) % photos.length,
    );
  const showLightboxNext = () =>
    setActiveIndex((current) => (current === null ? current : (current + 1) % photos.length));

  useEffect(() => {
    if (isPaused || activeIndex !== null || photos.length <= 1) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const timer = window.setTimeout(showNext, SLIDE_INTERVAL_MS);
    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- restarts the timer on every slide change, whether that change was automatic or manual
  }, [currentIndex, isPaused, activeIndex, photos.length]);

  useEffect(() => {
    if (activeIndex === null) return;

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setActiveIndex(null);
      if (event.key === "ArrowLeft") {
        setActiveIndex((current) =>
          current === null ? current : (current - 1 + photos.length) % photos.length,
        );
      }
      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current === null ? current : (current + 1) % photos.length));
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [activeIndex, photos.length]);

  const activePhoto = activeIndex === null ? null : photos[activeIndex];

  return (
    <div className="relative mx-auto overflow-hidden rounded-[2rem] border border-rose-100 bg-[#fffaf7] px-5 py-14 text-center shadow-2xl shadow-rose-100/70 sm:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_72%_14%,rgba(251,207,232,0.28),transparent_16rem),radial-gradient(circle_at_28%_78%,rgba(255,255,255,0.82),transparent_18rem)]" />
      <Image
        src={publicPath("/images/florals/corner-bouquet.webp")}
        alt=""
        width={430}
        height={430}
        className="pointer-events-none absolute -left-28 -top-10 z-0 hidden w-80 opacity-70 sm:block"
      />

      <div className="relative z-10 mx-auto max-w-2xl">
        <h2 className="font-serif text-xl font-semibold uppercase tracking-[0.18em] text-[#9c6a61] sm:text-3xl">
          Album Ảnh Cưới
        </h2>

        <div
          className="relative mt-8 aspect-[4/3] w-full overflow-hidden rounded-md bg-rose-100 shadow-lg shadow-rose-100/70 sm:aspect-[16/10]"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={() => setIsPaused(false)}
        >
          {photos.map((photo, index) => (
            <button
              key={photo.src}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-hidden={index !== currentIndex}
              tabIndex={index === currentIndex ? 0 : -1}
              className={`absolute inset-0 transition-opacity duration-700 ${
                index === currentIndex ? "z-10 opacity-100" : "pointer-events-none z-0 opacity-0"
              }`}
              aria-label={`Xem ảnh: ${photo.alt}`}
            >
              <Image
                src={publicPath(photo.src)}
                alt={photo.alt}
                fill
                sizes="(min-width: 640px) 42rem, 100vw"
                priority={index === 0}
                className="object-cover"
              />
            </button>
          ))}

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showPrevious();
            }}
            aria-label="Ảnh trước"
            className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-xl leading-none text-[#8e5f57] shadow transition hover:bg-white sm:left-4"
          >
            &#8249;
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNext();
            }}
            aria-label="Ảnh tiếp theo"
            className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/70 text-xl leading-none text-[#8e5f57] shadow transition hover:bg-white sm:right-4"
          >
            &#8250;
          </button>

          <p className="absolute bottom-3 left-1/2 z-20 -translate-x-1/2 rounded-full bg-stone-950/40 px-3 py-1 text-xs text-white">
            {currentIndex + 1} / {photos.length}
          </p>
        </div>
      </div>

      {activePhoto ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/90 p-4"
          role="dialog"
          aria-modal="true"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            aria-label="Đóng"
            className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20"
          >
            &times;
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showLightboxPrevious();
            }}
            aria-label="Ảnh trước"
            className="absolute left-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20 sm:left-6"
          >
            &#8249;
          </button>

          {/* eslint-disable-next-line @next/next/no-img-element -- variable aspect ratio + unoptimized static export, next/image fill offers no benefit here */}
          <img
            src={publicPath(activePhoto.fullSrc)}
            alt={activePhoto.alt}
            onClick={(event) => event.stopPropagation()}
            className="max-h-[85vh] max-w-[90vw] rounded-md object-contain shadow-2xl"
          />

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showLightboxNext();
            }}
            aria-label="Ảnh tiếp theo"
            className="absolute right-2 flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-2xl leading-none text-white transition hover:bg-white/20 sm:right-6"
          >
            &#8250;
          </button>

          <p className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-white/70">
            {activeIndex !== null ? activeIndex + 1 : 0} / {photos.length}
          </p>
        </div>
      ) : null}
    </div>
  );
}
