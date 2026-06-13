import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isDemo } from "@/lib/demo";

export async function POST(request: Request) {
  // در حالت دمو نشست واقعی‌ای وجود ندارد؛ فقط به خانه برمی‌گردیم.
  if (!isDemo()) {
    const supabase = await createClient();
    await supabase.auth.signOut();
  }
  return NextResponse.redirect(new URL("/", request.url), { status: 303 });
}
