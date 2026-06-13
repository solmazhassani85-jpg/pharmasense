import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, getCurrentUser } from "@/lib/supabase/server";
import { isDemo, getDemoBookingsUser } from "@/lib/demo";

type BookingItem = {
  id: string;
  status: string;
  title: string;
  startsAt: string | null;
};

export const metadata: Metadata = { title: "پنل من" };

const statusLabel: Record<string, { text: string; cls: string }> = {
  pending: { text: "در انتظار پرداخت", cls: "bg-warning/15 text-warning" },
  paid: { text: "پرداخت‌شده", cls: "bg-success/15 text-success" },
  completed: { text: "انجام‌شده", cls: "bg-accent/15 text-accent" },
  cancelled: { text: "لغوشده", cls: "bg-danger/15 text-danger" },
};

export default async function DashboardPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?redirect=/dashboard");

  // جمع‌آوری رزروها به یک شکل یکدست
  let items: BookingItem[] = [];
  if (isDemo()) {
    items = getDemoBookingsUser().map((b) => ({
      id: b.id,
      status: b.status,
      title: b.serviceTitle,
      startsAt: b.slotStartsAt,
    }));
  } else {
    const supabase = await createClient();
    const { data: bookings } = await supabase
      .from("bookings")
      .select(
        "id, status, amount, currency, created_at, services(title), time_slots(starts_at)",
      )
      .order("created_at", { ascending: false });
    items = (bookings ?? []).map((b) => {
      const slotRel = b.time_slots as unknown;
      const slot = (Array.isArray(slotRel) ? slotRel[0] : slotRel) as
        | { starts_at: string }
        | undefined;
      const serviceRel = b.services as unknown;
      const service = (
        Array.isArray(serviceRel) ? serviceRel[0] : serviceRel
      ) as { title: string } | undefined;
      return {
        id: b.id as string,
        status: b.status as string,
        title: service?.title ?? "مشاوره دارویی",
        startsAt: slot?.starts_at ?? null,
      };
    });
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-frost">پنل من</h1>
          <p className="mt-1 text-sm text-pale/70">{user.email}</p>
        </div>
        <Link
          href="/booking"
          className="rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-frost transition-colors hover:bg-accent"
        >
          رزرو مشاوره جدید
        </Link>
      </div>

      <h2 className="mb-4 mt-10 text-xl font-bold text-frost">رزروهای من</h2>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-white/15 bg-white/[0.03] p-10 text-center">
          <p className="text-pale/70">هنوز رزروی نداری.</p>
          <Link
            href="/booking"
            className="mt-4 inline-block text-sm text-accent hover:underline"
          >
            اولین مشاوره‌ات را رزرو کن ←
          </Link>
        </div>
      ) : (
        <ul className="space-y-3">
          {items.map((b) => {
            const s = statusLabel[b.status] ?? statusLabel.pending;
            return (
              <li
                key={b.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 p-5"
              >
                <div>
                  <p className="font-semibold text-frost">{b.title}</p>
                  <p className="mt-1 text-sm text-pale/70">
                    {b.startsAt
                      ? new Date(b.startsAt).toLocaleString("fa-IR", {
                          dateStyle: "full",
                          timeStyle: "short",
                        })
                      : "زمان نامشخص"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${s.cls}`}
                >
                  {s.text}
                </span>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
