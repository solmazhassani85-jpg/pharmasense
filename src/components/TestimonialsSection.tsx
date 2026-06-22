import RevealSection from "./RevealSection";

const testimonials = [
  {
    name: "سارا م.",
    role: "بیمار دیابت نوع ۲",
    text: "بعد از جلسه فهمیدم چرا متفورمینم باید با غذا خورده بشه. ساده توضیح داد — نه مثل پزشک‌هایی که وقت ندارن.",
    stars: 5,
    initial: "س",
  },
  {
    name: "علی ر.",
    role: "مراقب پدر سالمند",
    text: "پدرم ۶ تا دارو می‌خورد و کسی نگفته بود دو تاشون با هم تداخل دارن. این جلسه واقعاً مهم بود.",
    stars: 5,
    initial: "ع",
  },
  {
    name: "مریم ک.",
    role: "مراجع",
    text: "قبلاً از داروهام می‌ترسیدم. حالا می‌دونم چی می‌خورم و چرا. آرامش خاطر بهم داد.",
    stars: 5,
    initial: "م",
  },
];

export default function TestimonialsSection() {
  return (
    <section className="mx-auto max-w-6xl px-4 pb-20 sm:px-6">
      <RevealSection>
        <p className="eyebrow mb-2">نظرات مراجعین</p>
        <h2 className="mb-12 text-3xl font-bold text-frost">
          تجربه واقعی، نه تبلیغ
        </h2>
      </RevealSection>

      <div className="grid gap-5 sm:grid-cols-3">
        {testimonials.map((t, i) => (
          <RevealSection key={t.name} delay={i * 120}>
            <div className="glass-card-premium flex h-full flex-col rounded-2xl p-6">
              {/* ستاره‌ها */}
              <div className="mb-4 flex gap-0.5">
                {Array.from({ length: t.stars }).map((_, j) => (
                  <svg
                    key={j}
                    viewBox="0 0 24 24"
                    className="h-4 w-4 fill-warning text-warning"
                    aria-hidden="true"
                  >
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                  </svg>
                ))}
              </div>

              {/* متن نظر */}
              <p className="flex-1 text-sm leading-7 text-pale/85">
                &ldquo;{t.text}&rdquo;
              </p>

              {/* هویت */}
              <div className="mt-5 flex items-center gap-3 border-t border-white/[0.07] pt-4">
                <div className="icon-glow flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-sm font-bold text-frost">
                  {t.initial}
                </div>
                <div>
                  <p className="text-sm font-semibold text-frost">{t.name}</p>
                  <p className="text-xs text-pale/50">{t.role}</p>
                </div>
              </div>
            </div>
          </RevealSection>
        ))}
      </div>
    </section>
  );
}
