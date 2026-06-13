// امضای بصری PharmaSense — «کارت بازبینی دارو»
// یک گزارش تداخلِ به‌سبک نسخه. ردیف‌های دارو لاتین/مونو (dir=ltr) هستند،
// و هر ردیف یک نقطه‌ی وضعیت دارد که از رنگ‌های وضعیتیِ برند استفاده می‌کند.
// انیمیشن ورود کاملاً CSS است و پشت prefers-reduced-motion گارد شده.

type Status = "safe" | "caution";

const rows: {
  drug: string;
  dose: string;
  status: Status;
  label: string;
  note?: string;
}[] = [
  { drug: "Metformin", dose: "500mg · 2×/day", status: "safe", label: "ایمن" },
  {
    drug: "Atorvastatin",
    dose: "20mg · 1×/night",
    status: "safe",
    label: "ایمن",
  },
  {
    drug: "Warfarin",
    dose: "5mg · 1×/day",
    status: "caution",
    label: "احتیاط",
    note: "تداخل با مکمل",
  },
  { drug: "Aspirin", dose: "80mg · 1×/day", status: "safe", label: "ایمن" },
];

export default function MedicationCard() {
  return (
    <div className="lift relative rounded-2xl border border-white/10 bg-navy-800/70 p-1 shadow-2xl shadow-navy-900/60 backdrop-blur">
      <div className="rounded-xl bg-navy-900/80 p-5 sm:p-6">
        {/* سربرگِ نسخه */}
        <div className="flex items-center justify-between gap-3 border-b border-white/10 pb-4">
          <div>
            <p className="eyebrow">RX · بررسی تداخل</p>
            <p className="mt-1.5 text-sm font-semibold text-frost">
              گزارش بازبینی دارو
            </p>
          </div>
          <span className="rounded-lg bg-success/15 px-2.5 py-1 font-mono text-xs text-success">
            ۴ قلم
          </span>
        </div>

        {/* ردیف‌های دارو — مثل یک پرینتِ نسخه، لاتین/مونو */}
        <ul dir="ltr" className="mt-4 space-y-1">
          {rows.map((r, i) => (
            <li
              key={r.drug}
              className={`animate-rise stagger-${i + 1} grid grid-cols-[1fr_auto] items-center gap-2 rounded-lg px-2 py-2.5 ${
                r.status === "caution" ? "bg-warning/10" : "hover:bg-white/5"
              }`}
            >
              <div className="min-w-0">
                <span className="font-mono text-sm text-frost">{r.drug}</span>
                <span className="mr-2 font-mono text-xs text-pale/50">
                  {r.dose}
                </span>
              </div>
              <div
                dir="rtl"
                className="flex items-center gap-2 justify-self-end"
              >
                <span
                  className={`status-dot ${
                    r.status === "caution"
                      ? "status-caution pulse-once"
                      : "status-safe"
                  }`}
                  aria-hidden="true"
                />
                <span
                  className={`text-xs ${
                    r.status === "caution" ? "text-warning" : "text-success"
                  }`}
                >
                  {r.label}
                </span>
              </div>
              {r.note && (
                <p
                  dir="rtl"
                  className="col-span-2 mt-0.5 text-xs text-warning/90"
                >
                  ← {r.note}؛ در جلسه با هم حلش می‌کنیم.
                </p>
              )}
            </li>
          ))}
        </ul>

        {/* راهنمای رنگ‌ها + caption */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/10 pt-4">
          <Legend cls="status-safe" text="ایمن" />
          <Legend cls="status-caution" text="احتیاط" />
          <Legend cls="status-danger" text="خطر" />
        </div>
        <p className="mt-3 text-xs leading-6 text-pale/60">
          این چیزیه که بعد جلسه می‌گیری — یک گزارش شخصی، نه اطلاعات عمومی.
        </p>
      </div>
    </div>
  );
}

function Legend({ cls, text }: { cls: string; text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span className={`status-dot ${cls}`} aria-hidden="true" />
      <span className="text-xs text-pale/70">{text}</span>
    </span>
  );
}
