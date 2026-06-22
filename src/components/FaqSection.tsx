"use client";

import { useState } from "react";
import RevealSection from "./RevealSection";

const faqs = [
  {
    q: "جلسه چقدر طول می‌کشه؟",
    a: "هر جلسه ۴۵ دقیقه‌ست. این زمان کافیه که لیست داروهات رو کامل بررسی کنیم، تداخلات رو چک کنیم و یه برنامه واضح برات بنویسیم.",
  },
  {
    q: "جلسه آنلاینه یا حضوری؟",
    a: "کاملاً آنلاینه — از طریق ویدیوکال. هر جایی که باشی، ایران یا خارج، می‌تونیم جلسه داشته باشیم.",
  },
  {
    q: "بعد از جلسه چی می‌گیرم؟",
    a: "یه گزارش مکتوب شخصی دریافت می‌کنی که توش نتیجه بررسی داروها، تداخلات مهم، دوزبندی پیشنهادی و نکاتی که باید بدونی نوشته شده.",
  },
  {
    q: "اگه بعد از جلسه سوال داشتم چی؟",
    a: "تا ۴۸ ساعت بعد از جلسه می‌تونی سوالات کوتاه رو از طریق پیام ارسال کنی و پاسخ می‌گیری.",
  },
  {
    q: "پرداخت چطوره؟",
    a: "دو درگاه داری: زرین‌پال برای کارت‌های شتاب داخل ایران، و Stripe برای کارت‌های Visa و Mastercard بین‌المللی.",
  },
  {
    q: "آیا این مشاوره جایگزین پزشک می‌شه؟",
    a: "نه. من داروهات رو بررسی می‌کنم و راهنمایی دارویی می‌دم — اما تشخیص بیماری و تجویز دارو کار پزشکه. این دو مکمل هم هستن.",
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <RevealSection>
        <p className="eyebrow mb-2">سوالات متداول</p>
        <h2 className="mb-10 text-3xl font-bold text-frost">
          جواب سوالاتت اینجاست
        </h2>
      </RevealSection>

      <div className="space-y-3">
        {faqs.map((faq, i) => (
          <RevealSection key={i} delay={i * 60}>
            <div className="glass-card overflow-hidden rounded-2xl">
              <button
                type="button"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
                className="flex w-full cursor-pointer items-center justify-between gap-4 px-6 py-4 text-right transition-colors hover:bg-white/[0.03]"
              >
                <span className="text-base font-semibold text-frost">
                  {faq.q}
                </span>
                <span
                  className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-white/[0.12] text-pale/60 transition-all duration-300 ${
                    open === i
                      ? "rotate-45 border-accent/40 bg-accent/10 text-accent"
                      : ""
                  }`}
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  open === i ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <p className="px-6 pb-5 text-sm leading-7 text-pale/80">
                  {faq.a}
                </p>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}
