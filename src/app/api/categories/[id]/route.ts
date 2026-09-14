import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { count, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

type Context = { params: Promise<{ id: string }> };

type CategoryPayload = {
  name?: string;
  slug?: string;
  emoji?: string;
  description?: string;
  sortOrder?: number;
};

function validId(raw: string): number | null {
  const id = Number(raw);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function PATCH(request: Request, context: Context) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const id = validId(rawId);
  if (!id) return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });

  const body = (await request.json().catch(() => ({}))) as CategoryPayload;
  const patch: Record<string, unknown> = {};

  if (typeof body.name === "string") {
    const name = body.name.trim();
    if (!name || name.length > 120) {
      return NextResponse.json({ error: "Escribe un nombre válido" }, { status: 400 });
    }
    patch.name = name;
  }

  if (typeof body.slug === "string") {
    const slug = slugify(body.slug);
    if (!slug) return NextResponse.json({ error: "La URL no es válida" }, { status: 400 });

    const duplicate = await db
      .select({ id: categories.id })
      .from(categories)
      .where(eq(categories.slug, slug))
      .limit(1);
    if (duplicate[0] && duplicate[0].id !== id) {
      return NextResponse.json({ error: "Esa URL ya está en uso" }, { status: 409 });
    }
    patch.slug = slug;
  }

  if (typeof body.emoji === "string") patch.emoji = body.emoji.trim().slice(0, 16) || "📦";
  if (typeof body.description === "string") patch.description = body.description.trim();
  if (typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)) {
    patch.sortOrder = Math.max(0, Math.round(body.sortOrder));
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: "No hay cambios para guardar" }, { status: 400 });
  }

  try {
    const [updated] = await db.update(categories).set(patch).where(eq(categories.id, id)).returning();
    if (!updated) return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return NextResponse.json({ error: "Esa URL ya está en uso" }, { status: 409 });
    }
    throw error;
  }
}

export async function DELETE(_request: Request, context: Context) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const { id: rawId } = await context.params;
  const id = validId(rawId);
  if (!id) return NextResponse.json({ error: "Categoría inválida" }, { status: 400 });

  const [{ total }] = await db
    .select({ total: count() })
    .from(products)
    .where(eq(products.categoryId, id));

  if (Number(total) > 0) {
    return NextResponse.json(
      {
        error: `No se puede eliminar: esta categoría tiene ${total} producto(s). Muévelos primero a otra categoría.`,
      },
      { status: 409 },
    );
  }

  const [deleted] = await db.delete(categories).where(eq(categories.id, id)).returning();
  if (!deleted) return NextResponse.json({ error: "Categoría no encontrada" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
