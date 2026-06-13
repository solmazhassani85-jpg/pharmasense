import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { isDemo, getDemoBookingsAdmin } from "@/lib/demo";
import InlineAction from "@/components/admin/InlineAction";
import { setBookingStatus } from "../actions";

export const metadata = { title: "رزروها" };

const statusLabel: Record<string, { text: string; cls: string }> = {
  pending: { text: "در انتظار پرداخت", cls: "bg-warning/15 text-warning" },
  paid: { text: "پرداخت‌شده", cls: "bg-success/15 text-success" },
  completed: { text: "انجام‌شده", cls: "bg-accent/15 text-accent" },
  cancelled: { text: "لغوشده", cls: "bg-danger/15 text-danger" },
};

function first<T>(rel: unknown): T | undefined {
  return (Array.isArray(rel) ? rel[0] : rel) as T | undefined;
}

// نمای یکدستِ رزرو برای رندر (هم دمو، هم Supabase)
type BookingView = {
  id: string;
  status: string;
  userName: string;
  userEmail: string | null;
  userPhone: string | null;
  serviceTitle: string;
  slotStartsAt: string | null;
  amount: number;
  currency: string;
  provider: string | null;
  medications: string | null;
  note: string | null;
  createdAt: string;
};

type Profile = { full_name: string | null; email: string | null; phone: string | null };

export default async function AdminBookingsPage() {
  let view: BookingView[] = [];

  if (isDemo()) {
    view = getDemoBookingsAdmin().map((b) => ({
      id: b.id,
      status: b.status,
      userName: b.userName,
      userEmail: b.userEmail,
      userPhone: b.userPhone,
      serviceTitle: b.serviceTitle,
      slotStartsAt: b.slotStartsAt,
      amount: b.amount,
      currency: b.currency,
      provider: b.provider,
      medications: b.medications,
      note: b.note,
      createdAt: b.created_at,
    }));
  } else {
    if (!isSupabaseConfigured()) {
      return (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-6 text-sm text-warning">
          دیتابیس هنوز پیکربندی نشده است.
        </div>
      );
    }

    const admin = createAdminClient();
    const { data: bookings } = await admin
      .from("bookings")
      .select(
        "id, status, amount, currency, provider, medications, note, created_at, user_id, services(title), time_slots(starts_at)",
      )
      .order("created_at", { ascending: false })
      .limit(200);
    const rows = bookings ?? [];

    // اتصال دستی پروفایل‌ها (چون bookings→profiles رابطه‌ی FK مستقیم ندارد)
    const userIds = [...new Set(rows.map((b) => b.user_id))];
    const profileMap = new Map<string, Profile>();
    if (userIds.length > 0) {
      const { data: profiles } = await admin
        .from("profiles")
        .select("id, full_name, email, phone")
        .in("id", userIds);
      for (const p of profiles ?? []) {
        profileMap.set(p.id as string, p as Profile);
      }
    }

    view = rows.map((b) => {
      const profile = profileMap.get(b.user_id);
      const service = first<{ title: string }>(b.services);
      const slot = first<{ starts_at: string }>(b.time_slots);
      return {
        id: b.id as string,
        status: b.status as string,
        userName: profile?.full_name || "کاربر بدون نام",
        userEmail: profile?.email ?? null,
        userPhone: profile?.phone ?? null,
        serviceTitle: service?.title ?? "—",
        slotStartsAt: slot?.starts_at ?? null,
        amount: Number(b.amount ?? 0),
        currency: (b.currency as string) ?? "IRR",
        provider: (b.provider as string) ?? null,
        medications: (b.medications as string) ?? null,
        note: (b.note as string) ?? null,
        createdAt: b.created_at as string,
      };
    });
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-frost">
        رزروها ({view.length.toLocaleString("fa-IR")})
      </h1>

      {view.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-pale/70">
          هنوز رزروی ثبت نشده است.
        </p>
      ) : (
        <ul className="space-y-3">
          {view.map((b) => {
            const s = statusLabel[b.status] ?? statusLabel.pending;
            const showActions = b.status === "pending" || b.status === "paid";
            const amount =
              b.currency === "IRR"
                ? `${b.amount.toLocaleString("fa-IR")} ریال`
                : `$${b.amount.toLocaleString("en-US")}`;
            return (
              <li
                key={b.id}
                className="rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-semibold text-frost">{b.userName}</p>
                    <p className="font-mono text-xs text-pale/60" dir="ltr">
                      {b.userEmail ?? "—"}
                      {b.userPhone ? ` · ${b.userPhone}` : ""}
                    </p>
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-medium ${s.cls}`}
                  >
                    {s.text}
                  </span>
                </div>

                <dl className="mt-4 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
                  <Row label="خدمت" value={b.serviceTitle} />
                  <Row
                    label="زمان جلسه"
                    value={
                      b.slotStartsAt
                        ? new Date(b.slotStartsAt).toLocaleString("fa-IR", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })
                        : "—"
                    }
                  />
                  <Row label="مبلغ" value={`${amount} (${b.provider ?? "—"})`} />
                  <Row
                    label="تاریخ ثبت"
                    value={new Date(b.createdAt).toLocaleDateString("fa-IR")}
                  />
                </dl>

                {b.medications && (
                  <div className="mt-3 rounded-lg bg-navy-900/50 p-3">
                    <p className="text-xs text-pale/50">لیست داروها</p>
                    <p className="mt-1 text-sm text-pale/90">{b.medications}</p>
                  </div>
                )}
                {b.note && (
                  <div className="mt-2 rounded-lg bg-navy-900/50 p-3">
                    <p className="text-xs text-pale/50">توضیح کاربر</p>
                    <p className="mt-1 text-sm text-pale/90">{b.note}</p>
                  </div>
                )}

                {showActions && (
                  <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
                    <InlineAction
                      action={setBookingStatus}
                      fields={{ id: b.id, status: "completed" }}
                      label="علامت‌گذاری انجام‌شده"
                      variant="success"
                    />
                    <InlineAction
                      action={setBookingStatus}
                      fields={{ id: b.id, status: "cancelled" }}
                      label="لغو رزرو"
                      variant="danger"
                    />
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-2">
      <dt className="text-pale/50">{label}:</dt>
      <dd className="text-pale/90">{value}</dd>
    </div>
  );
}
