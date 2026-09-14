import { db } from "@/db";
import { products, quoteItems, quotes } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { applyCoupon } from "@/lib/coupons";
import { desc, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const rows = await db.select().from(quotes).orderBy(desc(quotes.id)).limit(200);
  const ids = rows.map((r) => r.id);
  const items = ids.length
    ? await db.select().from(quoteItems).where(inArray(quoteItems.quoteId, ids))
    : [];
  return NextResponse.json(
    rows.map((quote) => ({
      ...quote,
      items: items.filter((i) => i.quoteId === quote.id),
    })),
  );
}

type Line = { productId: number; quantity: number };

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as {
    customerName?: string;
    email?: string;
    phone?: string;
    city?: string;
    notes?: string;
    couponCode?: string;
    items?: Line[];
  };

  const lines = (body.items ?? []).filter((l) => l.productId && l.quantity > 0);
  if (!body.customerName || !body.email || lines.length === 0) {
    return NextResponse.json(
      { error: "Faltan tus datos o no hay productos en la lista" },
      { status: 400 },
    );
  }

  const ids = lines.map((l) => l.productId);
  const found = await db.select().from(products).where(inArray(products.id, ids));

  const resolved = lines
    .map((line) => {
      const product = found.find((p) => p.id === line.productId);
      if (!product) return null;
      return { product, quantity: Math.min(Math.max(1, Math.round(line.quantity)), 999) };
    })
    .filter((v): v is { product: (typeof found)[number]; quantity: number } => v !== null);

  if (resolved.length === 0) {
    return NextResponse.json({ error: "Los productos ya no están disponibles" }, { status: 400 });
  }

  const estimatedTotal = resolved.reduce((sum, r) => sum + r.product.price * r.quantity, 0);

  let couponCode = "";
  if (body.couponCode) {
    const result = await applyCoupon(body.couponCode, estimatedTotal);
    if (result.ok) couponCode = result.code;
  }

  const code = `C${Date.now().toString().slice(-8)}`;

  const [quote] = await db
    .insert(quotes)
    .values({
      code,
      customerName: body.customerName.trim(),
      email: body.email.trim().toLowerCase(),
      phone: body.phone ?? "",
      city: body.city ?? "",
      notes: body.notes ?? "",
      estimatedTotal,
      couponCode,
      status: "nueva",
      sentToWhatsapp: true,
    })
    .returning();

  await db.insert(quoteItems).values(
    resolved.map((r) => ({
      quoteId: quote.id,
      productId: r.product.id,
      name: r.product.name,
      unitPrice: r.product.price,
      quantity: r.quantity,
    })),
  );

  return NextResponse.json(
    { code: quote.code, id: quote.id, estimatedTotal, couponCode },
    { status: 201 },
  );
}
