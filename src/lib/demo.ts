// ───────────────────────────────────────────────────────────────
//  حالت دمو — کل محصول بدون Supabase/پرداخت با دیتای نمونه کار می‌کند.
//  فعال‌سازی: NEXT_PUBLIC_DEMO_MODE=true (یا به‌صورت خودکار وقتی
//  Supabase پیکربندی نشده باشد). با افزودن کلیدهای واقعی، خاموش می‌شود.
// ───────────────────────────────────────────────────────────────

export function isDemo(): boolean {
  const flag = process.env.NEXT_PUBLIC_DEMO_MODE;
  if (flag === "true") return true;
  if (flag === "false") return false;
  // پیش‌فرض: اگر Supabase تنظیم نشده، دمو روشن است
  return !(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export const demoUser = {
  id: "00000000-0000-0000-0000-0000000000de",
  email: "demo@pharmasense.ir",
  full_name: "کاربر دمو",
};

export type DemoSlot = {
  id: string;
  starts_at: string;
  ends_at: string;
  is_booked: boolean;
};

// زمان‌های نمونه برای ۶ روز آینده (شنبه تا چهارشنبه، چند ساعت در روز)
export function getDemoSlots(): DemoSlot[] {
  const slots: DemoSlot[] = [];
  const now = new Date();
  let n = 1;
  for (let d = 1; d <= 7 && slots.length < 16; d++) {
    const day = new Date(now);
    day.setDate(now.getDate() + d);
    const dow = day.getDay(); // 4=پنجشنبه، 5=جمعه
    if (dow === 4 || dow === 5) continue;
    for (const h of [10, 11, 14, 16]) {
      const s = new Date(day);
      s.setHours(h, 0, 0, 0);
      slots.push({
        id: `demo-slot-${n}`,
        starts_at: s.toISOString(),
        ends_at: new Date(s.getTime() + 45 * 60000).toISOString(),
        is_booked: n % 6 === 0,
        // یکی‌دو تا رزروشده تا در پنل ادمین هم دیده شود
      });
      n++;
    }
  }
  return slots;
}

// شکل یکدستِ رزرو برای نمایش (هم پنل کاربری، هم ادمین)
export type DemoBooking = {
  id: string;
  status: "pending" | "paid" | "completed" | "cancelled";
  amount: number;
  currency: "IRR" | "USD";
  provider: "zarinpal" | "stripe";
  medications: string | null;
  note: string | null;
  created_at: string;
  serviceTitle: string;
  slotStartsAt: string;
  userName: string;
  userEmail: string;
  userPhone: string | null;
};

function daysFromNow(d: number): string {
  return new Date(Date.now() + d * 86400000).toISOString();
}

// همه‌ی رزروها (نمای ادمین)
export function getDemoBookingsAdmin(): DemoBooking[] {
  return [
    {
      id: "demo-b1",
      status: "paid",
      amount: 2_500_000,
      currency: "IRR",
      provider: "zarinpal",
      medications: "متفورمین ۵۰۰، آتورواستاتین ۲۰، آسپرین ۸۰",
      note: "صبح‌ها گاهی سرگیجه دارم؛ نگران تداخل هستم.",
      created_at: daysFromNow(-2),
      serviceTitle: "مشاوره دارویی شخصی",
      slotStartsAt: daysFromNow(2),
      userName: "نگار رضایی",
      userEmail: "negar@example.com",
      userPhone: "۰۹۱۲۱۲۳۴۵۶۷",
    },
    {
      id: "demo-b2",
      status: "completed",
      amount: 49,
      currency: "USD",
      provider: "stripe",
      medications: "Levothyroxine 100mcg, Omeprazole 20mg",
      note: null,
      created_at: daysFromNow(-9),
      serviceTitle: "مشاوره دارویی شخصی",
      slotStartsAt: daysFromNow(-3),
      userName: "Sara Ahmadi",
      userEmail: "sara.a@example.com",
      userPhone: null,
    },
    {
      id: "demo-b3",
      status: "pending",
      amount: 2_500_000,
      currency: "IRR",
      provider: "zarinpal",
      medications: "وارفارین ۵، دیگوکسین",
      note: "لطفاً تداخل وارفارین را بررسی کنید.",
      created_at: daysFromNow(-1),
      serviceTitle: "مشاوره دارویی شخصی",
      slotStartsAt: daysFromNow(4),
      userName: "محمد کریمی",
      userEmail: "m.karimi@example.com",
      userPhone: "۰۹۳۵۹۸۷۶۵۴۳",
    },
  ];
}

// رزروهای کاربرِ دمو (نمای پنل کاربری)
export function getDemoBookingsUser(): DemoBooking[] {
  return [
    {
      id: "demo-u1",
      status: "paid",
      amount: 2_500_000,
      currency: "IRR",
      provider: "zarinpal",
      medications: "متفورمین ۵۰۰، آتورواستاتین ۲۰",
      note: null,
      created_at: daysFromNow(-1),
      serviceTitle: "مشاوره دارویی شخصی",
      slotStartsAt: daysFromNow(3),
      userName: demoUser.full_name,
      userEmail: demoUser.email,
      userPhone: null,
    },
    {
      id: "demo-u2",
      status: "completed",
      amount: 2_500_000,
      currency: "IRR",
      provider: "zarinpal",
      medications: "ویتامین D، کلسیم",
      note: null,
      created_at: daysFromNow(-20),
      serviceTitle: "مشاوره دارویی شخصی",
      slotStartsAt: daysFromNow(-14),
      userName: demoUser.full_name,
      userEmail: demoUser.email,
      userPhone: null,
    },
  ];
}

export type DemoService = {
  id: string;
  slug: string;
  title: string;
  duration_min: number;
  price_irr: number;
  price_usd: number;
  is_active: boolean;
};

export function getDemoServices(): DemoService[] {
  return [
    {
      id: "demo-svc-1",
      slug: "consultation",
      title: "مشاوره دارویی شخصی",
      duration_min: 45,
      price_irr: 2_500_000,
      price_usd: 49,
      is_active: true,
    },
    {
      id: "demo-svc-2",
      slug: "webinar",
      title: "وبینار و کلاس آنلاین",
      duration_min: 90,
      price_irr: 0,
      price_usd: 0,
      is_active: false,
    },
  ];
}

export function getDemoStats() {
  const bookings = getDemoBookingsAdmin();
  const paid = bookings.filter((b) => b.status === "paid" || b.status === "completed");
  const revenueIRR = paid
    .filter((b) => b.currency === "IRR")
    .reduce((s, b) => s + b.amount, 0);
  const revenueUSD = paid
    .filter((b) => b.currency === "USD")
    .reduce((s, b) => s + b.amount, 0);
  const freeSlots = getDemoSlots().filter((s) => !s.is_booked).length;
  return {
    totalBookings: bookings.length,
    paidCount: paid.length,
    freeSlots,
    revenueIRR,
    revenueUSD,
  };
}
