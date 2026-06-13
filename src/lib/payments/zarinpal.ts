// کمک‌توابع درگاه زرین‌پال (API نسخه ۴)
// مستندات: https://docs.zarinpal.com/paymentGateway/

function baseUrl() {
  const sandbox = process.env.ZARINPAL_SANDBOX === "true";
  return sandbox
    ? "https://sandbox.zarinpal.com/pg"
    : "https://payment.zarinpal.com/pg";
}

type RequestResult =
  | { ok: true; authority: string; paymentUrl: string }
  | { ok: false; error: string };

// درخواست پرداخت — مبلغ به ریال
export async function zarinpalRequest(params: {
  amountRial: number;
  description: string;
  callbackUrl: string;
  email?: string;
}): Promise<RequestResult> {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId) return { ok: false, error: "ZARINPAL_MERCHANT_ID تنظیم نشده." };

  try {
    const res = await fetch(`${baseUrl()}/v4/payment/request.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: params.amountRial,
        description: params.description,
        callback_url: params.callbackUrl,
        metadata: params.email ? { email: params.email } : undefined,
      }),
    });
    const json = await res.json();
    if (json?.data?.authority) {
      const authority = json.data.authority as string;
      return {
        ok: true,
        authority,
        paymentUrl: `${baseUrl()}/StartPay/${authority}`,
      };
    }
    const code = json?.errors?.code ?? "نامشخص";
    return { ok: false, error: `خطای زرین‌پال (کد ${code})` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "خطای شبکه" };
  }
}

type VerifyResult =
  | { ok: true; refId: string }
  | { ok: false; error: string };

// تأیید پرداخت پس از بازگشت کاربر
export async function zarinpalVerify(params: {
  authority: string;
  amountRial: number;
}): Promise<VerifyResult> {
  const merchantId = process.env.ZARINPAL_MERCHANT_ID;
  if (!merchantId) return { ok: false, error: "ZARINPAL_MERCHANT_ID تنظیم نشده." };

  try {
    const res = await fetch(`${baseUrl()}/v4/payment/verify.json`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        merchant_id: merchantId,
        amount: params.amountRial,
        authority: params.authority,
      }),
    });
    const json = await res.json();
    // code 100 = موفق، 101 = قبلاً تأیید شده
    if (json?.data?.code === 100 || json?.data?.code === 101) {
      return { ok: true, refId: String(json.data.ref_id) };
    }
    const code = json?.errors?.code ?? json?.data?.code ?? "نامشخص";
    return { ok: false, error: `تأیید ناموفق (کد ${code})` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "خطای شبکه" };
  }
}
