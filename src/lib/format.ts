// قالب‌بندی قیمت‌ها

export function formatToman(irr: number): string {
  // ریال → تومان
  const toman = Math.round(irr / 10);
  return toman.toLocaleString("fa-IR") + " تومان";
}

export function formatUSD(usd: number): string {
  return "$" + usd.toLocaleString("en-US");
}
