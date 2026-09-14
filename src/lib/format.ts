/** Moneda de la tienda: dólar estadounidense */
export const CURRENCY = "USD";
export const CURRENCY_LABEL = "USD";
export const CURRENCY_SYMBOL = "$";
const CURRENCY_LOCALE = "en-US";

export function formatPrice(cents: number): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE, {
    style: "currency",
    currency: CURRENCY,
    minimumFractionDigits: 2,
  }).format((cents || 0) / 100);
}

export function toCents(input: string | number): number {
  const n = typeof input === "number" ? input : parseFloat(String(input).replace(",", "."));
  if (!isFinite(n) || n < 0) return 0;
  return Math.round(n * 100);
}

export function fromCents(cents: number | null | undefined): string {
  return ((cents ?? 0) / 100).toFixed(2);
}

export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 120);
}
