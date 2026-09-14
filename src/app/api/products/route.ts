import { db } from "@/db";
import { products } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/format";
import { listProducts } from "@/lib/queries";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const admin = await isAdmin();
  const rows = await listProducts({
    category: searchParams.get("category") || undefined,
    q: searchParams.get("q") || undefined,
    includeInactive: admin && searchParams.get("all") === "1",
  });
  return NextResponse.json(rows);
}

type Payload = {
  name?: string;
  description?: string;
  price?: number;
  compareAtPrice?: number | null;
  categoryId?: number;
  imageUrl?: string;
  stock?: number;
  active?: boolean;
  featured?: boolean;
};

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as Payload;
  if (!body.name || !body.categoryId) {
    return NextResponse.json({ error: "Nombre y categoría son obligatorios" }, { status: 400 });
  }

  let slug = slugify(body.name) || `producto-${Date.now()}`;
  const clash = await db.select({ id: products.id }).from(products).where(eq(products.slug, slug)).limit(1);
  if (clash.length > 0) slug = `${slug}-${Date.now().toString().slice(-5)}`;

  const [created] = await db
    .insert(products)
    .values({
      slug,
      name: body.name,
      description: body.description ?? "",
      price: Math.max(0, Math.round(body.price ?? 0)),
      compareAtPrice: body.compareAtPrice ? Math.round(body.compareAtPrice) : null,
      categoryId: body.categoryId,
      imageUrl: body.imageUrl ?? "",
      stock: Math.max(0, Math.round(body.stock ?? 0)),
      active: body.active ?? true,
      featured: body.featured ?? false,
    })
    .returning();

  return NextResponse.json(created, { status: 201 });
}
