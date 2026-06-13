import type { Metadata } from "next";
import Link from "next/link";
import { requireAdmin } from "@/lib/auth";

export const metadata: Metadata = {
  title: "پنل مدیریت",
  robots: { index: false, follow: false },
};

const adminNav = [
  { href: "/admin", label: "داشبورد" },
  { href: "/admin/slots", label: "زمان‌ها" },
  { href: "/admin/bookings", label: "رزروها" },
  { href: "/admin/services", label: "خدمات" },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // محافظ سمت سرور — فقط ادمین.
  await requireAdmin();

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex items-center gap-2 border-b border-white/10 pb-4">
        <span className="rounded-lg bg-primary/20 px-3 py-1 text-sm font-semibold text-accent">
          پنل مدیریت
        </span>
        <span className="text-sm text-pale/60">PharmaSense</span>
      </div>

      <div className="grid gap-8 md:grid-cols-[200px_1fr]">
        {/* ساب‌نَو */}
        <nav className="md:sticky md:top-20 md:self-start">
          <ul className="flex gap-2 overflow-x-auto md:flex-col md:overflow-visible">
            {adminNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="block whitespace-nowrap rounded-lg px-4 py-2.5 text-sm text-pale transition-colors hover:bg-white/5 hover:text-frost"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
