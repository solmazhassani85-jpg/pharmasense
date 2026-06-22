import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient, getCurrentUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { getService } from "@/lib/brand";
import { isDemo, getDemoSlots } from "@/lib/demo";
import BookingForm from "@/components/BookingForm";

export const metadata: Metadata = { title: "رزرو مشاوره" };

type Slot = { id: string; starts_at: string; ends_at: string };

export default async function BookingPage({
  searchParams,
}: {
  searchParams: Promise<{ service?: string }>;
}) {
  const { service: serviceSlug = "consultation" } = await searchParams;

  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/booking?service=${serviceSlug}`)}`);
  }

  const service = getService(serviceSlug);
  if (!service || !service.available) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <div className="glass-card-premium rounded-3xl p-12">
          <h1 className="text-2xl font-bold text-frost">این خدمت هنوز فعال نیست</h1>
          <p className="mt-3 text-pale/70">فعلاً فقط مشاوره دارویی قابل رزرو است.</p>
          <Link href="/services" className="mt-6 inline-block text-accent transition-colors hover:text-sky">
            بازگشت به خدمات ←
          </Link>
        </div>
      </div>
    );
  }

  let slots: Slot[] = [];
  let dbReady = isSupabaseConfigured();

  if (isDemo()) {
    slots = getDemoSlots()
      .filter((s) => !s.is_booked)
      .map(({ id, starts_at, ends_at }) => ({ id, starts_at, ends_at }));
    return <BookingPageLayout service={service} slots={slots} dbReady={true} />;
  }

  if (dbReady) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("time_slots")
        .select("id, starts_at, ends_at")
        .eq("is_booked", false)
        .gt("starts_at", new Date().toISOString())
        .order("starts_at", { ascending: true })
        .limit(60);
      slots = data ?? [];
    } catch {
      dbReady = false;
    }
  }

  return <BookingPageLayout service={service} slots={slots} dbReady={dbReady} />;
}

function BookingPageLayout({
  service,
  slots,
  dbReady,
}: {
  service: ReturnType<typeof getService> & {};
  slots: Slot[];
  dbReady: boolean;
}) {
  return (
    <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6">
      {/* پس‌زمینه */}
      <div className="pointer-events-none absolute -right-20 -top-10 h-64 w-64 rounded-full bg-primary/20 blur-3xl" aria-hidden="true" />

      {/* هدر */}
      <div className="mb-10">
        <p className="eyebrow mb-2">رزرو مشاوره</p>
        <h1 className="text-3xl font-bold leading-tight text-frost">
          {service.title}
        </h1>
        <p className="mt-3 leading-8 text-pale/80">{service.description}</p>

        {/* خلاصه اطلاعات */}
        <div className="mt-6 flex flex-wrap gap-3">
          <span className="trust-badge">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <circle cx="12" cy="12" r="10" /><path d="M12 8v4l3 3" />
            </svg>
            {service.durationMin} دقیقه
          </span>
          <span className="trust-badge">
            <span className="status-dot status-safe" aria-hidden="true" />
            پرداخت امن
          </span>
          <span className="trust-badge">
            <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" />
            </svg>
            گزارش مکتوب بعد از جلسه
          </span>
        </div>
      </div>

      {/* فرم */}
      <BookingForm
        serviceSlug={service.slug}
        priceIRR={service.priceIRR}
        priceUSD={service.priceUSD}
        slots={slots}
        dbReady={dbReady}
      />
    </div>
  );
}
