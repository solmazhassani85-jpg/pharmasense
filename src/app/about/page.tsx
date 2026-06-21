import type { Metadata } from "next";
import Link from "next/link";
import { brand } from "@/lib/brand";

export const metadata: Metadata = {
  title: "درباره من",
  description:
    "درباره PharmaSense — اولین مشاور دارویی فارسی‌زبان با رویکرد بالینی شخصی‌سازی‌شده.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
      {/* ── معرفی ─────────────────────────────────────────── */}
      <div className="grid items-center gap-10 md:grid-cols-[280px_1fr]">
        {/* جای‌گذار عکس */}
        <div className="glass-card-premium relative mx-auto flex aspect-[3/4] w-full max-w-[280px] flex-col items-center justify-center overflow-hidden rounded-3xl text-center">
          {/* نوار رنگی بالا */}
          <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-primary via-accent to-sky" />
          <div className="px-6 text-pale/35">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-primary/20 ring-2 ring-accent/20">
              <svg
                viewBox="0 0 24 24"
                className="h-10 w-10"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.2"
                aria-hidden="true"
              >
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </div>
            <p className="mt-5 text-xs leading-6">عکس شما اینجا قرار می‌گیرد</p>
          </div>
        </div>

        <div>
          <div className="trust-badge mb-5 w-fit">
            <span
              className="inline-block h-1.5 w-1.5 rounded-full bg-accent"
              aria-hidden="true"
            />
            متخصص دارویی · Clinical Pharma Advisor
          </div>

          <h1 className="text-4xl font-bold leading-tight text-frost">
            اولین مشاور دارویی فارسی‌زبان
          </h1>
          <p className="mt-5 text-lg leading-8 text-pale/80">
            من یک متخصص دارویی با رویکرد بالینی شخصی‌سازی‌شده هستم. اینجا نه
            اطلاعات عمومی، بلکه یک بررسی واقعی و شخصی از داروهای تو ارائه
            می‌دهم.
            <span className="mt-2 block text-sm text-pale/40">
              (این بخش با بیوگرافی و رزومه‌ی شما تکمیل خواهد شد.)
            </span>
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/booking"
              className="btn-glow rounded-xl bg-primary px-6 py-3 text-sm font-medium text-frost transition-all duration-200 hover:bg-accent"
            >
              رزرو مشاوره
            </Link>
            <a
              href={brand.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/[0.12] px-6 py-3 text-sm text-pale/75 transition-all hover:border-accent/30 hover:bg-accent/[0.06] hover:text-frost"
            >
              {brand.social.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      {/* جداکننده */}
      <div className="divider-glow my-16" />

      {/* ── ماموریت و چشم‌انداز ────────────────────────────── */}
      <div className="grid gap-5 md:grid-cols-2">
        <div className="glass-card-premium rounded-2xl p-8">
          <span className="icon-glow mb-5 flex h-11 w-11 items-center justify-center rounded-xl">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-frost"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
            </svg>
          </span>
          <h2 className="text-xl font-bold text-frost">ماموریت</h2>
          <p className="mt-3 leading-8 text-pale/80">
            کمک به افراد فارسی‌زبان برای دسترسی به مشاوره دارویی
            شخصی‌سازی‌شده، مبتنی بر شواهد علمی و همراه با همدلی انسانی — با
            هدف کاهش عوارض دارویی، پیشگیری از تداخلات خطرناک و توانمندسازی
            افراد.
          </p>
        </div>

        <div className="glass-card-premium rounded-2xl p-8">
          <span className="icon-glow mb-5 flex h-11 w-11 items-center justify-center rounded-xl">
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5 text-frost"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4l3 3" />
            </svg>
          </span>
          <h2 className="text-xl font-bold text-frost">چشم‌انداز</h2>
          <p className="mt-3 leading-8 text-pale/80">
            جهانی که در آن هر فرد فارسی‌زبان به یک متخصص دارویی دلسوز، آگاه و
            قابل اعتماد دسترسی داشته باشد — و مصرف داروها نه از روی ترس، بلکه
            بر پایه آگاهی و اطمینان باشد.
          </p>
        </div>
      </div>

      {/* ── سوابق و تخصص ──────────────────────────────────── */}
      <section className="mt-6">
        <div className="glass-card-premium rounded-2xl p-8">
          <div className="flex items-start gap-5">
            <span className="icon-glow mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl">
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5 text-frost"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                <path d="M6 12v5c3 3 9 3 12 0v-5" />
              </svg>
            </span>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-frost">سوابق و تخصص</h2>
              <p className="mt-3 text-sm leading-8 text-pale/50">
                این بخش پس از دریافت رزومه‌ی شما با تحصیلات، سوابق کاری،
                گواهی‌نامه‌ها و حوزه‌های تخصصی تکمیل می‌شود. کافی است رزومه
                را برایم بفرستید.
              </p>

              {/* کارت‌های Credential */}
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  {
                    label: "تحصیلات",
                    placeholder: "دانشگاه · مقطع",
                    icon: (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                        <path d="M6 12v5c3 3 9 3 12 0v-5" />
                      </svg>
                    ),
                  },
                  {
                    label: "سوابق بالینی",
                    placeholder: "بیمارستان · کلینیک",
                    icon: (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                        <polyline points="9 22 9 12 15 12 15 22" />
                      </svg>
                    ),
                  },
                  {
                    label: "گواهی‌نامه",
                    placeholder: "بورد تخصصی",
                    icon: (
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                        <circle cx="12" cy="8" r="6" />
                        <path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11" />
                      </svg>
                    ),
                  },
                ].map((c) => (
                  <div
                    key={c.label}
                    className="glass-card rounded-xl border border-white/[0.08] p-4 transition-all hover:border-accent/20"
                  >
                    <div className="mb-2 flex items-center gap-2 text-accent/60">
                      {c.icon}
                      <p className="text-xs font-semibold text-accent/80">
                        {c.label}
                      </p>
                    </div>
                    <p className="text-xs text-pale/30">{c.placeholder}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
