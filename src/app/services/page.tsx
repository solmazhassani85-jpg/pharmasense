import type { Metadata } from "next";
import { services } from "@/lib/brand";
import ServiceCard from "@/components/ServiceCard";

export const metadata: Metadata = {
  title: "خدمات",
  description:
    "خدمات PharmaSense — مشاوره دارویی شخصی، بررسی تداخلات و دوزبندی. وبینار و کلاس‌های آنلاین به‌زودی.",
};

const steps = [
  {
    step: "۱",
    title: "ثبت‌نام",
    desc: "در سایت ثبت‌نام کن و وارد پنل کاربری‌ات شو.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    step: "۲",
    title: "انتخاب وقت",
    desc: "یک زمان خالی از تقویم مشاوره انتخاب کن.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="18" height="18" x="3" y="4" rx="2" ry="2" />
        <line x1="16" x2="16" y1="2" y2="6" />
        <line x1="8" x2="8" y1="2" y2="6" />
        <line x1="3" x2="21" y1="10" y2="10" />
        <path d="M8 14h.01M12 14h.01M16 14h.01" />
      </svg>
    ),
  },
  {
    step: "۳",
    title: "پرداخت",
    desc: "هزینه را با درگاه داخلی یا بین‌المللی پرداخت کن.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <rect width="20" height="14" x="2" y="5" rx="2" />
        <line x1="2" x2="22" y1="10" y2="10" />
      </svg>
    ),
  },
  {
    step: "۴",
    title: "جلسه مشاوره",
    desc: "در زمان رزروشده جلسه برگزار می‌شود و گزارش می‌گیری.",
    icon: (
      <svg
        viewBox="0 0 24 24"
        className="h-5 w-5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.15 14a19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 3.07 3h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.09 10.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21 17z" />
      </svg>
    ),
  },
];

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      {/* ── هدر ────────────────────────────────────────────── */}
      <header className="relative mb-16 max-w-2xl">
        {/* اُرب پس‌زمینه */}
        <div
          className="pointer-events-none absolute -right-20 -top-10 h-48 w-48 rounded-full bg-primary/20 blur-3xl"
          aria-hidden="true"
        />
        <p className="eyebrow mb-2">خدمات</p>
        <h1 className="text-4xl font-bold leading-tight text-frost">
          مصرف دارو بر پایه‌ی آگاهی،{" "}
          <span className="text-gradient">نه ترس</span>
        </h1>
        <p className="mt-4 text-lg leading-8 text-pale/80">
          هر خدمت با یک هدف ساده طراحی شده: مصرف داروهایت بر پایه آگاهی و
          اطمینان باشد، نه ترس. با مشاوره دارویی شروع می‌کنیم.
        </p>
      </header>

      {/* ── کارت‌های خدمات ──────────────────────────────────── */}
      <div className="grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>

      {/* جداکننده */}
      <div className="divider-glow my-20" />

      {/* ── فرایند ──────────────────────────────────────────── */}
      <section>
        <p className="eyebrow mb-2">فرایند</p>
        <h2 className="text-3xl font-bold leading-tight text-frost">
          مشاوره چطور انجام می‌شود؟
        </h2>
        <p className="mt-3 text-pale/65">
          از ثبت‌نام تا دریافت گزارش شخصی — چهار قدم ساده.
        </p>

        <ol className="relative mt-12 grid gap-5 md:grid-cols-4">
          {steps.map((s, idx) => (
            <li key={s.step} className="glass-card-premium rounded-2xl p-6">
              <div className="mb-5 flex items-center gap-3">
                <span className="icon-glow flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-frost">
                  {s.icon}
                </span>
                {/* خط اتصال (فقط دسکتاپ، قبل از آخرین آیتم) */}
                {idx < steps.length - 1 && (
                  <div className="hidden h-px flex-1 bg-gradient-to-l from-transparent to-accent/25 md:block" />
                )}
              </div>
              <span className="font-mono text-xs font-bold text-accent/50">
                مرحله {s.step}
              </span>
              <h3 className="mt-1.5 font-semibold text-frost">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-pale/70">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
