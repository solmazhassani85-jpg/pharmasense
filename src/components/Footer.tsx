import Link from "next/link";
import Logo from "./Logo";
import { brand, navLinks } from "@/lib/brand";

export default function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="mt-20 border-t border-white/10 bg-navy-900/60">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        {/* ستون برند */}
        <div className="space-y-4">
          <Logo />
          <p className="max-w-xs text-sm leading-7 text-pale/80">
            {brand.tagline}
          </p>
          <p className="font-mono text-xs text-pale/50">{brand.taglineEn}</p>
        </div>

        {/* ستون پیوندها */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-frost">دسترسی سریع</h3>
          <ul className="space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="text-sm text-pale/80 transition-colors hover:text-accent"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* ستون ارتباط */}
        <div>
          <h3 className="mb-4 text-sm font-semibold text-frost">ارتباط با من</h3>
          <ul className="space-y-2.5 text-sm text-pale/80">
            <li>
              <a
                href={brand.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                اینستاگرام {brand.social.instagramHandle}
              </a>
            </li>
            <li>
              <a
                href={brand.social.telegram}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-accent"
              >
                تلگرام {brand.social.telegramHandle}
              </a>
            </li>
            <li className="font-mono text-xs text-pale/50">{brand.domain}</li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-2 px-4 py-5 text-center text-xs text-pale/50 sm:flex-row sm:px-6 sm:text-right">
          <p>
            © {year} {brand.name} — همه حقوق محفوظ است.
          </p>
          <p className="font-mono">PharmaSense v1.0</p>
        </div>
      </div>
    </footer>
  );
}
