-- ════════════════════════════════════════════════════════════════
--  PharmaSense — اسکیمای دیتابیس (Supabase / PostgreSQL)
--  این فایل را در Supabase → SQL Editor اجرا کنید.
-- ════════════════════════════════════════════════════════════════

-- ── 1) جدول پروفایل کاربران ────────────────────────────────────
-- به ازای هر کاربر در auth.users یک ردیف پروفایل ساخته می‌شود.
create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text,
  email text,
  phone text,
  is_admin boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- هر کاربر فقط پروفایل خودش را می‌بیند/ویرایش می‌کند.
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own" on public.profiles
  for insert with check (auth.uid() = id);

-- ساخت خودکار پروفایل هنگام ثبت‌نام کاربر جدید
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, email)
  values (new.id, new.raw_user_meta_data ->> 'full_name', new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();


-- ── 2) جدول خدمات ──────────────────────────────────────────────
create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  title text not null,
  description text,
  duration_min int not null default 45,
  price_irr bigint not null default 0,   -- ریال (درگاه ایرانی)
  price_usd numeric(10, 2) not null default 0, -- دلار (Stripe)
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.services enable row level security;

-- خدمات برای همه قابل مشاهده است.
drop policy if exists "services_select_all" on public.services;
create policy "services_select_all" on public.services
  for select using (true);


-- ── 3) جدول اسلات‌های زمانی (تقویم مشاور) ───────────────────────
-- هر اسلات یک بازه‌ی زمانی خالیِ قابل رزرو است.
create table if not exists public.time_slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now(),
  unique (starts_at)
);

alter table public.time_slots enable row level security;

-- اسلات‌های خالیِ آینده برای همه قابل مشاهده است.
drop policy if exists "slots_select_open" on public.time_slots;
create policy "slots_select_open" on public.time_slots
  for select using (true);


-- ── 4) جدول رزروها ─────────────────────────────────────────────
create type booking_status as enum ('pending', 'paid', 'cancelled', 'completed');
-- اگر type از قبل وجود داشت خطا را نادیده بگیرید:
-- (در اجرای مجدد، خط بالا را کامنت کنید)

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  service_id uuid references public.services (id),
  slot_id uuid references public.time_slots (id),
  status booking_status not null default 'pending',
  -- اطلاعات بالینی که کاربر هنگام رزرو وارد می‌کند
  medications text,         -- لیست داروهای فعلی
  note text,                -- توضیح/سؤال کاربر
  -- اطلاعات پرداخت
  provider text,            -- 'stripe' یا 'zarinpal'
  amount bigint,            -- مبلغ پرداخت‌شده
  currency text,            -- 'IRR' یا 'USD'
  payment_ref text,         -- شناسه تراکنش/مرجع درگاه
  created_at timestamptz not null default now()
);

alter table public.bookings enable row level security;

-- هر کاربر فقط رزروهای خودش را می‌بیند و می‌سازد.
drop policy if exists "bookings_select_own" on public.bookings;
create policy "bookings_select_own" on public.bookings
  for select using (auth.uid() = user_id);

drop policy if exists "bookings_insert_own" on public.bookings;
create policy "bookings_insert_own" on public.bookings
  for insert with check (auth.uid() = user_id);

drop policy if exists "bookings_update_own" on public.bookings;
create policy "bookings_update_own" on public.bookings
  for update using (auth.uid() = user_id);

create index if not exists bookings_user_idx on public.bookings (user_id);


-- ── 5) داده‌های اولیه‌ی خدمات ───────────────────────────────────
insert into public.services (slug, title, description, duration_min, price_irr, price_usd, is_active)
values
  ('consultation', 'مشاوره دارویی شخصی',
   'بررسی کامل داروها، تداخلات و دوزبندی در یک جلسه اختصاصی.',
   45, 2500000, 49, true)
on conflict (slug) do nothing;


-- ════════════════════════════════════════════════════════════════
--  یادداشت امنیتی:
--  - وضعیت پرداخت (status='paid') فقط باید توسط سرور با
--    SERVICE_ROLE_KEY (در webhook/verify) به‌روزرسانی شود،
--    نه توسط خود کاربر. سیاست update بالا صرفاً برای لغو/ویرایش
--    اطلاعات بالینی است؛ در صورت نیاز می‌توان آن را محدودتر کرد.
-- ════════════════════════════════════════════════════════════════
