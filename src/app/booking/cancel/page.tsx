import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "پرداخت ناموفق" };

export default function BookingCancelPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-danger/15">
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 text-danger"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </div>
      <h1 className="mt-6 text-3xl font-bold text-frost">پرداخت کامل نشد</h1>
      <p className="mt-4 leading-8 text-pale/85">
        نگران نباش — هیچ مبلغی کسر نشده یا اگر کسر شده باشد، طبق قوانین درگاه
        بازمی‌گردد. می‌توانی دوباره تلاش کنی و زمان مشاوره‌ات را رزرو کنی.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/booking"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-frost transition-colors hover:bg-accent"
        >
          تلاش دوباره
        </Link>
        <Link
          href="/"
          className="rounded-xl border border-white/15 px-6 py-3 text-sm text-pale transition-colors hover:bg-white/5"
        >
          بازگشت به خانه
        </Link>
      </div>
    </div>
  );
}
