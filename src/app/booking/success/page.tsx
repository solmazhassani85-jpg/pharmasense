import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = { title: "رزرو موفق" };

export default function BookingSuccessPage() {
  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success/15">
        <svg
          viewBox="0 0 24 24"
          className="h-8 w-8 text-success"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M20 6 9 17l-5-5" />
        </svg>
      </div>
      <h1 className="mt-6 text-3xl font-bold text-frost">رزرو شما نهایی شد! 🎉</h1>
      <p className="mt-4 leading-8 text-pale/85">
        پرداخت با موفقیت انجام شد و وقت مشاوره‌ات رزرو شد. جزئیات جلسه را در پنل
        کاربری می‌بینی. قبل از جلسه، لیست داروهایت را آماده داشته باش.
      </p>
      <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
        <Link
          href="/dashboard"
          className="rounded-xl bg-primary px-6 py-3 text-sm font-medium text-frost transition-colors hover:bg-accent"
        >
          مشاهده رزروها
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
