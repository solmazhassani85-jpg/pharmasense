"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

type Mode = "login" | "signup";

export default function AuthForm({ mode }: { mode: Mode }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") ?? "/dashboard";

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);

  const isSignup = mode === "signup";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setInfo(null);
    setLoading(true);

    let supabase;
    try {
      supabase = createClient();
    } catch {
      setError("اتصال به سرور برقرار نشد. لطفاً پیکربندی Supabase را بررسی کنید.");
      setLoading(false);
      return;
    }

    try {
      if (isSignup) {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
            emailRedirectTo: `${window.location.origin}/auth/callback?next=${encodeURIComponent(redirectTo)}`,
          },
        });
        if (error) throw error;
        setInfo(
          "ثبت‌نام انجام شد! یک ایمیل تأیید برایت فرستادیم؛ لطفاً صندوق ورودی‌ات را چک کن.",
        );
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push(redirectTo);
        router.refresh();
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "خطایی رخ داد.";
      setError(translateError(message));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-2xl border border-white/10 bg-white/5 p-8">
        <h1 className="text-2xl font-bold text-frost">
          {isSignup ? "ثبت‌نام در PharmaSense" : "ورود به حساب"}
        </h1>
        <p className="mt-2 text-sm text-pale/70">
          {isSignup
            ? "حساب بساز تا بتونی وقت مشاوره رزرو کنی."
            : "خوش برگشتی! وارد شو و رزروهات رو ببین."}
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {isSignup && (
            <Field
              label="نام و نام خانوادگی"
              type="text"
              value={fullName}
              onChange={setFullName}
              placeholder="مثلاً نگار رضایی"
              required
            />
          )}
          <Field
            label="ایمیل"
            type="email"
            value={email}
            onChange={setEmail}
            placeholder="you@example.com"
            dir="ltr"
            required
          />
          <Field
            label="رمز عبور"
            type="password"
            value={password}
            onChange={setPassword}
            placeholder="حداقل ۶ کاراکتر"
            dir="ltr"
            required
          />

          {error && (
            <p className="rounded-lg bg-danger/15 px-3 py-2 text-sm text-danger">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-lg bg-success/15 px-3 py-2 text-sm text-success">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-medium text-frost shadow-lg shadow-primary/30 transition-colors hover:bg-accent disabled:opacity-60"
          >
            {loading
              ? "لطفاً صبر کن…"
              : isSignup
                ? "ساخت حساب"
                : "ورود"}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-pale/70">
          {isSignup ? (
            <>
              قبلاً حساب داری؟{" "}
              <Link href="/login" className="text-accent hover:underline">
                وارد شو
              </Link>
            </>
          ) : (
            <>
              حساب نداری؟{" "}
              <Link href="/signup" className="text-accent hover:underline">
                ثبت‌نام کن
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  type,
  value,
  onChange,
  placeholder,
  required,
  dir,
}: {
  label: string;
  type: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  required?: boolean;
  dir?: "ltr" | "rtl";
}) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm text-pale/90">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        dir={dir}
        className="w-full rounded-xl border border-white/10 bg-navy-900/60 px-4 py-3 text-sm text-frost placeholder:text-pale/30 focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
      />
    </label>
  );
}

function translateError(message: string): string {
  const m = message.toLowerCase();
  if (m.includes("invalid login")) return "ایمیل یا رمز عبور درست نیست.";
  if (m.includes("already registered") || m.includes("already exists"))
    return "این ایمیل قبلاً ثبت شده. وارد شو.";
  if (m.includes("password")) return "رمز عبور باید حداقل ۶ کاراکتر باشد.";
  if (m.includes("email")) return "ایمیل واردشده معتبر نیست.";
  return message;
}
