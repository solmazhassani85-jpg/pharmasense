"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Logo from "./Logo";
import { navLinks } from "@/lib/brand";

export default function NavbarClient({
  isAuthed,
  email,
  isAdmin = false,
}: {
  isAuthed: boolean;
  email: string | null;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* بستن منوی موبایل هنگام تغییر مسیر */
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <div
        className={`mx-auto max-w-6xl overflow-hidden rounded-2xl border border-white/[0.08] shadow-[0_8px_32px_rgba(2,26,51,0.55)] backdrop-blur-2xl transition-all duration-300 ${
          scrolled ? "bg-navy-900/92" : "bg-navy-900/72"
        }`}
      >
        <nav className="flex h-14 items-center justify-between px-4 sm:px-6">
          <Logo />

          {/* لینک‌های دسکتاپ */}
          <ul className="hidden items-center gap-0.5 md:flex">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className={`relative rounded-xl px-3.5 py-2 text-sm transition-all duration-200 ${
                    isActive(link.href)
                      ? "bg-primary/22 font-medium text-frost"
                      : "text-pale/75 hover:bg-white/[0.07] hover:text-frost"
                  }`}
                >
                  {link.label}
                  {/* خط فعال زیر لینک */}
                  {isActive(link.href) && (
                    <span className="absolute bottom-1 left-1/2 h-[2px] w-4 -translate-x-1/2 rounded-full bg-accent/70" />
                  )}
                </Link>
              </li>
            ))}
          </ul>

          {/* اقدامات دسکتاپ */}
          <div className="hidden items-center gap-2 md:flex">
            {isAuthed ? (
              <>
                {isAdmin && (
                  <Link
                    href="/admin"
                    className="rounded-xl bg-accent/15 px-3 py-1.5 text-sm text-accent transition-colors hover:bg-accent/25"
                  >
                    مدیریت
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  className="rounded-xl px-3 py-1.5 text-sm text-pale/75 transition-colors hover:text-frost"
                >
                  پنل من
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="cursor-pointer rounded-xl border border-white/[0.12] px-3 py-1.5 text-sm text-pale/75 transition-all hover:border-white/25 hover:bg-white/[0.06] hover:text-frost"
                  >
                    خروج
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="rounded-xl px-3 py-1.5 text-sm text-pale/75 transition-colors hover:text-frost"
                >
                  ورود
                </Link>
                <Link
                  href="/signup"
                  className="rounded-xl bg-primary px-4 py-1.5 text-sm font-medium text-frost shadow-md shadow-primary/30 transition-all duration-200 hover:bg-accent hover:shadow-accent/30"
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>

          {/* دکمه منوی موبایل */}
          <button
            type="button"
            aria-label={open ? "بستن منو" : "باز کردن منو"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="inline-flex cursor-pointer items-center justify-center rounded-xl p-2 text-pale/75 transition-colors hover:bg-white/[0.07] hover:text-frost md:hidden"
          >
            <svg
              viewBox="0 0 24 24"
              className="h-5 w-5"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              aria-hidden="true"
            >
              {open ? (
                <path d="M6 6l12 12M18 6 6 18" />
              ) : (
                <path d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </nav>

        {/* منوی موبایل */}
        {open && (
          <div className="border-t border-white/[0.07] px-4 py-3 md:hidden">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-3.5 py-2.5 text-sm transition-colors ${
                      isActive(link.href)
                        ? "bg-primary/20 font-medium text-frost"
                        : "text-pale/75 hover:bg-white/[0.07] hover:text-frost"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-col gap-2 border-t border-white/[0.07] pt-3">
              {isAuthed ? (
                <>
                  <span className="px-3.5 text-xs text-pale/45">{email}</span>
                  {isAdmin && (
                    <Link
                      href="/admin"
                      onClick={() => setOpen(false)}
                      className="rounded-xl bg-accent/15 px-3.5 py-2.5 text-sm text-accent"
                    >
                      مدیریت
                    </Link>
                  )}
                  <Link
                    href="/dashboard"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3.5 py-2.5 text-sm text-pale/75 hover:bg-white/[0.07] hover:text-frost"
                  >
                    پنل من
                  </Link>
                  <form action="/auth/signout" method="post">
                    <button
                      type="submit"
                      className="w-full rounded-xl border border-white/[0.12] px-3.5 py-2.5 text-right text-sm text-pale/75 transition-all hover:bg-white/[0.06] hover:text-frost"
                    >
                      خروج
                    </button>
                  </form>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setOpen(false)}
                    className="rounded-xl px-3.5 py-2.5 text-sm text-pale/75 hover:bg-white/[0.07] hover:text-frost"
                  >
                    ورود
                  </Link>
                  <Link
                    href="/signup"
                    onClick={() => setOpen(false)}
                    className="rounded-xl bg-primary px-4 py-2.5 text-center text-sm font-medium text-frost"
                  >
                    ثبت‌نام
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
