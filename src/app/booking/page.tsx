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

  // نیاز به ورود
  const user = await getCurrentUser();
  if (!user) {
    redirect(`/login?redirect=${encodeURIComponent(`/booking?service=${serviceSlug}`)}`);
  }

  const service = getService(serviceSlug);
  if (!service || !service.available) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center sm:px-6">
        <h1 className="text-2xl font-bold text-frost">این خدمت هنوز فعال نیست</h1>
        <p className="mt-3 text-pale/70">
          فعلاً فقط مشاوره دارویی قابل رزرو است.
        </p>
        <Link href="/services" className="mt-6 inline-block text-accent hover:underline">
          بازگشت به خدمات ←
        </Link>
      </div>
    );
  }

  // اسلات‌های خالی آینده
  let slots: Slot[] = [];
  let dbReady = isSupabaseConfigured();

  // حالت دمو: زمان‌های نمونه
  if (isDemo()) {
    slots = getDemoSlots()
      .filter((s) => !s.is_booked)
      .map(({ id, starts_at, ends_at }) => ({ id, starts_at, ends_at }));
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
        <header>
          <h1 className="text-3xl font-bold text-frost">رزرو {service.title}</h1>
          <p className="mt-3 leading-8 text-pale/85">{service.description}</p>
        </header>
        <BookingForm
          serviceSlug={service.slug}
          priceIRR={service.priceIRR}
          priceUSD={service.priceUSD}
          slots={slots}
          dbReady={true}
        />
      </div>
    );
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

  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <header>
        <h1 className="text-3xl font-bold text-frost">رزرو {service.title}</h1>
        <p className="mt-3 leading-8 text-pale/85">{service.description}</p>
      </header>

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
