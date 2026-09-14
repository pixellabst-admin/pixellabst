import { db } from "@/db";
import { categories } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { getCategories } from "@/lib/queries";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type CategoryPayload = {
  name?: string;
  slug?: string;
  emoji?: string;
  description?: string;
  sortOrder?: number;
};

export async function GET() {
  const rows = await getCategories();
  return NextResponse.json(rows);
}

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const body = (await request.json().catch(() => ({}))) as CategoryPayload;
  const name = body.name?.trim();
  const slug = slugify(body.slug?.trim() || name || "");

  if (!name || name.length > 120 || !slug) {
    return NextResponse.json(
      { error: "Escribe un nombre válido para la categoría" },
      { status: 400 },
    );
  }

  const existing = await getCategories();
  if (existing.some((category) => category.slug === slug)) {
    return NextResponse.json(
      { error: "Ya existe una categoría con ese nombre o URL" },
      { status: 409 },
    );
  }

  const nextSortOrder = existing.reduce((max, category) => Math.max(max, category.sortOrder), 0) + 1;
  const [created] = await db
    .insert(categories)
    .values({
      name,
      slug,
      emoji: body.emoji?.trim().slice(0, 16) || "📦",
      description: body.description?.trim() || "",
      sortOrder:
        typeof body.sortOrder === "number" && Number.isFinite(body.sortOrder)
          ? Math.max(0, Math.round(body.sortOrder))
          : nextSortOrder,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
