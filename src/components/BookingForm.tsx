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
        body: JSON.stringify({
          serviceSlug,
          slotId,
          medications,
          note,
          provider,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error ?? "خطایی رخ داد.");
      }
      // هدایت به درگاه پرداخت
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : "خطا در اتصال به درگاه.");
      setLoading(false);
    }
  }

  if (!dbReady) {
    return (
      <div className="mt-8 rounded-2xl border border-warning/30 bg-warning/10 p-6 text-sm leading-7 text-warning">
        دیتابیس هنوز پیکربندی نشده است. پس از اتصال Supabase و افزودن زمان‌های
        مشاوره، این فرم فعال می‌شود.
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="mt-10 space-y-8">
      {/* انتخاب زمان */}
      <fieldset>
        <legend className="mb-3 text-lg font-semibold text-frost">
          ۱) زمان مشاوره را انتخاب کن
        </legend>
        {slots.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-pale/70">
            در حال حاضر زمان خالی‌ای ثبت نشده است. لطفاً بعداً سر بزن یا از طریق
            اینستاگرام هماهنگ کن.
          </p>
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
                  className={`rounded-xl border px-3 py-3 text-right text-sm transition-colors ${
                    selected
                      ? "border-accent bg-accent/15 text-frost"
                      : "border-white/10 bg-white/5 text-pale/85 hover:border-accent/40"
                  }`}
                >
                  <span className="block font-medium">
                    {d.toLocaleDateString("fa-IR", {
                      weekday: "short",
                      day: "numeric",
                      month: "long",
                    })}
                  </span>
                  <span className="mt-1 block font-mono text-xs text-pale/60">
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
      </fieldset>

      {/* اطلاعات بالینی */}
      <fieldset className="space-y-4">
        <legend className="mb-1 text-lg font-semibold text-frost">
          ۲) لیست داروها و توضیحات
        </legend>
        <label className="block">
          <span className="mb-1.5 block text-sm text-pale/90">
            داروهایی که الان مصرف می‌کنی
          </span>
          <textarea
            value={medications}
            onChange={(e) => setMedications(e.target.value)}
            rows={3}
            placeholder="مثلاً: متفورمین ۵۰۰، آتورواستاتین ۲۰، آسپرین ۸۰…"
            className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-frost placeholder:text-pale/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </label>
        <label className="block">
          <span className="mb-1.5 block text-sm text-pale/90">
            سؤال یا توضیح (اختیاری)
          </span>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={2}
            placeholder="هر نکته‌ای که فکر می‌کنی باید بدونم…"
            className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-frost placeholder:text-pale/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
          />
        </label>
      </fieldset>

      {/* انتخاب درگاه */}
      <fieldset>
        <legend className="mb-3 text-lg font-semibold text-frost">
          ۳) روش پرداخت
        </legend>
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
            subtitle="Stripe — کارت‌های Visa / Mastercard"
            price={formatUSD(priceUSD)}
          />
        </div>
      </fieldset>

      {error && (
        <p className="rounded-lg bg-danger/15 px-3 py-2 text-sm text-danger">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading || slots.length === 0}
        className="w-full rounded-xl bg-primary px-6 py-4 text-base font-medium text-frost shadow-lg shadow-primary/30 transition-colors hover:bg-accent disabled:opacity-60"
      >
        {loading ? "در حال انتقال به درگاه…" : "پرداخت و نهایی‌سازی رزرو"}
      </button>

      <p className="text-center text-xs text-pale/50">
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
      className={`flex items-center justify-between rounded-xl border px-4 py-4 text-right transition-colors ${
        active
          ? "border-accent bg-accent/15"
          : "border-white/10 bg-white/5 hover:border-accent/40"
      }`}
    >
      <span>
        <span className="block text-sm font-medium text-frost">{title}</span>
        <span className="mt-0.5 block text-xs text-pale/60">{subtitle}</span>
      </span>
      <span className="text-sm font-bold text-accent">{price}</span>
    </button>
  );
}
