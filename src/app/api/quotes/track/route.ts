import { db } from "@/db";
import { quoteItems, quotes } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const code = (searchParams.get("code") ?? "").trim().toUpperCase();
  const email = (searchParams.get("email") ?? "").trim().toLowerCase();
  if (!code || !email) {
    return NextResponse.json({ error: "Indica el código y tu correo" }, { status: 400 });
  }

  const rows = await db
    .select()
    .from(quotes)
    .where(and(eq(quotes.code, code), eq(quotes.email, email)))
    .limit(1);

  const quote = rows[0];
  if (!quote) {
    return NextResponse.json({ error: "No encontramos esa cotización" }, { status: 404 });
  }

  const items = await db.select().from(quoteItems).where(eq(quoteItems.quoteId, quote.id));
  return NextResponse.json({ ...quote, items });
}
