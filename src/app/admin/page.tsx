import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { isDemo, getDemoStats } from "@/lib/demo";
import { formatToman, formatUSD } from "@/lib/format";

export default async function AdminOverviewPage() {
  let totalBookings = 0;
  let paidCount = 0;
  let freeSlots = 0;
  let revenueIRR = 0;
  let revenueUSD = 0;

  if (isDemo()) {
    const d = getDemoStats();
    totalBookings = d.totalBookings;
    paidCount = d.paidCount;
    freeSlots = d.freeSlots;
    revenueIRR = d.revenueIRR;
    revenueUSD = d.revenueUSD;
  } else {
    if (!isSupabaseConfigured()) {
      return (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-6 text-sm leading-7 text-warning">
          دیتابیس هنوز پیکربندی نشده است. پس از اتصال Supabase، آمار اینجا نمایش
          داده می‌شود.
        </div>
      );
    }

    const admin = createAdminClient();
    const [bRes, pRes, sRes, paidRes] = await Promise.all([
      admin.from("bookings").select("id", { count: "exact", head: true }),
      admin
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "paid"),
      admin
        .from("time_slots")
        .select("id", { count: "exact", head: true })
        .eq("is_booked", false)
        .gt("starts_at", new Date().toISOString()),
      admin.from("bookings").select("amount, currency").eq("status", "paid"),
    ]);
    totalBookings = bRes.count ?? 0;
    paidCount = pRes.count ?? 0;
    freeSlots = sRes.count ?? 0;
    for (const b of paidRes.data ?? []) {
      if (b.currency === "IRR") revenueIRR += Number(b.amount ?? 0);
      else if (b.currency === "USD") revenueUSD += Number(b.amount ?? 0);
    }
  }

  const stats = [
    { label: "کل رزروها", value: (totalBookings ?? 0).toLocaleString("fa-IR") },
    { label: "رزروهای پرداخت‌شده", value: (paidCount ?? 0).toLocaleString("fa-IR") },
    { label: "زمان‌های خالی آینده", value: (freeSlots ?? 0).toLocaleString("fa-IR") },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-bold text-frost">داشبورد</h1>

      <div className="grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-white/10 bg-white/5 p-6"
          >
            <p className="text-sm text-pale/70">{s.label}</p>
            <p className="mt-2 text-3xl font-bold text-frost">{s.value}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-pale/70">درآمد ریالی (پرداخت‌شده)</p>
          <p className="mt-2 text-2xl font-bold text-success">
            {formatToman(revenueIRR)}
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <p className="text-sm text-pale/70">درآمد دلاری (پرداخت‌شده)</p>
          <p className="mt-2 text-2xl font-bold text-success">
            {formatUSD(revenueUSD)}
          </p>
        </div>
      </div>

      <div className="flex flex-wrap gap-3">
        <Link
          href="/admin/slots"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-frost transition-colors hover:bg-accent"
        >
          مدیریت زمان‌ها
        </Link>
        <Link
          href="/admin/bookings"
          className="rounded-xl border border-white/15 px-5 py-2.5 text-sm text-pale transition-colors hover:bg-white/5"
        >
          مشاهده رزروها
        </Link>
      </div>
    </div>
  );
}
