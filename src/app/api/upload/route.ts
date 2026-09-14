import { db } from "@/db";
import { media } from "@/db/schema";
import { isAdmin } from "@/lib/auth";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_BYTES = 5 * 1024 * 1024;

export async function POST(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Archivo requerido" }, { status: 400 });
  }
  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "El archivo debe ser una imagen" }, { status: 400 });
  }
  const buffer = Buffer.from(await file.arrayBuffer());
  if (buffer.byteLength > MAX_BYTES) {
    return NextResponse.json({ error: "La imagen supera los 5 MB" }, { status: 400 });
  }

  const [row] = await db
    .insert(media)
    .values({
      filename: file.name || "imagen",
      mime: file.type,
      data: buffer.toString("base64"),
    })
    .returning({ id: media.id });

  return NextResponse.json({ url: `/api/media/${row.id}`, id: row.id }, { status: 201 });
}
