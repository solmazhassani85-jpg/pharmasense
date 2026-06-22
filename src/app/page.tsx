import Link from "next/link";
import { brand, services, brandValues, keyMessages } from "@/lib/brand";
import ServiceCard from "@/components/ServiceCard";
import MedicationCard from "@/components/MedicationCard";
import RevealSection from "@/components/RevealSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FaqSection from "@/components/FaqSection";
import PhotoGallery from "@/components/PhotoGallery";

export default function HomePage() {
  return (
    <>
      {/* ── Hero ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0 grid-bg opacity-50"
          aria-hidden="true"
        />
        <div
          className="pointer-events-none absolute inset-0 overflow-hidden"
          aria-hidden="true"
        >
          <div className="absolute -right-40 -top-24 h-[30rem] w-[30rem] rounded-full bg-primary/28 blur-3xl" />
          <div className="absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-accent/14 blur-3xl" />
          <div className="absolute left-1/3 top-1/4 h-64 w-64 rounded-full bg-sky/7 blur-3xl" />
          <div className="absolute right-1/4 bottom-1/3 h-52 w-52 rounded-full bg-primary/16 blur-2xl" />
        </div>

        <div className="relative mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-28 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <div className="trust-badge animate-rise mb-7 w-fit">
              <span className="status-dot status-safe" aria-hidden="true" />
              مشاور دارویی بالینی · فارسی‌زبان
            </div>

            <h1 className="animate-rise stagger-1 text-4xl font-bold leading-[1.2] text-frost sm:text-5xl md:text-[3.75rem]">
              دانش دارویی،
              <br />
              <span className="text-gradient">دلسوزی انسانی.</span>
            </h1>

            <p className="animate-rise stagger-2 mt-6 max-w-xl text-lg leading-8 text-pale/80">
              {brand.elevatorPitch}
            </p>

            <div className="animate-rise stagger-3 mt-10 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/booking"
                className="btn-glow rounded-xl bg-primary px-8 py-3.5 text-center text-base font-medium text-frost transition-all duration-200 hover:bg-accent"
              >
                رزرو وقت مشاوره
              </Link>
              <Link
                href="/services"
                className="rounded-xl border border-white/[0.13] px-8 py-3.5 text-center text-base text-pale transition-all hover:border-accent/30 hover:bg-accent/[0.06] hover:text-frost"
              >
                مشاهده خدمات
              </Link>
            </div>

            <div className="animate-rise stagger-4 mt-10 grid grid-cols-3 gap-3 border-t border-white/[0.07] pt-8">
              {[
                { num: "۴۵", label: "دقیقه جلسه اختصاصی" },
                { num: "۱۰۰٪", label: "تحلیل شخصی‌سازی‌شده" },
                { num: "۲", label: "درگاه پرداخت" },
              ].map((s) => (
                <div
                  key={s.label}
                  className="glass-card rounded-xl p-4 text-center"
                >
                  <p className="stat-num">{s.num}</p>
                  <p className="mt-1.5 text-xs leading-5 text-pale/55">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="animate-float lg:pr-4">
            <MedicationCard />
          </div>
        </div>
      </section>

      {/* ── گالری عکس ──────────────────────────────────────── */}
      <PhotoGallery />

      {/* ── پیام‌های کلیدی ──────────────────────────────────── */}
      <RevealSection>
        <div className="divider-glow mx-auto max-w-6xl px-4 sm:px-6" />
        <section className="bg-gradient-to-r from-white/[0.02] to-transparent">
          <div className="mx-auto grid max-w-6xl gap-px px-4 sm:px-6 md:grid-cols-3">
            {keyMessages.map((msg, i) => (
              <div
                key={i}
                className="group cursor-default px-6 py-10 transition-colors hover:bg-white/[0.03] md:px-10"
              >
                <div className="mb-4 flex items-center gap-3">
                  <span className="font-mono text-4xl font-black text-accent/30 transition-colors duration-300 group-hover:text-accent/60">
                    {["۰۱", "۰۲", "۰۳"][i]}
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-accent/20 transition-all duration-300 group-hover:to-accent/45" />
                </div>
                <p className="text-base leading-7 text-pale/85 transition-colors group-hover:text-pale/95">
                  {msg}
                </p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ── خدمات ──────────────────────────────────────────── */}
      <RevealSection>
        <div className="divider-glow mx-auto max-w-6xl px-4 sm:px-6" />
        <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
          <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <p className="eyebrow mb-2">خدمات</p>
              <h2 className="text-3xl font-bold leading-tight text-frost">
                با مشاوره دارویی شروع می‌کنیم
              </h2>
              <p className="mt-2 text-pale/60">
                وبینار و کلاس‌های آنلاین به‌زودی اضافه می‌شوند.
              </p>
            </div>
            <Link
              href="/services"
              className="group flex items-center gap-1.5 text-sm text-accent transition-colors hover:text-sky"
            >
              همه خدمات
              <span className="transition-transform group-hover:-translate-x-1">←</span>
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {services.map((s) => (
              <ServiceCard key={s.slug} service={s} />
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ── نظرات مراجعین ──────────────────────────────────── */}
      <TestimonialsSection />

      {/* ── ارزش‌های برند ──────────────────────────────────── */}
      <RevealSection>
        <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
          <p className="eyebrow mb-2">چرا PharmaSense</p>
          <h2 className="mb-12 text-3xl font-bold text-frost">
            یک متخصص واقعی، نه یک جست‌وجوی گوگل
          </h2>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {brandValues.map((v, i) => (
              <div
                key={v.title}
                className="glass-card-premium cursor-default rounded-2xl p-6"
              >
                <div className="icon-glow mb-5 flex h-11 w-11 items-center justify-center rounded-xl">
                  <span className="font-mono text-sm font-bold text-frost">
                    {["۰۱", "۰۲", "۰۳", "۰۴"][i]}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-frost">{v.title}</h3>
                <p className="mt-2.5 text-sm leading-7 text-pale/75">{v.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </RevealSection>

      {/* ── سوالات متداول ──────────────────────────────────── */}
      <FaqSection />

      {/* ── CTA پایانی ─────────────────────────────────────── */}
      <RevealSection>
        <section className="mx-auto max-w-6xl px-4 pb-28 sm:px-6">
          <div className="glass-card-premium relative overflow-hidden rounded-3xl p-12 text-center sm:p-20">
            <div
              className="pointer-events-none absolute inset-0"
              aria-hidden="true"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/28 via-navy-800/60 to-accent/18" />
              <div className="absolute -left-16 -top-16 h-56 w-56 rounded-full bg-accent/16 blur-3xl" />
              <div className="absolute -bottom-12 -right-12 h-48 w-48 rounded-full bg-primary/22 blur-2xl" />
              <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-sky/7 blur-3xl" />
            </div>

            <div className="relative">
              <p className="eyebrow mx-auto mb-5">همین حالا شروع کن</p>
              <h2 className="text-3xl font-bold leading-tight text-frost sm:text-4xl">
                اگه الان بیشتر از یه دارو مصرف می‌کنی…
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-lg leading-8 text-pale/80">
                لیست داروهایت را بفرست و یک بررسی شخصی بگیر. خیالت را راحت
                می‌کنیم.
              </p>
              <div className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
                <Link
                  href="/booking"
                  className="btn-glow rounded-xl bg-primary px-10 py-4 text-base font-medium text-frost transition-all duration-200 hover:bg-accent"
                >
                  همین حالا رزرو کن
                </Link>
                <Link
                  href="/about"
                  className="text-sm text-pale/65 transition-colors hover:text-pale"
                >
                  بیشتر درباره من بدان ←
                </Link>
              </div>
            </div>
          </div>
        </section>
      </RevealSection>
    </>
  );
}
