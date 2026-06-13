import Link from "next/link";
import type { Service } from "@/lib/brand";
import { formatToman, formatUSD } from "@/lib/format";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="lift group relative flex flex-col rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-accent/40 hover:bg-white/[0.07]">
      {!service.available && (
        <span className="absolute left-6 top-6 rounded-full bg-warning/15 px-3 py-1 text-xs font-medium text-warning">
          به‌زودی
        </span>
      )}

      <h3 className="text-xl font-bold text-frost">{service.title}</h3>
      <p className="mt-2 text-sm leading-7 text-pale/80">{service.short}</p>

      <ul className="mt-5 space-y-2.5">
        {service.features.map((f) => (
          <li key={f} className="flex items-start gap-2 text-sm text-pale/90">
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

      <div className="mt-6 flex items-end justify-between border-t border-white/10 pt-5">
        <div>
          <span className="block text-xs text-pale/50">مدت جلسه</span>
          <span className="font-mono text-sm text-pale">
            {service.durationMin} دقیقه
          </span>
        </div>
        {service.available && (
          <div className="text-left">
            <span className="block text-lg font-bold text-frost">
              {formatToman(service.priceIRR)}
            </span>
            <span className="font-mono text-xs text-pale/50">
              {formatUSD(service.priceUSD)} بین‌المللی
            </span>
          </div>
        )}
      </div>

      <div className="mt-6">
        {service.available ? (
          <Link
            href={`/booking?service=${service.slug}`}
            className="block w-full rounded-xl bg-primary px-4 py-3 text-center text-sm font-medium text-frost shadow-lg shadow-primary/30 transition-colors hover:bg-accent"
          >
            رزرو این مشاوره
          </Link>
        ) : (
          <button
            disabled
            className="block w-full cursor-not-allowed rounded-xl border border-white/10 px-4 py-3 text-center text-sm text-pale/40"
          >
            به‌زودی فعال می‌شود
          </button>
        )}
      </div>
    </div>
  );
}
