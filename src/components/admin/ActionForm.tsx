"use client";

import { useActionState } from "react";
import SubmitButton from "./SubmitButton";

type ActionResult = { ok: boolean; message: string };

// فرم قابل‌استفاده‌ی مجدد که یک Server Action را اجرا می‌کند و پیام نتیجه را نشان می‌دهد.
export default function ActionForm({
  action,
  children,
  submitLabel,
  className = "",
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  children: React.ReactNode;
  submitLabel: string;
  className?: string;
}) {
  const [state, formAction] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => action(formData),
    null,
  );

  return (
    <form action={formAction} className={className}>
      {children}
      <div className="mt-4 flex items-center gap-3">
        <SubmitButton>{submitLabel}</SubmitButton>
        {state && (
          <span
            className={`text-sm ${state.ok ? "text-success" : "text-danger"}`}
          >
            {state.message}
          </span>
        )}
      </div>
    </form>
  );
}
