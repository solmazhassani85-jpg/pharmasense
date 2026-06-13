// داده‌های مرکزی برند PharmaSense — برگرفته از برند گاید رسمی
// تغییر متن‌ها از همین‌جا روی کل سایت اعمال می‌شود.

export const brand = {
  name: "PharmaSense",
  nameFa: "فارماسنس",
  role: "متخصص دارویی  |  Clinical Pharma Advisor",
  tagline: "دانش دارویی، دلسوزی انسانی.",
  taglineEn: "Pharmaceutical Knowledge, Human Compassion.",
  domain: "careerpreneuracademy.com",
  social: {
    instagram: "https://instagram.com/pharmasense",
    instagramHandle: "@pharmasense",
    telegram: "https://t.me/pharmasense",
    telegramHandle: "@pharmasense",
  },
  // معرفی ۳۰ ثانیه‌ای
  elevatorPitch:
    "من یک متخصص دارویی هستم. داروهایت را بررسی می‌کنم، تداخلاتشان را چک می‌کنم، و یک برنامه ساده و شخصی برایت می‌نویسم — به زبان آدم.",
} as const;

export type NavLink = { href: string; label: string };

export const navLinks: NavLink[] = [
  { href: "/", label: "خانه" },
  { href: "/services", label: "خدمات" },
  { href: "/about", label: "درباره من" },
  { href: "/booking", label: "رزرو مشاوره" },
];

// ارزش‌های برند
export const brandValues: { title: string; desc: string }[] = [
  {
    title: "اعتماد علمی",
    desc: "هر توصیه بر پایه دانش آکادمیک روز و مستندات معتبر پزشکی.",
  },
  {
    title: "همدلی انسانی",
    desc: "هر بیمار یک انسان است، نه یک پرونده؛ همراهی با دلسوزی واقعی.",
  },
  {
    title: "شخصی‌سازی",
    desc: "هیچ دو نفری مثل هم نیستند؛ راهکار هر فرد منحصربه‌فرد است.",
  },
  {
    title: "شفافیت",
    desc: "اطلاعات ساده، صادقانه و بدون پیچیدگی‌های غیرضروری.",
  },
];

// پیام‌های کلیدی برند
export const keyMessages: string[] = [
  "داروهایت را می‌شناسیم. تو را بیشتر.",
  "تداخل دارویی را قبل از اینکه آسیب بزند کشف کن — با تخصص بالینی، نه گوگل.",
  "ما یک گزارش شخصی می‌نویسیم — نه فقط اطلاعات عمومی.",
];

// خدمات — اولین خدمت: مشاوره دارویی (پولی)
export type Service = {
  slug: string;
  title: string;
  short: string;
  description: string;
  durationMin: number;
  priceIRR: number; // ریال — برای درگاه ایرانی (زرین‌پال)
  priceUSD: number; // دلار — برای درگاه بین‌المللی (Stripe)
  features: string[];
  available: boolean;
};

export const services: Service[] = [
  {
    slug: "consultation",
    title: "مشاوره دارویی شخصی",
    short: "بررسی کامل داروها، تداخلات و دوزبندی در یک جلسه اختصاصی.",
    description:
      "در این جلسه لیست داروهایت را با هم مرور می‌کنیم، تداخلات احتمالی را چک می‌کنیم و یک برنامه ساده و شخصی برایت می‌نویسم — به زبان آدم. مناسب برای افرادی که هم‌زمان چند دارو مصرف می‌کنند یا نگران عوارض و تداخل‌ها هستند.",
    durationMin: 45,
    priceIRR: 2_500_000, // ۲٬۵۰۰٬۰۰۰ ریال = ۲۵۰٬۰۰۰ تومان (نمونه — قابل تغییر)
    priceUSD: 49,
    features: [
      "مرور کامل لیست داروهای فعلی",
      "بررسی تداخلات دارویی خطرناک",
      "پیشنهاد دوزبندی و زمان‌بندی مصرف",
      "گزارش شخصی مکتوب بعد از جلسه",
    ],
    available: true,
  },
  {
    slug: "webinar",
    title: "وبینار و کلاس آنلاین",
    short: "دوره‌ها و وبینارهای آموزشی دارویی — به‌زودی.",
    description:
      "کلاس‌ها و وبینارهای آموزشی برای یادگیری اصول مصرف درست دارو. این بخش به‌زودی فعال می‌شود.",
    durationMin: 90,
    priceIRR: 0,
    priceUSD: 0,
    features: ["محتوای گام‌به‌گام", "پرسش و پاسخ زنده", "دسترسی به ضبط جلسات"],
    available: false,
  },
];

export function getService(slug: string): Service | undefined {
  return services.find((s) => s.slug === slug);
}
