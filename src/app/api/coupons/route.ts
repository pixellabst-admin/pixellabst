import { db } from "@/db";
import { coupons } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { applyCoupon, ensureCouponSeed } from "@/lib/coupons";
import { desc } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  await ensureCouponSeed();
  return NextResponse.json(await db.select().from(coupons).orderBy(desc(coupons.id)));
}

// Validación pública de un cupón contra un subtotal
export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    code?: string;
    subtotal?: number;
  };
  await ensureCouponSeed();
  const result = await applyCoupon(body.code ?? "", Math.max(0, Math.round(body.subtotal ?? 0)));
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as {
    code?: string;
    kind?: string;
    value?: number;
    minTotal?: number;
  };
  const code = (body.code ?? "").trim().toUpperCase();
  if (!code) return NextResponse.json({ error: "Código requerido" }, { status: 400 });

  const [created] = await db
    .insert(coupons)
    .values({
      code,
      kind: body.kind === "fixed" ? "fixed" : "percent",
      value: Math.max(0, Math.round(body.value ?? 0)),
      minTotal: Math.max(0, Math.round(body.minTotal ?? 0)),
      active: true,
    })
    .onConflictDoNothing()
    .returning();

  if (!created) return NextResponse.json({ error: "Ese cupón ya existe" }, { status: 409 });
  return NextResponse.json(created, { status: 201 });
}
