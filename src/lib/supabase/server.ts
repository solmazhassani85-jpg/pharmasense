import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import type { User } from "@supabase/supabase-js";
import { isDemo, demoUser } from "@/lib/demo";

// کلاینت سمت سرور (Server Components / Route Handlers / Server Actions)
// در Next.js 16 تابع cookies() ناهمگام است.
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // فراخوانی از یک Server Component — نادیده می‌گیریم؛
            // به‌روزرسانی نشست توسط proxy.ts انجام می‌شود.
          }
        },
      },
    },
  );
}

// آیا متغیرهای محیطی Supabase تنظیم شده‌اند؟ (برای جلوگیری از کرش پیش از پیکربندی)
export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

// کاربر فعلی را برمی‌گرداند یا null (بدون پرتاب خطا حتی اگر Supabase تنظیم نشده باشد)
export async function getCurrentUser(): Promise<User | null> {
  // در حالت دمو، یک کاربر ساختگی برمی‌گردانیم تا همه‌ی صفحات باز شوند.
  if (isDemo()) {
    return { id: demoUser.id, email: demoUser.email } as unknown as User;
  }
  if (!isSupabaseConfigured()) return null;
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    return user;
  } catch {
    return null;
  }
}
