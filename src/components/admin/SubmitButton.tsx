"use client";

import { useFormStatus } from "react-dom";

export default function SubmitButton({
  children,
  className = "",
  variant = "primary",
}: {
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "ghost" | "danger" | "success";
}) {
  const { pending } = useFormStatus();
  const base =
    "inline-flex items-center justify-center rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50";
  const variants: Record<string, string> = {
    primary: "bg-primary text-frost hover:bg-accent",
    ghost: "border border-white/15 text-pale hover:bg-white/5",
    danger: "bg-danger/15 text-danger hover:bg-danger/25",
    success: "bg-success/15 text-success hover:bg-success/25",
  };
  return (
    <button
      type="submit"
      disabled={pending}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {pending ? "…" : children}
    </button>
  );
}
