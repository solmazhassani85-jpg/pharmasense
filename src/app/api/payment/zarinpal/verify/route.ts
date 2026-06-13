import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { zarinpalVerify } from "@/lib/payments/zarinpal";

function siteUrl(request: Request) {
  return process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin;
}

// بازگشت کاربر از درگاه زرین‌پال — تأیید نهایی و به‌روزرسانی رزرو.
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookingId = searchParams.get("booking_id");
  const authority = searchParams.get("Authority");
  const status = searchParams.get("Status");
  const base = siteUrl(request);

  if (!bookingId) {
    return NextResponse.redirect(`${base}/booking/cancel`);
  }

  const admin = createAdminClient();
  const { data: booking } = await admin
    .from("bookings")
    .select("id, amount, slot_id, status, payment_ref")
    .eq("id", bookingId)
    .single();

  if (!booking) {
    return NextResponse.redirect(`${base}/booking/cancel?booking_id=${bookingId}`);
  }

  // اگر قبلاً پرداخت تأیید شده، مستقیم به صفحه موفقیت
  if (booking.status === "paid") {
    return NextResponse.redirect(`${base}/booking/success?booking_id=${bookingId}`);
  }

  async function fail() {
    // آزادسازی اسلات و لغو رزرو
    if (booking?.slot_id) {
      await admin
        .from("time_slots")
        .update({ is_booked: false })
        .eq("id", booking.slot_id);
    }
    await admin
      .from("bookings")
      .update({ status: "cancelled" })
      .eq("id", bookingId);
    return NextResponse.redirect(
      `${base}/booking/cancel?booking_id=${bookingId}`,
    );
  }

  // کاربر پرداخت را لغو کرده است
  if (status !== "OK" || !authority) {
    return fail();
  }

  const result = await zarinpalVerify({
    authority,
    amountRial: Number(booking.amount),
  });

  if (!result.ok) {
    return fail();
  }

  await admin
    .from("bookings")
    .update({ status: "paid", payment_ref: result.refId })
    .eq("id", bookingId);

  return NextResponse.redirect(
    `${base}/booking/success?booking_id=${bookingId}`,
  );
}
