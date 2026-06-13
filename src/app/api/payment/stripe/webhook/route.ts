import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/payments/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// وب‌هوک Stripe — تأیید نهایی پرداخت سمت سرور.
// در Stripe Dashboard → Developers → Webhooks این آدرس را ثبت کنید:
//   {SITE_URL}/api/payment/stripe/webhook   (رویداد checkout.session.completed)
export async function POST(request: Request) {
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json(
      { error: "STRIPE_WEBHOOK_SECRET تنظیم نشده." },
      { status: 500 },
    );
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "بدون امضا." }, { status: 400 });
  }

  const rawBody = await request.text();
  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(rawBody, signature, secret);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "امضای نامعتبر";
    return NextResponse.json({ error: msg }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const bookingId = session.metadata?.booking_id;
    if (bookingId && session.payment_status === "paid") {
      const admin = createAdminClient();
      await admin
        .from("bookings")
        .update({
          status: "paid",
          payment_ref: String(session.payment_intent ?? session.id),
        })
        .eq("id", bookingId);
    }
  }

  return NextResponse.json({ received: true });
}
