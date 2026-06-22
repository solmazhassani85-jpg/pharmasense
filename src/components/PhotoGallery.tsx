"use client";

import { useState } from "react";
import RevealSection from "./RevealSection";

const photos = [
  {
    id: "7659873",
    alt: "داروساز بالینی در حال مشاوره با بیمار",
    caption: "مشاوره دارویی اختصاصی",
  },
  {
    id: "5452293",
    alt: "متخصص دارویی در حال بررسی داروها",
    caption: "بررسی تداخلات دارویی",
  },
  {
    id: "8460157",
    alt: "داروساز و بیمار در حال گفتگو",
    caption: "گزارش شخصی‌سازی‌شده",
  },
];

function PhotoCard({ photo, delay }: { photo: (typeof photos)[0]; delay: number }) {
  const [errored, setErrored] = useState(false);
  const src = `https://images.pexels.com/photos/${photo.id}/pexels-photo-${photo.id}.jpeg?auto=compress&cs=tinysrgb&w=800&h=600&dpr=1`;

  return (
    <RevealSection delay={delay}>
      <div className="glass-card-premium group cursor-default overflow-hidden rounded-2xl">
        {errored ? (
          /* جای‌گذار در صورت خطا */
          <div className="flex aspect-[4/3] flex-col items-center justify-center gap-3 bg-primary/10">
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
            <p className="text-xs text-pale/30">{photo.alt}</p>
          </div>
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={src}
            alt={photo.alt}
            className="aspect-[4/3] w-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setErrored(true)}
            loading="lazy"
          />
        )}

        {/* کپشن */}
        <div className="flex items-center gap-2.5 border-t border-white/[0.07] px-5 py-3.5">
          <span className="h-1.5 w-1.5 rounded-full bg-accent/60" aria-hidden="true" />
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
          <a
            href="https://www.pexels.com/license/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-pale/30 transition-colors hover:text-pale/50"
          >
            عکس‌ها: Pexels
          </a>
        </div>
      </RevealSection>

      <div className="grid gap-5 sm:grid-cols-3">
        {photos.map((p, i) => (
          <PhotoCard key={p.id} photo={p} delay={i * 130} />
        ))}
      </div>
    </section>
  );
}
