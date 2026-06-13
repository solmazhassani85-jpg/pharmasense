import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getCurrentUser, isSupabaseConfigured } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { isDemo, demoUser } from "@/lib/demo";

export type AdminProfile = {
  full_name: string | null;
  email: string | null;
  is_admin: boolean;
};

export type SessionWithAdmin = {
  user: User | null;
  isAdmin: boolean;
  profile: AdminProfile | null;
};

// کاربر فعلی + وضعیت ادمین را برمی‌گرداند (بدون پرتاب خطا).
export async function getSessionWithAdmin(): Promise<SessionWithAdmin> {
  // در حالت دمو، کاربرِ دمو ادمین است تا پنل مدیریت هم قابل‌مشاهده باشد.
  if (isDemo()) {
    return {
      user: { id: demoUser.id, email: demoUser.email } as unknown as User,
      isAdmin: true,
      profile: {
        full_name: demoUser.full_name,
        email: demoUser.email,
        is_admin: true,
      },
    };
  }
  const user = await getCurrentUser();
  if (!user || !isSupabaseConfigured()) {
    return { user, isAdmin: false, profile: null };
  }
  try {
    const admin = createAdminClient();
    const { data } = await admin
      .from("profiles")
      .select("full_name, email, is_admin")
      .eq("id", user.id)
      .single();
    const profile = (data as AdminProfile) ?? null;
    return { user, isAdmin: Boolean(profile?.is_admin), profile };
  } catch {
    return { user, isAdmin: false, profile: null };
  }
}

// محافظ مسیرها و اکشن‌های ادمین. در صورت عدم احراز، ری‌دایرکت می‌کند.
export async function requireAdmin(): Promise<User> {
  const { user, isAdmin } = await getSessionWithAdmin();
  if (!user) {
    redirect("/login?redirect=/admin");
  }
  if (!isAdmin) {
    redirect("/");
  }
  return user;
}
