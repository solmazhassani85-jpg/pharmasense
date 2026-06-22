"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function FloatingBookButton() {
  const pathname = usePathname();

  /* روی صفحه رزرو و لاگین نشون نده */
  if (pathname.startsWith("/booking") || pathname.startsWith("/login") || pathname.startsWith("/signup")) {
    return null;
  }

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <Link
        href="/booking"
        className="btn-glow flex items-center gap-2.5 rounded-2xl bg-primary px-5 py-3.5 text-sm font-medium text-frost shadow-xl shadow-primary/40 transition-all duration-200 hover:scale-105 hover:bg-accent"
      >
        <svg
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <rect width="18" height="18" x="3" y="4" rx="2" />
          <line x1="16" x2="16" y1="2" y2="6" />
          <line x1="8" x2="8" y1="2" y2="6" />
          <line x1="3" x2="21" y1="10" y2="10" />
          <path d="M8 14h.01M12 14h.01M16 14h.01" />
        </svg>
        رزرو مشاوره
      </Link>
    </div>
  );
}
