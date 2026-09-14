import { db } from "@/db";
import { settings } from "@/db/schema";
import { sql } from "drizzle-orm";

export type SiteSettings = {
  storeName: string;
  tagline: string;
  heroText: string;
  whatsapp: string;
  email: string;
  shippingCents: string;
  whatsappEnabled: string;
  whatsappGreeting: string;
  whatsappHours: string;
  facebook: string;
  instagram: string;
  tiktok: string;
};

export const DEFAULT_SETTINGS: SiteSettings = {
  storeName: "Taller 3D",
  tagline: "Impresión 3D con diseño propio",
  heroText:
    "Piezas impresas en 3D para tu oficina, tu hogar y tu colección. Personalizamos colores, tamaños y logotipos.",
  whatsapp: "+1 305 555 0134",
  email: "hola@taller3d.com",
  shippingCents: "599",
  whatsappEnabled: "1",
  whatsappGreeting: "¡Hola! Vengo de su página web y quiero más información 😊",
  whatsappHours: "Lunes a viernes de 9:00 a 19:00 · Sábados de 10:00 a 14:00",
  facebook: "",
  instagram: "",
  tiktok: "",
};

export async function getSettings(): Promise<SiteSettings> {
  try {
    const rows = await db.select().from(settings);
    const map = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    return { ...DEFAULT_SETTINGS, ...map } as SiteSettings;
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export async function saveSettings(values: Record<string, string>) {
  const entries = Object.entries(values).filter(([k]) => k in DEFAULT_SETTINGS);
  for (const [key, value] of entries) {
    await db
      .insert(settings)
      .values({ key, value: String(value ?? "") })
      .onConflictDoUpdate({
        target: settings.key,
        set: { value: sql`excluded.value` },
      });
  }
}
