-- ════════════════════════════════════════════════════════════════
--  تولید زمان‌های خالی مشاوره (Time Slots)
--  این اسکریپت برای ۱۴ روز آینده، روزهای شنبه تا چهارشنبه،
--  ساعت‌های ۱۰ تا ۱۷ (هر ساعت یک اسلات ۴۵ دقیقه‌ای) می‌سازد.
--  زمان‌ها بر اساس UTC هستند؛ در صورت نیاز offset را تنظیم کنید.
-- ════════════════════════════════════════════════════════════════

insert into public.time_slots (starts_at, ends_at)
select
  slot_start,
  slot_start + interval '45 minutes'
from (
  select (current_date + d) + (h || ':00')::time as slot_start
  from generate_series(1, 14) as d
  cross join generate_series(10, 16) as h
  -- فقط شنبه(6) تا چهارشنبه(3)؛ پنجشنبه(4) و جمعه(5) حذف می‌شوند
  where extract(dow from (current_date + d)) not in (4, 5)
) g
where slot_start > now()
on conflict (starts_at) do nothing;

-- برای دیدن اسلات‌های ساخته‌شده:
-- select starts_at, is_booked from public.time_slots order by starts_at;
