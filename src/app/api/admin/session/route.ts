import { ADMIN_COOKIE, adminPassword, isAdmin, sessionToken } from "@/lib/auth";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ authenticated: await isAdmin() });
}

export async function POST(request: Request) {
  const body = (await request.json().catch(() => ({}))) as { password?: string };
  if (!body.password || body.password !== adminPassword()) {
    return NextResponse.json({ error: "Contraseña incorrecta" }, { status: 401 });
  }
  const store = await cookies();
  // 8 horas por defecto. Puedes cambiarlo en Vercel con ADMIN_SESSION_HOURS.
  const configuredHours = Number(process.env.ADMIN_SESSION_HOURS ?? 8);
  const sessionHours = Number.isFinite(configuredHours)
    ? Math.min(Math.max(configuredHours, 1), 24 * 30)
    : 8;
  store.set(ADMIN_COOKIE, sessionToken(), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: Math.round(sessionHours * 60 * 60),
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE);
  return NextResponse.json({ ok: true });
}
