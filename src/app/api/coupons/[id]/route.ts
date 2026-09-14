import { db } from "@/db";
import { coupons } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const patch: Record<string, unknown> = {};
  if (typeof body.active === "boolean") patch.active = body.active;
  if (typeof body.value === "number") patch.value = Math.max(0, Math.round(body.value));
  if (typeof body.minTotal === "number") patch.minTotal = Math.max(0, Math.round(body.minTotal));

  const [updated] = await db
    .update(coupons)
    .set(patch)
    .where(eq(coupons.id, Number(id)))
    .returning();
  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db.delete(coupons).where(eq(coupons.id, Number(id)));
  return NextResponse.json({ ok: true });
}
