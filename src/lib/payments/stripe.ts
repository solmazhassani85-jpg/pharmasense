import Stripe from "stripe";

let _stripe: Stripe | null = null;

// نمونه‌ی Stripe (lazy) — فقط سمت سرور.
export function getStripe(): Stripe {
  if (_stripe) return _stripe;
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new Error("STRIPE_SECRET_KEY تنظیم نشده.");
  _stripe = new Stripe(key);
  return _stripe;
}
