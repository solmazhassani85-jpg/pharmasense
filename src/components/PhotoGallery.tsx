"use client";

import { useState } from "react";
import Image from "next/image";
import RevealSection from "./RevealSection";

const photos = [
  {
    src: "/images/consultation-1.jpg",
    alt: "داروساز بالینی در حال دادن دارو به بیمار",
    caption: "مشاوره دارویی اختصاصی",
  },
  {
    src: "/images/consultation-2.avif",
    alt: "متخصص دارویی در حال کمک به بیمار با قرص‌ها",
    caption: "بررسی و دوزبندی دارو",
  },
];

function PhotoCard({
  photo,
  delay,
}: {
  photo: (typeof photos)[0];
  delay: number;
}) {
  const [errored, setErrored] = useState(false);

  return (
    <RevealSection delay={delay}>
      <div className="glass-card-premium group cursor-default overflow-hidden rounded-2xl">
        <div className="relative aspect-[4/3] overflow-hidden bg-primary/10">
          {errored ? (
            /* جای‌گذار در صورت نبودن فایل */
            <div className="flex h-full flex-col items-center justify-center gap-3">
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10 text-pale/20"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden="true"
              >
                <rect width="18" height="18" x="3" y="3" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <path d="m21 15-5-5L5 21" />
              </svg>
              <p className="text-xs text-pale/30">عکس هنوز بارگذاری نشده</p>
            </div>
          ) : (
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              onError={() => setErrored(true)}
            />
          )}

          {/* اُورلی گرادیانت پایین */}
          {!errored && (
            <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-navy-900/70 to-transparent" />
          )}
        </div>

        {/* کپشن */}
        <div className="flex items-center gap-2.5 border-t border-white/[0.07] px-5 py-3.5">
          <span
            className="h-1.5 w-1.5 rounded-full bg-accent/60"
            aria-hidden="true"
          />
          <p className="text-sm text-pale/75">{photo.caption}</p>
        </div>
      </div>
    </RevealSection>
  );
}

export default function PhotoGallery() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <RevealSection>
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow mb-2">جلسات مشاوره</p>
            <h2 className="text-3xl font-bold leading-tight text-frost">
              مشاوره‌ای که واقعی است
            </h2>
            <p className="mt-2 text-pale/60">
              هر جلسه، یک بررسی کامل و شخصی از داروهای شما.
            </p>
          </div>
        </div>
      </RevealSection>

      <div className="grid gap-5 sm:grid-cols-2">
        {photos.map((p, i) => (
          <PhotoCard key={p.src} photo={p} delay={i * 130} />
        ))}
      </div>
    </section>
  );
}
