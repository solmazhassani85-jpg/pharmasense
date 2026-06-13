import type { Metadata } from "next";
import { Suspense } from "react";
import { redirect } from "next/navigation";
import AuthForm from "@/components/AuthForm";
import { isDemo } from "@/lib/demo";

export const metadata: Metadata = { title: "ثبت‌نام" };

export default function SignupPage() {
  if (isDemo()) redirect("/dashboard");
  return (
    <div className="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <Suspense fallback={<div className="text-center text-pale/60">…</div>}>
        <AuthForm mode="signup" />
      </Suspense>
    </div>
  );
}
