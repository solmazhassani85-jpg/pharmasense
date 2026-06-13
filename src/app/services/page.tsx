import type { Metadata } from "next";
import { services } from "@/lib/brand";
import ServiceCard from "@/components/ServiceCard";

export const metadata: Metadata = {
  title: "خدمات",
  description:
    "خدمات PharmaSense — مشاوره دارویی شخصی، بررسی تداخلات و دوزبندی. وبینار و کلاس‌های آنلاین به‌زودی.",
};

export default function ServicesPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
      <header className="max-w-2xl">
        <p className="eyebrow">خدمات</p>
        <h1 className="mt-2 text-4xl font-bold text-frost">
          مصرف دارو بر پایه‌ی آگاهی، نه ترس
        </h1>
        <p className="mt-4 text-lg leading-8 text-pale/85">
          هر خدمت با یک هدف ساده طراحی شده: مصرف داروهایت بر پایه آگاهی و اطمینان
          باشد، نه ترس. با مشاوره دارویی شروع می‌کنیم.
        </p>
      </header>

      <div className="mt-12 grid gap-6 md:grid-cols-2">
        {services.map((s) => (
          <ServiceCard key={s.slug} service={s} />
        ))}
      </div>

      {/* توضیح فرایند */}
      <section className="mt-20">
        <p className="eyebrow">فرایند</p>
        <h2 className="mt-2 text-2xl font-bold text-frost">
          مشاوره چطور انجام می‌شود؟
        </h2>
        <ol className="mt-8 grid gap-6 md:grid-cols-4">
          {[
            {
              step: "۱",
              title: "ثبت‌نام",
              desc: "در سایت ثبت‌نام کن و وارد پنل کاربری‌ات شو.",
            },
            {
              step: "۲",
              title: "انتخاب وقت",
              desc: "یک زمان خالی از تقویم مشاوره انتخاب کن.",
            },
            {
              step: "۳",
              title: "پرداخت",
              desc: "هزینه را با درگاه داخلی یا بین‌المللی پرداخت کن.",
            },
            {
              step: "۴",
              title: "جلسه مشاوره",
              desc: "در زمان رزروشده جلسه برگزار می‌شود و گزارش می‌گیری.",
            },
          ].map((s) => (
            <li
              key={s.step}
              className="lift rounded-2xl border border-white/10 bg-white/5 p-6 hover:border-accent/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/20 font-bold text-accent">
                {s.step}
              </span>
              <h3 className="mt-4 font-semibold text-frost">{s.title}</h3>
              <p className="mt-2 text-sm leading-7 text-pale/80">{s.desc}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
