import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getStripe } from "@/lib/payments/stripe";
import { zarinpalRequest } from "@/lib/payments/zarinpal";
import { isDemo } from "@/lib/demo";

function siteUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
}

export async function POST(request: Request) {
  // حالت دمو: بدون پرداخت واقعی، مستقیم به صفحه‌ی موفقیت
  if (isDemo()) {
    return NextResponse.json({
      url: `${siteUrl(request)}/booking/success?demo=1`,
    });
  }

  // ۱) احراز هویت
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return NextResponse.json({ error: "ابتدا وارد شو." }, { status: 401 });
  }

  // ۲) ورودی
  let body: {
    serviceSlug?: string;
    slotId?: string;
    medications?: string;
    note?: string;
    provider?: "stripe" | "zarinpal";
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "ورودی نامعتبر." }, { status: 400 });
  }

  const { serviceSlug = "consultation", slotId, medications, note, provider } =
    body;

  if (!slotId || (provider !== "stripe" && provider !== "zarinpal")) {
    return NextResponse.json(
      { error: "زمان مشاوره و روش پرداخت را انتخاب کن." },
      { status: 400 },
    );
  }

  const admin = createAdminClient();

  // ۳) خدمت و قیمت معتبر را از دیتابیس می‌گیریم (نه از کلاینت)
  const { data: service } = await admin
    .from("services")
    .select("id, title, price_irr, price_usd, is_active")
    .eq("slug", serviceSlug)
    .single();

  if (!service || !service.is_active) {
    return NextResponse.json(
      { error: "این خدمت در دسترس نیست." },
      { status: 404 },
    );
  }

  // ۴) بررسی خالی بودن اسلات
  const { data: slot } = await admin
    .from("time_slots")
    .select("id, starts_at, is_booked")
    .eq("id", slotId)
    .single();

  if (!slot || slot.is_booked) {
    return NextResponse.json(
      { error: "این زمان دیگر در دسترس نیست؛ زمان دیگری انتخاب کن." },
      { status: 409 },
    );
  }

  const amount = provider === "zarinpal" ? service.price_irr : service.price_usd;
  const currency = provider === "zarinpal" ? "IRR" : "USD";

  // ۵) ساخت رزرو (در انتظار پرداخت) و رزرو موقت اسلات
  const { data: booking, error: bookingErr } = await admin
    .from("bookings")
    .insert({
      user_id: user.id,
      service_id: service.id,
      slot_id: slot.id,
      status: "pending",
      medications: medications ?? null,
      note: note ?? null,
      provider,
      amount,
      currency,
    })
    .select("id")
    .single();

  if (bookingErr || !booking) {
    return NextResponse.json(
      { error: "ساخت رزرو ناموفق بود." },
      { status: 500 },
    );
  }

  // اسلات را قفل می‌کنیم تا دو نفر هم‌زمان رزرو نکنند
  await admin.from("time_slots").update({ is_booked: true }).eq("id", slot.id);

  const base = siteUrl(request);

  // ۶) شروع پرداخت بر اساس درگاه انتخابی
  try {
    if (provider === "stripe") {
      const stripe = getStripe();
      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: service.title },
              unit_amount: Math.round(Number(service.price_usd) * 100),
            },
            quantity: 1,
          },
        ],
        customer_email: user.email ?? undefined,
        metadata: { booking_id: booking.id },
        success_url: `${base}/booking/success?booking_id=${booking.id}`,
        cancel_url: `${base}/booking/cancel?booking_id=${booking.id}`,
      });

      await admin
        .from("bookings")
        .update({ payment_ref: session.id })
        .eq("id", booking.id);

      return NextResponse.json({ url: session.url });
    }

    // زرین‌پال
    const result = await zarinpalRequest({
      amountRial: Number(service.price_irr),
      description: `${service.title} — PharmaSense`,
      callbackUrl: `${base}/api/payment/zarinpal/verify?booking_id=${booking.id}`,
      email: user.email ?? undefined,
    });

    if (!result.ok) {
      // در صورت خطا، اسلات را آزاد و رزرو را لغو می‌کنیم
      await admin.from("time_slots").update({ is_booked: false }).eq("id", slot.id);
      await admin
        .from("bookings")
        .update({ status: "cancelled" })
        .eq("id", booking.id);
      return NextResponse.json({ error: result.error }, { status: 502 });
    }

    await admin
      .from("bookings")
      .update({ payment_ref: result.authority })
      .eq("id", booking.id);

    return NextResponse.json({ url: result.paymentUrl });
  } catch (e) {
    await admin.from("time_slots").update({ is_booked: false }).eq("id", slot.id);
    await admin
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", booking.id);
    const msg = e instanceof Error ? e.message : "خطا در اتصال به درگاه پرداخت.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
