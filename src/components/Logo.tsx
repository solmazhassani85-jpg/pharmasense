import Link from "next/link";

// واژه‌نشان برند: «Pharma» روشن + «Sense» با رنگ Accent (#378ADD)
// به‌همراه یک نشان قرص/کپسول ساده با ذرات Sky طبق هویت بصری برند.
export default function Logo({ className = "" }: { className?: string }) {
  return (
    <Link
      href="/"
      aria-label="PharmaSense — خانه"
      className={`group inline-flex items-center gap-2.5 ${className}`}
    >
      <span className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-primary shadow-lg shadow-primary/30 transition-transform group-hover:scale-105">
        {/* نشان کپسول ساده */}
        <svg
          viewBox="0 0 24 24"
          className="h-5 w-5 text-frost"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <path d="M10.5 20.5 3.5 13.5a4.95 4.95 0 0 1 7-7l7 7a4.95 4.95 0 0 1-7 7Z" />
          <path d="m8.5 8.5 7 7" />
        </svg>
        {/* ذرات Sky */}
        <span className="absolute -right-0.5 -top-0.5 h-1.5 w-1.5 rounded-full bg-sky" />
      </span>
      <span className="font-display text-2xl leading-none tracking-tight">
        <span className="text-frost">Pharma</span>
        <span className="text-accent">Sense</span>
      </span>
    </Link>
  );
}
