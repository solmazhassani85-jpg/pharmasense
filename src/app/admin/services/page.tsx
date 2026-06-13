import { createAdminClient } from "@/lib/supabase/admin";
import { isSupabaseConfigured } from "@/lib/supabase/server";
import { isDemo, getDemoServices } from "@/lib/demo";
import ActionForm from "@/components/admin/ActionForm";
import { updateService } from "../actions";

export const metadata = { title: "مدیریت خدمات" };

type ServiceRow = {
  id: string;
  slug: string;
  title: string;
  duration_min: number;
  price_irr: number;
  price_usd: number;
  is_active: boolean;
};

const inputCls =
  "w-full rounded-lg border border-white/10 bg-navy-900/60 px-3 py-2 text-sm text-frost focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";
const labelCls = "mb-1.5 block text-sm text-pale/90";

export default async function AdminServicesPage() {
  let services: ServiceRow[] = [];
  if (isDemo()) {
    services = getDemoServices();
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
      .from("services")
      .select("id, slug, title, duration_min, price_irr, price_usd, is_active")
      .order("created_at", { ascending: true });
    services = (data ?? []) as ServiceRow[];
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-frost">مدیریت خدمات</h1>
      <p className="text-sm text-pale/70">
        قیمت‌ها مستقیماً در صفحه‌ی خدمات و فرایند پرداخت اعمال می‌شوند. مبلغ ریالی
        را به <span className="font-mono">ریال</span> وارد کن (۱ تومان = ۱۰ ریال).
      </p>

      {services.length === 0 ? (
        <p className="rounded-xl border border-white/10 bg-white/5 p-5 text-sm text-pale/70">
          خدمتی یافت نشد. ابتدا schema.sql را اجرا کن.
        </p>
      ) : (
        <div className="space-y-5">
          {services.map((svc) => (
            <section
              key={svc.id}
              className="rounded-2xl border border-white/10 bg-white/5 p-6"
            >
              <div className="mb-4 flex items-center gap-2">
                <h2 className="text-lg font-semibold text-frost">{svc.title}</h2>
                <span className="font-mono text-xs text-pale/50">{svc.slug}</span>
              </div>
              <ActionForm action={updateService} submitLabel="ذخیره تغییرات">
                <input type="hidden" name="id" value={svc.id} />
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block sm:col-span-2">
                    <span className={labelCls}>عنوان</span>
                    <input
                      type="text"
                      name="title"
                      defaultValue={svc.title}
                      required
                      className={inputCls}
                    />
                  </label>
                  <label className="block">
                    <span className={labelCls}>قیمت ریالی (IRR)</span>
                    <input
                      type="number"
                      name="price_irr"
                      defaultValue={svc.price_irr}
                      min={0}
                      step={10000}
                      className={inputCls}
                      dir="ltr"
                    />
                  </label>
                  <label className="block">
                    <span className={labelCls}>قیمت دلاری (USD)</span>
                    <input
                      type="number"
                      name="price_usd"
                      defaultValue={svc.price_usd}
                      min={0}
                      step={1}
                      className={inputCls}
                      dir="ltr"
                    />
                  </label>
                  <label className="block">
                    <span className={labelCls}>مدت (دقیقه)</span>
                    <input
                      type="number"
                      name="duration_min"
                      defaultValue={svc.duration_min}
                      min={15}
                      step={5}
                      className={inputCls}
                      dir="ltr"
                    />
                  </label>
                  <label className="flex items-center gap-2 pt-7 text-sm text-pale/90">
                    <input
                      type="checkbox"
                      name="is_active"
                      defaultChecked={svc.is_active}
                      className="h-4 w-4 rounded border-white/20 bg-navy-900"
                    />
                    فعال (قابل رزرو)
                  </label>
                </div>
              </ActionForm>
            </section>
          ))}
        </div>
      )}
    </div>
  );
}
