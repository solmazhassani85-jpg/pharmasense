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
      {/* معرفی + جای‌گذار عکس */}
      <div className="grid items-center gap-10 md:grid-cols-[280px_1fr]">
        {/* جای‌گذار عکس — بعداً عکس واقعی جایگزین می‌شود */}
        <div className="mx-auto flex aspect-[3/4] w-full max-w-[280px] items-center justify-center rounded-3xl border border-dashed border-white/20 bg-white/5 text-center">
          <div className="px-6 text-pale/50">
            <svg
              viewBox="0 0 24 24"
              className="mx-auto h-12 w-12"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" />
              <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
            </svg>
            <p className="mt-3 text-xs">عکس شما اینجا قرار می‌گیرد</p>
          </div>
        </div>

        <div>
          <p className="eyebrow">درباره من</p>
          <h1 className="mt-2 text-4xl font-bold text-frost">
            اولین مشاور دارویی فارسی‌زبان
          </h1>
          <p className="mt-5 text-lg leading-8 text-pale/85">
            {/* متن موقت — با رزومه‌ی شما جایگزین می‌شود */}
            من یک متخصص دارویی با رویکرد بالینی شخصی‌سازی‌شده هستم. اینجا نه
            اطلاعات عمومی، بلکه یک بررسی واقعی و شخصی از داروهای تو ارائه می‌دهم.
            <span className="mt-2 block text-sm text-pale/50">
              (این بخش با بیوگرافی و رزومه‌ی شما تکمیل خواهد شد.)
            </span>
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              href="/booking"
              className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-frost shadow-lg shadow-primary/30 transition-colors hover:bg-accent"
            >
              رزرو مشاوره
            </Link>
            <a
              href={brand.social.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/15 px-6 py-3 text-sm text-pale transition-colors hover:bg-white/5"
            >
              {brand.social.instagramHandle}
            </a>
          </div>
        </div>
      </div>

      {/* ماموریت و چشم‌انداز */}
      <div className="mt-16 grid gap-6 md:grid-cols-2">
        <div className="lift rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-accent/40">
          <h2 className="text-xl font-bold text-accent">ماموریت</h2>
          <p className="mt-3 leading-8 text-pale/85">
            کمک به افراد فارسی‌زبان برای دسترسی به مشاوره دارویی شخصی‌سازی‌شده،
            مبتنی بر شواهد علمی و همراه با همدلی انسانی — با هدف کاهش عوارض
            دارویی، پیشگیری از تداخلات خطرناک و توانمندسازی افراد.
          </p>
        </div>
        <div className="lift rounded-2xl border border-white/10 bg-white/5 p-8 hover:border-accent/40">
          <h2 className="text-xl font-bold text-accent">چشم‌انداز</h2>
          <p className="mt-3 leading-8 text-pale/85">
            جهانی که در آن هر فرد فارسی‌زبان به یک متخصص دارویی دلسوز، آگاه و
            قابل اعتماد دسترسی داشته باشد — و مصرف داروها نه از روی ترس، بلکه بر
            پایه آگاهی و اطمینان باشد.
          </p>
        </div>
      </div>

      {/* جای‌گذار رزومه */}
      <section className="mt-16 rounded-2xl border border-dashed border-white/20 bg-white/[0.03] p-8">
        <h2 className="text-xl font-bold text-frost">سوابق و تخصص</h2>
        <p className="mt-3 text-sm leading-8 text-pale/60">
          این بخش پس از دریافت رزومه‌ی شما با تحصیلات، سوابق کاری، گواهی‌نامه‌ها و
          حوزه‌های تخصصی تکمیل می‌شود. کافی است رزومه را برایم بفرستید.
        </p>
      </section>
    </div>
  );
}
