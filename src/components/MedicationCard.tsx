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
    <div className="lift relative rounded-2xl border border-white/[0.1] bg-gradient-to-br from-navy-800/80 to-navy-900/90 p-1 shadow-[0_20px_60px_rgba(2,26,51,0.7)] backdrop-blur-xl">
      <div className="rounded-xl bg-navy-900/85 p-5 sm:p-6">
        {/* سربرگِ نسخه */}
        <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
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
              className={`animate-rise stagger-${i + 1} grid grid-cols-[1fr_auto] items-center gap-2 rounded-xl px-2.5 py-2.5 ${
                r.status === "caution"
                  ? "bg-warning/[0.08]"
                  : "hover:bg-white/[0.04]"
              } transition-colors`}
            >
              <div className="min-w-0">
                <span className="font-mono text-sm font-medium text-frost">
                  {r.drug}
                </span>
                <span className="mr-2 font-mono text-xs text-pale/45">
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
                  className={`text-xs font-medium ${
                    r.status === "caution" ? "text-warning" : "text-success"
                  }`}
                >
                  {r.label}
                </span>
              </div>
              {r.note && (
                <p
                  dir="rtl"
                  className="col-span-2 mt-0.5 text-xs text-warning/85"
                >
                  ← {r.note}؛ در جلسه با هم حلش می‌کنیم.
                </p>
              )}
            </li>
          ))}
        </ul>

        {/* راهنمای رنگ‌ها + caption */}
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-white/[0.07] pt-4">
          <Legend cls="status-safe" text="ایمن" />
          <Legend cls="status-caution" text="احتیاط" />
          <Legend cls="status-danger" text="خطر" />
        </div>
        <p className="mt-3 text-xs leading-6 text-pale/50">
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
      <span className="text-xs text-pale/60">{text}</span>
    </span>
  );
}
