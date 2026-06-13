"use client";

import { useState } from "react";
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
  const pathname = usePathname();

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-navy-900/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Logo />

        {/* لینک‌های دسکتاپ */}
        <ul className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                  isActive(link.href)
                    ? "bg-primary/20 text-frost"
                    : "text-pale hover:bg-white/5 hover:text-frost"
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* اقدامات سمت چپ (دسکتاپ) */}
        <div className="hidden items-center gap-2 md:flex">
          {isAuthed ? (
            <>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-lg bg-accent/15 px-3 py-2 text-sm text-accent hover:bg-accent/25"
                >
                  مدیریت
                </Link>
              )}
              <Link
                href="/dashboard"
                className="rounded-lg px-3 py-2 text-sm text-pale hover:text-frost"
              >
                پنل من
              </Link>
              <form action="/auth/signout" method="post">
                <button
                  type="submit"
                  className="rounded-lg border border-white/15 px-3 py-2 text-sm text-pale transition-colors hover:bg-white/5"
                >
                  خروج
                </button>
              </form>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="rounded-lg px-3 py-2 text-sm text-pale hover:text-frost"
              >
                ورود
              </Link>
              <Link
                href="/signup"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-frost shadow-lg shadow-primary/30 transition-colors hover:bg-accent"
              >
                ثبت‌نام
              </Link>
            </>
          )}
        </div>

        {/* دکمه منوی موبایل */}
        <button
          type="button"
          aria-label="منو"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="inline-flex items-center justify-center rounded-lg p-2 text-pale hover:bg-white/5 md:hidden"
        >
          <svg
            viewBox="0 0 24 24"
            className="h-6 w-6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
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
        <div className="border-t border-white/10 bg-navy-900/95 px-4 py-3 md:hidden">
          <ul className="flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className={`block rounded-lg px-3 py-2.5 text-sm ${
                    isActive(link.href)
                      ? "bg-primary/20 text-frost"
                      : "text-pale hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex flex-col gap-2 border-t border-white/10 pt-3">
            {isAuthed ? (
              <>
                <span className="px-3 text-xs text-pale/60">{email}</span>
                {isAdmin && (
                  <Link
                    href="/admin"
                    onClick={() => setOpen(false)}
                    className="rounded-lg bg-accent/15 px-3 py-2.5 text-sm text-accent hover:bg-accent/25"
                  >
                    مدیریت
                  </Link>
                )}
                <Link
                  href="/dashboard"
                  onClick={() => setOpen(false)}
                  className="rounded-lg px-3 py-2.5 text-sm text-pale hover:bg-white/5"
                >
                  پنل من
                </Link>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    className="w-full rounded-lg border border-white/15 px-3 py-2.5 text-right text-sm text-pale hover:bg-white/5"
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
                  className="rounded-lg px-3 py-2.5 text-sm text-pale hover:bg-white/5"
                >
                  ورود
                </Link>
                <Link
                  href="/signup"
                  onClick={() => setOpen(false)}
                  className="rounded-lg bg-primary px-4 py-2.5 text-center text-sm font-medium text-frost"
                >
                  ثبت‌نام
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
