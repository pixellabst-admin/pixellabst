import { db } from "@/db";
import { media } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function GET(_request: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const rows = await db
    .select()
    .from(media)
    .where(eq(media.id, Number(id)))
    .limit(1);
  const row = rows[0];
  if (!row) return NextResponse.json({ error: "No encontrado" }, { status: 404 });

  const buffer = Buffer.from(row.data, "base64");
  return new NextResponse(new Uint8Array(buffer), {
    headers: {
      "Content-Type": row.mime,
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
