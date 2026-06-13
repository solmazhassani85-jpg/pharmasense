import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { isDemo, getDemoSlots } from "@/lib/demo";
import ActionForm from "@/components/admin/ActionForm";
import InlineAction from "@/components/admin/InlineAction";
import { addSlot, generateSlots, deleteSlot } from "../actions";

export const metadata = { title: "مدیریت زمان‌ها" };

type Slot = {
  id: string;
  starts_at: string;
  ends_at: string;
  is_booked: boolean;
};

const inputCls =
  "w-full rounded-lg border border-white/10 bg-navy-900/60 px-3 py-2 text-sm text-frost focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
const labelCls = "mb-1.5 block text-sm text-pale/90";

export default async function AdminSlotsPage() {
  let slots: Slot[] = [];
  if (isDemo()) {
    slots = getDemoSlots();
  } else {
    if (!isSupabaseConfigured()) {
      return (
        <div className="rounded-2xl border border-warning/30 bg-warning/10 p-6 text-sm text-warning">
          دیتابیس هنوز پیکربندی نشده است.
        </div>
      );
    }
    const admin = createAdminClient();
    const { data } = await admin
      .from("time_slots")
      .select("id, starts_at, ends_at, is_booked")
      .gt("starts_at", new Date().toISOString())
      .order("starts_at", { ascending: true })
      .limit(200);
    slots = (data ?? []) as Slot[];
  }

  return (
    <div className="space-y-10">
      <h1 className="text-2xl font-bold text-frost">مدیریت زمان‌ها</h1>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* افزودن زمان تکی */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-semibold text-frost">افزودن زمان تکی</h2>
          <ActionForm action={addSlot} submitLabel="افزودن زمان">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelCls}>تاریخ</span>
                <input type="date" name="date" required className={inputCls} />
              </label>
              <label className="block">
                <span className={labelCls}>ساعت</span>
                <input type="time" name="time" required className={inputCls} />
              </label>
            </div>
            <label className="mt-4 block">
              <span className={labelCls}>مدت (دقیقه)</span>
              <input
                type="number"
                name="duration"
                defaultValue={45}
                min={15}
                step={5}
                className={inputCls}
              />
            </label>
          </ActionForm>
        </section>

        {/* تولید بازه‌ای */}
        <section className="rounded-2xl border border-white/10 bg-white/5 p-6">
          <h2 className="mb-4 text-lg font-semibold text-frost">تولید بازه‌ای</h2>
          <ActionForm action={generateSlots} submitLabel="تولید زمان‌ها">
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block">
                <span className={labelCls}>از تاریخ</span>
                <input type="date" name="fromDate" required className={inputCls} />
              </label>
              <label className="block">
                <span className={labelCls}>تا تاریخ</span>
                <input type="date" name="toDate" required className={inputCls} />
              </label>
              <label className="block">
                <span className={labelCls}>ساعت شروع</span>
                <input
                  type="number"
                  name="startHour"
                  defaultValue={10}
                  min={0}
                  max={23}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className={labelCls}>ساعت پایان</span>
                <input
                  type="number"
                  name="endHour"
                  defaultValue={17}
                  min={1}
                  max={24}
                  className={inputCls}
                />
              </label>
              <label className="block">
                <span className={labelCls}>مدت هر جلسه (دقیقه)</span>
                <input
                  type="number"
                  name="duration"
                  defaultValue={45}
                  min={15}
                  step={5}
                  className={inputCls}
                />
              </label>
            </div>
            <label className="mt-4 flex items-center gap-2 text-sm text-pale/90">
              <input
                type="checkbox"
                name="skipWeekend"
                defaultChecked
                className="h-4 w-4 rounded border-white/20 bg-navy-900"
              />
              حذف پنجشنبه و جمعه
            </label>
          </ActionForm>
        </section>
      </div>

      {/* لیست زمان‌ها */}
      <section>
        <h2 className="mb-4 text-lg font-semibold text-frost">
          زمان‌های آینده ({slots.length.toLocaleString("fa-IR")})
        </h2>
        {slots.length === 0 ? (
          <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-pale/70">
            هنوز زمانی ثبت نشده. از فرم‌های بالا اضافه کن.
          </p>
        ) : (
          <ul className="divide-y divide-white/10 overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            {slots.map((slot) => {
              const d = new Date(slot.starts_at);
              return (
                <li
                  key={slot.id}
                  className="flex items-center justify-between gap-3 px-5 py-3.5"
                >
                  <div className="min-w-0">
                    <span className="text-sm text-frost">
                      {d.toLocaleDateString("fa-IR", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                      })}
                    </span>
                    <span className="mr-2 font-mono text-xs text-pale/60">
                      {d.toLocaleTimeString("fa-IR", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  {slot.is_booked ? (
                    <span className="rounded-full bg-accent/15 px-3 py-1 text-xs text-accent">
                      رزروشده
                    </span>
                  ) : (
                    <InlineAction
                      action={deleteSlot}
                      fields={{ id: slot.id }}
                      label="حذف"
                      variant="danger"
                    />
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}
