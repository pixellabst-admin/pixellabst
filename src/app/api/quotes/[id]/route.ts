import { db } from "@/db";
import { quotes } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

const STATUSES = ["nueva", "contactado", "cotizado", "aceptada", "cerrada", "cancelada"];

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = (await request.json().catch(() => ({}))) as { status?: string; notes?: string };

  const patch: Record<string, unknown> = {};
  if (body.status) {
    if (!STATUSES.includes(body.status)) {
      return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
    }
    patch.status = body.status;
  }
  if (typeof body.notes === "string") patch.notes = body.notes;

  const [updated] = await db
    .update(quotes)
    .set(patch)
    .where(eq(quotes.id, Number(id)))
    .returning();
  if (!updated) return NextResponse.json({ error: "No encontrada" }, { status: 404 });
  return NextResponse.json(updated);
}

export async function DELETE(_request: Request, ctx: Ctx) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await db.delete(quotes).where(eq(quotes.id, Number(id)));
  return NextResponse.json({ ok: true });
}
