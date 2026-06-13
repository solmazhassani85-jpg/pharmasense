import { isDemo } from "@/lib/demo";

// نوار باریک بالای سایت که نشان می‌دهد در حالت دموست.
export default function DemoBanner() {
  if (!isDemo()) return null;
  return (
    <div className="bg-accent/15 text-center text-xs text-accent">
      <p className="mx-auto max-w-6xl px-4 py-1.5">
        🔵 نسخه دمو — همه‌چیز با دیتای نمونه کار می‌کند؛ هیچ پرداخت یا ذخیره‌ی
        واقعی‌ای انجام نمی‌شود.
      </p>
    </div>
  );
}
