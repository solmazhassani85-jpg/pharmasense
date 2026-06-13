import Link from "next/link";
import { brand, services, brandValues, keyMessages } from "@/lib/brand";
import ServiceCard from "@/components/ServiceCard";
import MedicationCard from "@/components/MedicationCard";

export default function HomePage() {
  return (
    <>
      {/* ── Hero (thesis = کارت بازبینی دارو) ───────────── */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-24 lg:grid-cols-[1.05fr_0.95fr]">
          {/* ستون متن */}
          <div>
            <p className="eyebrow">مشاوره دارویی تخصصی · فارسی‌زبان</p>

            <h1 className="mt-5 text-4xl font-bold leading-[1.25] text-frost sm:text-5xl md:text-6xl">
              دانش دارویی،
              <br />
              <span className="text-accent">دلسوزی انسانی.</span>
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-pale/85">
              {brand.elevatorPitch}
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/booking"
                className="rounded-xl bg-primary px-7 py-3.5 text-center text-base font-medium text-frost shadow-lg shadow-primary/30 transition-colors hover:bg-accent"
              >
                رزرو وقت مشاوره
              </Link>
              <Link
                href="/services"
                className="rounded-xl border border-white/15 px-7 py-3.5 text-center text-base text-pale transition-colors hover:bg-white/5"
              >
                مشاهده خدمات
              </Link>
            </div>
          </div>

          {/* ستون امضا */}
          <div className="lg:pr-4">
            <MedicationCard />
          </div>
        </div>
      </section>

      {/* ── پیام‌های کلیدی (بدون نشانگر تزئینی) ──────────── */}
      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="mx-auto grid max-w-6xl gap-px px-4 sm:px-6 md:grid-cols-3">
          {keyMessages.map((msg, i) => (
            <div key={i} className="px-2 py-8 md:px-6">
              <span className="status-dot status-safe" aria-hidden="true" />
              <p className="mt-4 text-base leading-7 text-pale/90">{msg}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── خدمات ──────────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
        <div className="mb-10 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow">خدمات</p>
            <h2 className="mt-2 text-3xl font-bold text-frost">
              با مشاوره دارویی شروع می‌کنیم
            </h2>
            <p className="mt-2 text-pale/70">
              وبینار و کلاس‌های آنلاین به‌زودی اضافه می‌شوند.
            </p>
          </div>
          <Link href="/services" className="text-sm text-accent hover:underline">
            همه خدمات ←
          </Link>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {services.map((s) => (
            <ServiceCard key={s.slug} service={s} />
          ))}
        </div>
      </section>

      {/* ── ارزش‌های برند ──────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
        <p className="eyebrow">چرا PharmaSense</p>
        <h2 className="mb-10 mt-2 text-3xl font-bold text-frost">
          یک متخصص واقعی، نه یک جست‌وجوی گوگل
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {brandValues.map((v) => (
            <div
              key={v.title}
              className="lift rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-accent/40"
            >
              <h3 className="text-lg font-semibold text-accent">{v.title}</h3>
              <p className="mt-2 text-sm leading-7 text-pale/80">{v.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA پایانی ─────────────────────────────────── */}
      <section className="mx-auto max-w-6xl px-4 pb-24 sm:px-6">
        <div className="overflow-hidden rounded-3xl border border-accent/20 bg-gradient-to-l from-primary/20 to-accent/10 p-10 text-center sm:p-16">
          <h2 className="text-3xl font-bold text-frost sm:text-4xl">
            اگه الان بیشتر از یه دارو مصرف می‌کنی…
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-pale/85">
            لیست داروهایت را بفرست و یک بررسی شخصی بگیر. خیالت را راحت می‌کنیم.
          </p>
          <Link
            href="/booking"
            className="mt-8 inline-block rounded-xl bg-primary px-8 py-3.5 text-base font-medium text-frost shadow-lg shadow-primary/30 transition-colors hover:bg-accent"
          >
            همین حالا رزرو کن
          </Link>
        </div>
      </section>
    </>
  );
}
