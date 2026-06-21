import Link from "next/link";
import type { Service } from "@/lib/brand";
import { formatToman, formatUSD } from "@/lib/format";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="glass-card-premium group relative flex cursor-default flex-col overflow-hidden rounded-2xl">
      {/* نوار رنگی بالا برای خدمت فعال */}
      {service.available ? (
        <div className="h-[3px] w-full bg-gradient-to-r from-primary via-accent to-sky flex-shrink-0" />
      ) : (
        <div className="h-[3px] w-full bg-gradient-to-r from-white/5 to-white/10 flex-shrink-0" />
      )}

      <div className="flex flex-1 flex-col p-6">
        {/* بج وضعیت */}
        {!service.available && (
          <span className="mb-3 w-fit rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning ring-1 ring-warning/20">
            به‌زودی
          </span>
        )}
        {service.available && (
          <span className="mb-3 w-fit rounded-full bg-success/12 px-3 py-1 text-xs font-medium text-success ring-1 ring-success/20">
            فعال
          </span>
        )}

        <h3 className="text-xl font-bold text-frost">{service.title}</h3>
        <p className="mt-2 text-sm leading-7 text-pale/75">{service.short}</p>

        <ul className="mt-5 flex-1 space-y-2.5">
          {service.features.map((f) => (
            <li key={f} className="flex items-start gap-2.5 text-sm text-pale/85">
              <svg
                viewBox="0 0 24 24"
                className="mt-0.5 h-4 w-4 shrink-0 text-success"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M20 6 9 17l-5-5" />
              </svg>
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <div className="mt-7 border-t border-white/[0.07] pt-5">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <span className="block text-xs text-pale/45">مدت جلسه</span>
              <span className="font-mono text-sm text-pale">
                {service.durationMin} دقیقه
              </span>
            </div>
            {service.available && (
              <div className="text-left">
                <span className="stat-num block text-xl">
                  {formatToman(service.priceIRR)}
                </span>
                <span className="font-mono text-xs text-pale/40">
                  {formatUSD(service.priceUSD)} بین‌المللی
                </span>
              </div>
            )}
          </div>

          {service.available ? (
            <Link
              href={`/booking?service=${service.slug}`}
              className="block w-full rounded-xl bg-primary px-4 py-3.5 text-center text-sm font-medium text-frost shadow-lg shadow-primary/25 transition-all duration-200 hover:bg-accent hover:shadow-lg hover:shadow-accent/30"
            >
              رزرو این مشاوره
            </Link>
          ) : (
            <button
              disabled
              className="block w-full cursor-not-allowed rounded-xl border border-white/[0.08] px-4 py-3.5 text-center text-sm text-pale/30"
            >
              به‌زودی فعال می‌شود
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
