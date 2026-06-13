"use server";

import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/auth";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemo } from "@/lib/demo";

export type ActionResult = { ok: boolean; message: string };

const DEMO_MSG = "🔵 حالت دمو — تغییرات ذخیره نمی‌شوند. برای ذخیره‌ی واقعی Supabase را وصل کن.";

// ── افزودن زمان تکی ───────────────────────────────────────────
export async function addSlot(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  if (isDemo()) return { ok: false, message: DEMO_MSG };
  const date = String(formData.get("date") ?? "");
  const time = String(formData.get("time") ?? "");
  const durationMin = Number(formData.get("duration") ?? 45);

  if (!date || !time) {
    return { ok: false, message: "تاریخ و ساعت را وارد کن." };
  }

  // ورودی به‌صورت زمان محلی مرورگرِ ادمین تفسیر می‌شود (datetime-local).
  const startsAt = new Date(`${date}T${time}`);
  if (isNaN(startsAt.getTime())) {
    return { ok: false, message: "تاریخ/ساعت نامعتبر است." };
  }
  if (startsAt.getTime() < Date.now()) {
    return { ok: false, message: "زمان باید در آینده باشد." };
  }
  const endsAt = new Date(startsAt.getTime() + durationMin * 60_000);

  const admin = createAdminClient();
  const { error } = await admin.from("time_slots").insert({
    starts_at: startsAt.toISOString(),
    ends_at: endsAt.toISOString(),
  });

  if (error) {
    if (error.code === "23505") {
      return { ok: false, message: "این زمان از قبل ثبت شده است." };
    }
    return { ok: false, message: "ثبت زمان ناموفق بود." };
  }

  revalidatePath("/admin/slots");
  revalidatePath("/booking");
  return { ok: true, message: "زمان اضافه شد." };
}

// ── تولید بازه‌ای زمان‌ها ──────────────────────────────────────
export async function generateSlots(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  if (isDemo()) return { ok: false, message: DEMO_MSG };
  const fromDate = String(formData.get("fromDate") ?? "");
  const toDate = String(formData.get("toDate") ?? "");
  const startHour = Number(formData.get("startHour") ?? 10);
  const endHour = Number(formData.get("endHour") ?? 17);
  const durationMin = Number(formData.get("duration") ?? 45);
  const skipWeekend = formData.get("skipWeekend") === "on";

  if (!fromDate || !toDate) {
    return { ok: false, message: "بازه‌ی تاریخ را مشخص کن." };
  }
  const start = new Date(`${fromDate}T00:00`);
  const end = new Date(`${toDate}T00:00`);
  if (isNaN(start.getTime()) || isNaN(end.getTime()) || end < start) {
    return { ok: false, message: "بازه‌ی تاریخ نامعتبر است." };
  }
  if (endHour <= startHour) {
    return { ok: false, message: "ساعت پایان باید بعد از ساعت شروع باشد." };
  }

  const rows: { starts_at: string; ends_at: string }[] = [];
  const now = Date.now();
  const cursor = new Date(start);
  let guard = 0;
  while (cursor <= end && guard < 400) {
    guard++;
    const day = cursor.getDay(); // 0=یکشنبه … 4=پنجشنبه، 5=جمعه
    // در ایران تعطیلات پنجشنبه(4) و جمعه(5)
    const isWeekend = day === 4 || day === 5;
    if (!skipWeekend || !isWeekend) {
      for (let h = startHour; h < endHour; h++) {
        const s = new Date(cursor);
        s.setHours(h, 0, 0, 0);
        if (s.getTime() > now) {
          rows.push({
            starts_at: s.toISOString(),
            ends_at: new Date(s.getTime() + durationMin * 60_000).toISOString(),
          });
        }
      }
    }
    cursor.setDate(cursor.getDate() + 1);
  }

  if (rows.length === 0) {
    return { ok: false, message: "هیچ زمانی برای ساخت پیدا نشد." };
  }

  const admin = createAdminClient();
  // تداخل با زمان‌های موجود نادیده گرفته می‌شود (unique بر starts_at)
  const { error, count } = await admin
    .from("time_slots")
    .upsert(rows, { onConflict: "starts_at", ignoreDuplicates: true, count: "exact" });

  if (error) {
    return { ok: false, message: "تولید زمان‌ها ناموفق بود." };
  }

  revalidatePath("/admin/slots");
  revalidatePath("/booking");
  return {
    ok: true,
    message: `${count ?? rows.length} زمان ساخته شد (موارد تکراری نادیده گرفته شد).`,
  };
}

// ── حذف زمان رزرونشده ─────────────────────────────────────────
export async function deleteSlot(formData: FormData): Promise<ActionResult> {
  await requireAdmin();
  if (isDemo()) return { ok: false, message: DEMO_MSG };
  const id = String(formData.get("id") ?? "");
  if (!id) return { ok: false, message: "شناسه نامعتبر." };

  const admin = createAdminClient();
  const { data: slot } = await admin
    .from("time_slots")
    .select("is_booked")
    .eq("id", id)
    .single();

  if (slot?.is_booked) {
    return { ok: false, message: "این زمان رزرو شده و قابل حذف نیست." };
  }

  const { error } = await admin.from("time_slots").delete().eq("id", id);
  if (error) return { ok: false, message: "حذف ناموفق بود." };

  revalidatePath("/admin/slots");
  revalidatePath("/booking");
  return { ok: true, message: "زمان حذف شد." };
}

// ── تغییر وضعیت رزرو ──────────────────────────────────────────
export async function setBookingStatus(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  if (isDemo()) return { ok: false, message: DEMO_MSG };
  const id = String(formData.get("id") ?? "");
  const status = String(formData.get("status") ?? "");
  if (!id || !["completed", "cancelled"].includes(status)) {
    return { ok: false, message: "درخواست نامعتبر." };
  }

  const admin = createAdminClient();

  // هنگام لغو، اسلات مربوطه آزاد می‌شود
  if (status === "cancelled") {
    const { data: booking } = await admin
      .from("bookings")
      .select("slot_id")
      .eq("id", id)
      .single();
    if (booking?.slot_id) {
      await admin
        .from("time_slots")
        .update({ is_booked: false })
        .eq("id", booking.slot_id);
    }
  }

  const { error } = await admin
    .from("bookings")
    .update({ status })
    .eq("id", id);

  if (error) return { ok: false, message: "به‌روزرسانی ناموفق بود." };

  revalidatePath("/admin/bookings");
  revalidatePath("/admin");
  return { ok: true, message: "وضعیت رزرو به‌روزرسانی شد." };
}

// ── به‌روزرسانی خدمت ──────────────────────────────────────────
export async function updateService(
  formData: FormData,
): Promise<ActionResult> {
  await requireAdmin();
  if (isDemo()) return { ok: false, message: DEMO_MSG };
  const id = String(formData.get("id") ?? "");
  const title = String(formData.get("title") ?? "").trim();
  const priceIrr = Number(formData.get("price_irr") ?? 0);
  const priceUsd = Number(formData.get("price_usd") ?? 0);
  const durationMin = Number(formData.get("duration_min") ?? 45);
  const isActive = formData.get("is_active") === "on";

  if (!id || !title) {
    return { ok: false, message: "عنوان خدمت را وارد کن." };
  }
  if (priceIrr < 0 || priceUsd < 0 || durationMin <= 0) {
    return { ok: false, message: "مقادیر قیمت/مدت نامعتبر است." };
  }

  const admin = createAdminClient();
  const { error } = await admin
    .from("services")
    .update({
      title,
      price_irr: priceIrr,
      price_usd: priceUsd,
      duration_min: durationMin,
      is_active: isActive,
    })
    .eq("id", id);

  if (error) return { ok: false, message: "به‌روزرسانی خدمت ناموفق بود." };

  revalidatePath("/admin/services");
  revalidatePath("/services");
  revalidatePath("/");
  return { ok: true, message: "خدمت به‌روزرسانی شد." };
}
