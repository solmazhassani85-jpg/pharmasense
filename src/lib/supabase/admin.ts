import { createClient } from "@supabase/supabase-js";

// کلاینت ادمین با SERVICE_ROLE_KEY — RLS را دور می‌زند.
// فقط سمت سرور (route handlers) و برای عملیات مورد اعتماد مثل
// تأیید پرداخت و رزرو اسلات استفاده شود. هرگز در کلاینت import نشود.
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    throw new Error("Supabase admin env vars تنظیم نشده‌اند.");
  }
  return createClient(url, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
