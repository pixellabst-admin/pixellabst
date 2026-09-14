import { isAdmin } from "@/lib/auth";
import { getSettings, saveSettings } from "@/lib/settings";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await getSettings());
}

export async function PUT(request: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }
  const body = (await request.json().catch(() => ({}))) as Record<string, string>;
  await saveSettings(body);
  return NextResponse.json(await getSettings());
}
