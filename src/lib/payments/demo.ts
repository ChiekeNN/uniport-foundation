/**
 * Demo payment mode.
 *
 * The portal ships with a fully clickable, self-contained payment rehearsal so
 * the board can test the donor journey before live keys exist:
 *
 *   donate form → /donate/checkout (simulated gateway) → gift VERIFIED
 *   → campaign totals, Donor Wall and the admin Gift Register all update.
 *
 * It switches ON automatically when neither Paystack nor Stripe is configured,
 * and can be forced either way with DEMO_PAYMENTS=true|false. When it is off,
 * real gateway redirects are used and no simulated confirmation is possible.
 */

export function isDemoPayments(): boolean {
  const flag = process.env.DEMO_PAYMENTS;
  if (flag === "true") return true;
  if (flag === "false") return false;
  return !process.env.PAYSTACK_SECRET_KEY && !process.env.STRIPE_SECRET_KEY;
}

/** Demo gift references carry this prefix so they can be reset in one action. */
export const DEMO_REF_PREFIX = "demo_";

export function isDemoReference(reference: string | null | undefined): boolean {
  return Boolean(reference && reference.startsWith(DEMO_REF_PREFIX));
}
