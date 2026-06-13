# PharmaSense — وب‌سایت برند شخصی

> دانش دارویی، دلسوزی انسانی.

وب‌سایت مشاوره دارویی تخصصی، ساخته‌شده با **Next.js 16 + Tailwind v4 + Supabase**، با پرداخت دوگانه‌ی **زرین‌پال (ایران)** و **Stripe (بین‌المللی)**، آماده‌ی استقرار روی **Vercel**.

## امکانات فعلی

- 🎨 طراحی کامل بر اساس برند گاید PharmaSense (رنگ‌ها، فونت‌ها، لحن، RTL، تم تیره)
- 🏠 صفحات: خانه، خدمات، درباره من، رزرو، ورود/ثبت‌نام، پنل کاربری
- 🔐 احراز هویت با Supabase (ثبت‌نام، ورود، تأیید ایمیل، خروج)
- 🗓️ سیستم رزرو وقت مشاوره روی دیتابیس Supabase
- 💳 پرداخت با **زرین‌پال** و **Stripe** — کاربر هنگام پرداخت یکی را انتخاب می‌کند
- 🗄️ دیتابیس آماده برای توسعه‌ی آینده (وبینار و کلاس آنلاین)

---

## راه‌اندازی محلی

### ۱) نصب وابستگی‌ها

```bash
npm install
```

### ۲) متغیرهای محیطی

```bash
cp .env.example .env.local
```

سپس مقادیر را در `.env.local` پر کنید (راهنما در ادامه).

### ۳) اجرای سرور توسعه

```bash
npm run dev
```

سایت روی [http://localhost:3000](http://localhost:3000) بالا می‌آید.
> بدون پیکربندی Supabase هم سایت اجرا می‌شود؛ صرفاً ورود/رزرو غیرفعال است.

---

## پیکربندی Supabase

1. در [supabase.com](https://supabase.com) یک پروژه بسازید.
2. از **Project Settings → API** این مقادیر را در `.env.local` بگذارید:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (محرمانه — فقط سرور)
3. در **SQL Editor** فایل [`supabase/schema.sql`](supabase/schema.sql) را اجرا کنید (جدول‌ها، RLS، خدمت اولیه).
4. برای ساخت زمان‌های خالی مشاوره، فایل [`supabase/seed_slots.sql`](supabase/seed_slots.sql) را اجرا کنید (۲ هفته‌ی آینده).
5. در **Authentication → URL Configuration**، آدرس‌های بازگشت را اضافه کنید:
   - `http://localhost:3000/auth/callback`
   - `https://YOUR-DOMAIN.com/auth/callback`

---

## پیکربندی پرداخت

### زرین‌پال (داخل ایران)
- `ZARINPAL_MERCHANT_ID` را از پنل زرین‌پال بگیرید.
- برای تست `ZARINPAL_SANDBOX=true` و در پروداکشن `false`.
- callback به‌صورت خودکار روی `/api/payment/zarinpal/verify` تنظیم می‌شود.

### Stripe (بین‌المللی)
- `STRIPE_SECRET_KEY` و `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` را از داشبورد Stripe بگیرید.
- یک **Webhook** بسازید با آدرس `https://YOUR-DOMAIN.com/api/payment/stripe/webhook` و رویداد `checkout.session.completed`، سپس `STRIPE_WEBHOOK_SECRET` را کپی کنید.
- تست محلی وب‌هوک: `stripe listen --forward-to localhost:3000/api/payment/stripe/webhook`

> 💡 قیمت‌ها در جدول `services` دیتابیس کنترل می‌شوند (`price_irr` به ریال، `price_usd` به دلار). برای تغییر قیمت، همان ردیف را در Supabase ویرایش کنید.

---

## پنل مدیریت (`/admin`)

پنلی اختصاصی برای مدیریت کل کسب‌وکار از داخل سایت — بدون نیاز به SQL یا داشبورد Supabase.

**فعال‌سازی:**
1. فایل [`supabase/admin_migration.sql`](supabase/admin_migration.sql) را در Supabase → SQL Editor اجرا کنید (ستون‌های `is_admin` و `email` را اضافه می‌کند). برای نصب تازه از `schema.sql`، این مرحله لازم نیست.
2. با ایمیل خودتان در سایت ثبت‌نام کنید.
3. این دستور را در SQL Editor اجرا کنید (با ایمیل واقعی‌تان):
   ```sql
   update public.profiles set is_admin = true where email = 'YOUR-EMAIL@example.com';
   ```
4. وارد شوید — لینک «مدیریت» در نوبار ظاهر می‌شود و `/admin` باز می‌شود.

**قابلیت‌ها:**
- 🗓️ **زمان‌ها** — افزودن زمان تکی یا تولید بازه‌ای، حذف زمان‌های خالی (جایگزین `seed_slots.sql`).
- 📋 **رزروها** — مشاهده‌ی همه‌ی رزروها با نام/ایمیل مشتری، لیست داروها، توضیحات و وضعیت پرداخت.
- 🔄 **تغییر وضعیت** — علامت‌گذاری رزرو به «انجام‌شده» یا «لغو» (لغو، زمان را آزاد می‌کند).
- ⚙️ **خدمات** — ویرایش عنوان، قیمت ریالی/دلاری، مدت و فعال/غیرفعال‌بودن.

> دسترسی دولایه محافظت می‌شود: `proxy` ورود را الزامی می‌کند و `layout` پنل، فیلد `is_admin` را سمت سرور بررسی می‌کند.

---

## استقرار روی Vercel

1. کد را به یک ریپازیتوری GitHub پوش کنید.
2. در [vercel.com](https://vercel.com) پروژه را Import کنید (Next.js به‌صورت خودکار شناسایی می‌شود).
3. همه‌ی متغیرهای `.env.local` را در **Vercel → Settings → Environment Variables** وارد کنید.
4. `NEXT_PUBLIC_SITE_URL` را روی دامنه‌ی نهایی تنظیم کنید (مثلاً `https://careerpreneuracademy.com`).
5. Deploy کنید. سپس آدرس‌های callback زرین‌پال/Stripe و Supabase را با دامنه‌ی نهایی به‌روزرسانی کنید.

---

## ساختار پروژه

```
src/
  app/
    page.tsx                  صفحه خانه
    services/, about/         خدمات و درباره
    booking/                  رزرو + صفحات موفق/ناموفق
    login/, signup/           احراز هویت
    dashboard/                پنل کاربری
    admin/                    پنل مدیریت (داشبورد، زمان‌ها، رزروها، خدمات) + actions.ts
    auth/callback, signout    مسیرهای auth
    api/
      checkout/               ساخت رزرو + شروع پرداخت
      payment/stripe/webhook  تأیید Stripe
      payment/zarinpal/verify تأیید زرین‌پال
  components/                 Navbar, Footer, Logo, ServiceCard, BookingForm, AuthForm
  lib/
    brand.ts                  داده‌های برند و خدمات
    supabase/                 کلاینت‌های مرورگر/سرور/ادمین + proxy
    payments/                 zarinpal.ts, stripe.ts
  proxy.ts                    مدیریت نشست (جایگزین middleware در Next 16)
supabase/
  schema.sql, seed_slots.sql
```

---

## کارهای باقی‌مانده (برای آینده)

- [ ] افزودن عکس و رزومه‌ی واقعی به صفحه‌ی «درباره من»
- [ ] بخش وبینار و کلاس‌های آنلاین (ساختار دیتابیس آماده است)
- [ ] پنل مدیریت برای افزودن/مدیریت زمان‌های مشاوره از داخل سایت
