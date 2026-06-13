-- ════════════════════════════════════════════════════════════════
--  PharmaSense — مهاجرت پنل مدیریت
--  این فایل را یک‌بار در Supabase → SQL Editor اجرا کنید.
--  (اگر پایگاه‌داده را تازه از schema.sql ساخته‌اید، نیازی به این فایل نیست.)
-- ════════════════════════════════════════════════════════════════

-- ۱) افزودن ستون‌های لازم به جدول پروفایل
alter table public.profiles
  add column if not exists is_admin boolean not null default false;

alter table public.profiles
  add column if not exists email text;

-- ۲) به‌روزرسانی تریگر ساخت پروفایل تا ایمیل را هم ذخیره کند
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

-- ۳) پر کردن ایمیل کاربرهای موجود از auth.users
update public.profiles p
set email = u.email
from auth.users u
where p.id = u.id
  and p.email is null;

-- ════════════════════════════════════════════════════════════════
--  ۴) ادمین‌کردن حساب خودتان
--  ابتدا با ایمیل خودتان در سایت ثبت‌نام کنید، سپس خط زیر را
--  با ایمیل واقعی‌تان جایگزین و اجرا کنید:
--
--  update public.profiles set is_admin = true
--    where email = 'YOUR-EMAIL@example.com';
--
--  بررسی:  select email, is_admin from public.profiles;
-- ════════════════════════════════════════════════════════════════
