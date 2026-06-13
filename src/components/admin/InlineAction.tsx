"use client";

import { useActionState } from "react";
import SubmitButton from "./SubmitButton";

type ActionResult = { ok: boolean; message: string };

// فرم کوتاهِ inline برای اکشن‌های ردیفی (حذف زمان، تغییر وضعیت رزرو).
// با useActionState نوعِ بازگشتیِ ActionResult با action فرم سازگار می‌شود.
export default function InlineAction({
  action,
  fields,
  label,
  variant = "ghost",
}: {
  action: (formData: FormData) => Promise<ActionResult>;
  fields: Record<string, string>;
  label: string;
  variant?: "primary" | "ghost" | "danger" | "success";
}) {
  const [state, formAction] = useActionState(
    async (_prev: ActionResult | null, formData: FormData) => action(formData),
    null,
  );

  return (
    <form action={formAction} className="flex flex-col items-end gap-1">
      {Object.entries(fields).map(([k, v]) => (
        <input key={k} type="hidden" name={k} value={v} />
      ))}
      <SubmitButton variant={variant}>{label}</SubmitButton>
      {state && !state.ok && (
        <span className="text-xs text-danger">{state.message}</span>
      )}
    </form>
  );
}
