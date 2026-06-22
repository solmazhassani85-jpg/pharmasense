"use client";

import { useState } from "react";
import { formatToman, formatUSD } from "@/lib/format";

type Slot = { id: string; starts_at: string; ends_at: string };
type Provider = "zarinpal" | "stripe";

export default function BookingForm({
  serviceSlug,
  priceIRR,
  priceUSD,
  slots,
  dbReady,
}: {
  serviceSlug: string;
  priceIRR: number;
  priceUSD: number;
  slots: Slot[];
  dbReady: boolean;
}) {
  const [slotId, setSlotId] = useState<string>("");
  const [medications, setMedications] = useState("");
  const [note, setNote] = useState("");
  const [provider, setProvider] = useState<Provider>("zarinpal");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (!slotId) {
      setError("لطفاً یک زمان مشاوره انتخاب کن.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ serviceSlug, slotId, medications, note, provider }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "خطایی رخ داد.");
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در اتصال به درگاه.");
      setLoading(false);
    }
  }

  if (!dbReady) {
    return (
      <div className="glass-card-premium rounded-2xl border-warning/25 p-6 text-sm leading-7 text-warning">
        دیتابیس هنوز پیکربندی نشده است. پس از اتصال Supabase و افزودن
        زمان‌های مشاوره، این فرم فعال می‌شود.
      </div>
    );
  }

  const stepLabel = "text-sm font-semibold text-frost mb-3 flex items-center gap-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── مرحله ۱: انتخاب زمان ─────────────────────── */}
      <div className="glass-card-premium rounded-2xl p-6">
        <p className={stepLabel}>
          <span className="icon-glow flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-frost">۱</span>
          زمان مشاوره را انتخاب کن
        </p>

        {slots.length === 0 ? (
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 text-center text-sm text-pale/60">
            <svg viewBox="0 0 24 24" className="mx-auto mb-3 h-8 w-8 text-pale/30" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" aria-hidden="true">
              <rect width="18" height="18" x="3" y="4" rx="2" /><line x1="16" x2="16" y1="2" y2="6" /><line x1="8" x2="8" y1="2" y2="6" /><line x1="3" x2="21" y1="10" y2="10" />
            </svg>
            در حال حاضر زمان خالی‌ای ثبت نشده است.
            <br />
            از طریق اینستاگرام هماهنگ کن.
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {slots.map((slot) => {
              const d = new Date(slot.starts_at);
              const selected = slotId === slot.id;
              return (
                <button
                  type="button"
                  key={slot.id}
                  onClick={() => setSlotId(slot.id)}
                  className={`cursor-pointer rounded-xl border px-3 py-3 text-right text-sm transition-all ${
                    selected
                      ? "border-accent bg-accent/15 text-frost shadow-lg shadow-accent/20"
                      : "border-white/[0.1] bg-white/[0.03] text-pale/80 hover:border-accent/40 hover:bg-accent/[0.06]"
                  }`}
                >
                  <span className="block font-medium">
                    {d.toLocaleDateString("fa-IR", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-pale/55">
                    {d.toLocaleTimeString("fa-IR", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ── مرحله ۲: اطلاعات بالینی ─────────────────── */}
      <div className="glass-card-premium rounded-2xl p-6">
        <p className={stepLabel}>
          <span className="icon-glow flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-frost">۲</span>
          لیست داروها و توضیحات
        </p>
        <div className="space-y-4">
          <label className="block">
            <span className="mb-2 block text-sm text-pale/80">
              داروهایی که الان مصرف می‌کنی
            </span>
            <textarea
              value={medications}
              onChange={(e) => setMedications(e.target.value)}
              rows={3}
              placeholder="مثلاً: متفورمین ۵۰۰، آتورواستاتین ۲۰، آسپرین ۸۰…"
              className="w-full rounded-xl border border-white/[0.1] bg-navy-900/60 px-4 py-3 text-sm text-frost placeholder:text-pale/25 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
          </label>
          <label className="block">
            <span className="mb-2 block text-sm text-pale/80">
              سؤال یا توضیح
              <span className="mr-1 text-pale/40">(اختیاری)</span>
            </span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="هر نکته‌ای که فکر می‌کنی باید بدونم…"
              className="w-full rounded-xl border border-white/[0.1] bg-navy-900/60 px-4 py-3 text-sm text-frost placeholder:text-pale/25 transition-colors focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent/50"
            />
          </label>
        </div>
      </div>

      {/* ── مرحله ۳: روش پرداخت ─────────────────────── */}
      <div className="glass-card-premium rounded-2xl p-6">
        <p className={stepLabel}>
          <span className="icon-glow flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold text-frost">۳</span>
          روش پرداخت
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <ProviderOption
            active={provider === "zarinpal"}
            onClick={() => setProvider("zarinpal")}
            title="پرداخت داخل ایران"
            subtitle="زرین‌پال — کارت‌های شتاب"
            price={formatToman(priceIRR)}
          />
          <ProviderOption
            active={provider === "stripe"}
            onClick={() => setProvider("stripe")}
            title="پرداخت بین‌المللی"
            subtitle="Stripe — Visa / Mastercard"
            price={formatUSD(priceUSD)}
          />
        </div>
      </div>

      {/* خطا */}
      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          {error}
        </div>
      )}

      {/* دکمه پرداخت */}
      <button
        type="submit"
        disabled={loading || slots.length === 0}
        className="btn-glow w-full cursor-pointer rounded-xl bg-primary px-6 py-4 text-base font-medium text-frost shadow-lg shadow-primary/30 transition-all duration-200 hover:bg-accent disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <path d="M21 12a9 9 0 1 1-6.219-8.56" />
            </svg>
            در حال انتقال به درگاه…
          </span>
        ) : (
          "پرداخت و نهایی‌سازی رزرو"
        )}
      </button>

      <p className="text-center text-xs text-pale/45">
        با پرداخت، رزرو شما نهایی می‌شود و در پنل کاربری قابل مشاهده است.
      </p>
    </form>
  );
}

function ProviderOption({
  active,
  onClick,
  title,
  subtitle,
  price,
}: {
  active: boolean;
  onClick: () => void;
  title: string;
  subtitle: string;
  price: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex cursor-pointer items-center justify-between rounded-xl border px-4 py-4 text-right transition-all ${
        active
          ? "border-accent bg-accent/12 shadow-lg shadow-accent/10"
          : "border-white/[0.1] bg-white/[0.03] hover:border-accent/35 hover:bg-accent/[0.05]"
      }`}
    >
      <span>
        <span className="block text-sm font-medium text-frost">{title}</span>
        <span className="mt-0.5 block text-xs text-pale/55">{subtitle}</span>
      </span>
      <span className="stat-num text-base">{price}</span>
    </button>
  );
}
