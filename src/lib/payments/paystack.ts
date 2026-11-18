import crypto from "crypto";

const PAYSTACK_BASE = "https://api.paystack.co";

export function paystackSecret(): string {
  return process.env.PAYSTACK_SECRET_KEY ?? "";
}

export function isPaystackConfigured(): boolean {
  return Boolean(process.env.PAYSTACK_SECRET_KEY);
}

export interface PaystackInitParams {
  email: string;
  amountKobo: number;
  reference: string;
  callbackUrl: string;
  metadata?: Record<string, string | number | boolean | null>;
}

export async function initializePaystackTransaction(
  params: PaystackInitParams
): Promise<{ authorizationUrl: string; reference: string }> {
  const secret = paystackSecret();
  if (!secret) {
    // Demo fallback: return an internal success-simulation URL so the portal remains fully clickable
    const url = `/donate/success?gateway=paystack&reference=${encodeURIComponent(
      params.reference
    )}&demo=1`;
    return { authorizationUrl: url, reference: params.reference };
  }
  const res = await fetch(`${PAYSTACK_BASE}/transaction/initialize`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${secret}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: params.email,
      amount: Math.round(params.amountKobo),
      reference: params.reference,
      callback_url: params.callbackUrl,
      metadata: params.metadata ?? {},
    }),
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Paystack init failed: ${text.slice(0, 400)}`);
  }
  const json = (await res.json()) as {
    status: boolean;
    data?: { authorization_url: string; reference: string };
  };
  if (!json.status || !json.data) throw new Error("Paystack init returned no URL");
  return {
    authorizationUrl: json.data.authorization_url,
    reference: json.data.reference,
  };
}

export async function verifyPaystackTransaction(reference: string): Promise<{
  paid: boolean;
  amountKobo: number;
  email: string;
}> {
  const secret = paystackSecret();
  if (!secret) return { paid: true, amountKobo: 0, email: "" };
  const res = await fetch(
    `${PAYSTACK_BASE}/transaction/verify/${encodeURIComponent(reference)}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
      cache: "no-store",
    }
  );
  if (!res.ok) return { paid: false, amountKobo: 0, email: "" };
  const json = (await res.json()) as {
    status: boolean;
    data?: { status: string; amount: number; customer?: { email?: string } };
  };
  const paid = json.status && json.data?.status === "success";
  return {
    paid,
    amountKobo: json.data?.amount ?? 0,
    email: json.data?.customer?.email ?? "",
  };
}

export function verifyPaystackSignature(rawBody: string, signature: string | null): boolean {
  const secret = paystackSecret();
  if (!secret) return true; // demo mode
  if (!signature) return false;
  const hash = crypto.createHmac("sha512", secret).update(rawBody).digest("hex");
  return hash === signature;
}
