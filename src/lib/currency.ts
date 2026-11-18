import type { Currency } from "@/types/database";

export const FX_TO_NGN: Record<Currency, number> = {
  NGN: 1,
  USD: 1500,
  GBP: 1900,
  EUR: 1620,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  NGN: "₦",
  USD: "$",
  GBP: "£",
  EUR: "€",
};

export function toNgn(amount: number, currency: Currency): number {
  return Math.round(amount * FX_TO_NGN[currency]);
}

export function formatMoney(amount: number, currency: Currency): string {
  const symbol = CURRENCY_SYMBOLS[currency];
  const rounded = Math.round(amount);
  return `${symbol}${rounded.toLocaleString("en-US")}`;
}

export function formatNgn(amount: number): string {
  return formatMoney(amount, "NGN");
}

export function convertFromNgn(amountNgn: number, target: Currency): number {
  if (target === "NGN") return amountNgn;
  return amountNgn / FX_TO_NGN[target];
}

export function formatNgnAs(amountNgn: number, display: Currency): string {
  return formatMoney(convertFromNgn(amountNgn, display), display);
}

export function progressPct(raised: number, target: number): number {
  if (!target || target <= 0) return 0;
  return Math.min(100, Math.max(0, (raised / target) * 100));
}

export const PRESETS: Record<Currency, number[]> = {
  NGN: [5000, 25000, 100000, 500000, 1000000],
  USD: [25, 100, 250, 1000, 5000],
  GBP: [20, 75, 200, 750, 3000],
  EUR: [25, 100, 250, 1000, 4000],
};
