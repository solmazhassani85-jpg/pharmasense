import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isDemo } from "@/lib/demo";

// به‌روزرسانی نشست کاربر در هر درخواست (از proxy.ts فراخوانی می‌شود).
// اگر Supabase هنوز پیکربندی نشده باشد، بدون تغییر عبور می‌دهد.
export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  // در حالت دمو محافظت مسیرها غیرفعال است (همه‌ی صفحات باز).
  if (isDemo()) {
    return supabaseResponse;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value),
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options),
        );
      },
    },
  });

  // مهم: getUser() را بلافاصله صدا می‌زنیم تا نشست تازه شود.
  let user = null;
  try {
    const result = await supabase.auth.getUser();
    user = result.data.user;
  } catch {
    // پیکربندی نامعتبر یا خطای شبکه — بدون نشست ادامه می‌دهیم
    return supabaseResponse;
  }

  // محافظت از مسیرهای خصوصی
  const protectedPaths = ["/dashboard", "/admin"];
  const isProtected = protectedPaths.some((p) =>
    request.nextUrl.pathname.startsWith(p),
  );

  if (!user && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/login";
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return supabaseResponse;
}
