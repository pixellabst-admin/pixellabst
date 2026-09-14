import { db } from "@/db";
import { coupons } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export type CouponResult =
  | { ok: true; code: string; discount: number; label: string }
  | { ok: false; error: string };

export async function applyCoupon(rawCode: string, subtotal: number): Promise<CouponResult> {
  const code = rawCode.trim().toUpperCase();
  if (!code) return { ok: false, error: "Escribe un código" };

  const rows = await db.select().from(coupons).where(eq(coupons.code, code)).limit(1);
  const coupon = rows[0];
  if (!coupon || !coupon.active) return { ok: false, error: "Cupón no válido" };
  if (subtotal < coupon.minTotal)
    return { ok: false, error: "Tu compra no alcanza el mínimo para este cupón" };

  const discount =
    coupon.kind === "percent"
      ? Math.round((subtotal * coupon.value) / 100)
      : Math.min(coupon.value, subtotal);

  return {
    ok: true,
    code: coupon.code,
    discount,
    label: coupon.kind === "percent" ? `${coupon.value}% de descuento` : "Descuento fijo",
  };
}

export async function markCouponUsed(code: string) {
  if (!code) return;
  await db
    .update(coupons)
    .set({ usedCount: sql`${coupons.usedCount} + 1` })
    .where(eq(coupons.code, code));
}

export async function ensureCouponSeed() {
  await db
    .insert(coupons)
    .values([
      { code: "BIENVENIDO10", kind: "percent", value: 10, minTotal: 0, active: true },
      { code: "ENVIOGRATIS", kind: "fixed", value: 599, minTotal: 5000, active: true },
    ])
    .onConflictDoNothing();
}
