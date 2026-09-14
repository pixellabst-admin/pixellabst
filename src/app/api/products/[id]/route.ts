import { db } from "@/db";
import { products } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const productId = Number(id);
  if (!Number.isFinite(productId)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = (await request.json().catch(() => ({}))) as Record<string, unknown>;
  const patch: Record<string, unknown> = { updatedAt: new Date() };

  if (typeof body.name === "string" && body.name.trim()) {
    patch.name = body.name.trim();
    patch.slug = `${slugify(body.name)}-${productId}`;
  }
  if (typeof body.description === "string") patch.description = body.description;
  if (typeof body.price === "number") patch.price = Math.max(0, Math.round(body.price));
  if (body.compareAtPrice === null) patch.compareAtPrice = null;
  if (typeof body.compareAtPrice === "number")
    patch.compareAtPrice = Math.max(0, Math.round(body.compareAtPrice));
  if (typeof body.categoryId === "number") patch.categoryId = body.categoryId;
  if (typeof body.imageUrl === "string") patch.imageUrl = body.imageUrl;
  if (typeof body.stock === "number") patch.stock = Math.max(0, Math.round(body.stock));
  if (typeof body.active === "boolean") patch.active = body.active;
  if (typeof body.featured === "boolean") patch.featured = body.featured;

  const [updated] = await db
    .update(products)
    .set(patch)
    .where(eq(products.id, productId))
    .returning();

  if (!updated) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db.delete(products).where(eq(products.id, Number(id)));
  return NextResponse.json({ ok: true });
}
