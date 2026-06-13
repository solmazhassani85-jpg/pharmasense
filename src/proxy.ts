import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

// در Next.js 16، `middleware` به `proxy` تغییر نام داده است (اجرا روی Node.js runtime).
export async function proxy(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  matcher: [
    // همه مسیرها به‌جز فایل‌های استاتیک و تصاویر
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
