import Link from "next/link";
import Logo from "./Logo";
import { brand, navLinks } from "@/lib/brand";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20">
      {/* جداکننده درخشان */}
      <div className="divider-glow" />

      <div className="border-t border-white/[0.06] bg-gradient-to-b from-white/[0.02] to-navy-900/60">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 sm:px-6 md:grid-cols-3">
          {/* ستون برند */}
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-7 text-pale/70">
              {brand.tagline}
            </p>
            <p className="font-mono text-xs text-pale/35">{brand.taglineEn}</p>

            {/* لینک‌های اجتماعی */}
            <div className="flex items-center gap-3 pt-1">
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="اینستاگرام PharmaSense"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/[0.1] text-pale/55 transition-all hover:border-accent/35 hover:bg-accent/10 hover:text-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href={brand.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="تلگرام PharmaSense"
                className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl border border-white/[0.1] text-pale/55 transition-all hover:border-accent/35 hover:bg-accent/10 hover:text-accent"
              >
                <svg
                  viewBox="0 0 24 24"
                  className="h-4 w-4"
                  fill="currentColor"
                  aria-hidden="true"
                >
                  <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                </svg>
              </a>
            </div>
          </div>

          {/* ستون پیوندها */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-frost">
              دسترسی سریع
            </h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="group flex items-center gap-1.5 text-sm text-pale/65 transition-colors hover:text-accent"
                  >
                    <span className="h-px w-3 bg-accent/30 transition-all group-hover:w-5 group-hover:bg-accent/60" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ستون ارتباط */}
          <div>
            <h3 className="mb-5 text-sm font-semibold text-frost">
              ارتباط با من
            </h3>
            <ul className="space-y-3 text-sm">
              <li>
                <a
                  href={brand.social.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pale/65 transition-colors hover:text-accent"
                >
                  {brand.social.instagramHandle}
                </a>
              </li>
              <li>
                <a
                  href={brand.social.telegram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-pale/65 transition-colors hover:text-accent"
                >
                  {brand.social.telegramHandle}
                </a>
              </li>
              <li className="pt-2">
                <Link
                  href="/booking"
                  className="inline-flex items-center gap-2 rounded-xl bg-primary/18 px-4 py-2.5 text-sm font-medium text-accent ring-1 ring-accent/15 transition-all hover:bg-primary/28 hover:ring-accent/30"
                >
                  رزرو مشاوره ←
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/[0.06]">
          <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-pale/35 sm:flex-row sm:px-6 sm:text-right">
            <p>
              © {year} {brand.name} — همه حقوق محفوظ است.
            </p>
            <p className="font-mono">PharmaSense v1.0</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
