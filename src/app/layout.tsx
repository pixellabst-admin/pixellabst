import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { CartDrawer } from "@/components/cart-drawer";
import { CartProvider } from "@/components/cart-provider";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappButton } from "@/components/whatsapp-button";
import { isValidWhatsapp } from "@/lib/whatsapp";
import { getCategories } from "@/lib/queries";
import { DEFAULT_SETTINGS, getSettings } from "@/lib/settings";
import { getSocialLinks } from "@/lib/social";

export const metadata: Metadata = {
  title: "Taller 3D | Tienda de impresión 3D",
  description: "Catálogo de productos impresos en 3D. Arma tu lista y cotiza por WhatsApp.",
};

export default async function RootLayout({ children }: { children: ReactNode }) {
  let settings = DEFAULT_SETTINGS;
  let categories: { slug: string; name: string; emoji: string }[] = [];
  try {
    const [loaded, cats] = await Promise.all([getSettings(), getCategories()]);
    settings = loaded;
    categories = cats.map((c) => ({ slug: c.slug, name: c.name, emoji: c.emoji }));
  } catch {
    categories = [];
  }

  const showWhatsapp = settings.whatsappEnabled !== "0" && isValidWhatsapp(settings.whatsapp);

  return (
    <html lang="es">
      <head>
        {/* Respaldo estático: evita estilos vacíos en despliegues de Vercel. */}
        <link rel="stylesheet" href="/site.css?v=20260914-2" />
      </head>
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <CartProvider>
          <SiteHeader storeName={settings.storeName} categories={categories} />
          <main>{children}</main>
          <SiteFooter
            storeName={settings.storeName}
            email={settings.email}
            whatsapp={settings.whatsapp}
            social={getSocialLinks(settings)}
          />
          <CartDrawer
            whatsapp={showWhatsapp ? settings.whatsapp : undefined}
            storeName={settings.storeName}
          />
          {showWhatsapp && (
            <WhatsappButton
              phone={settings.whatsapp}
              storeName={settings.storeName}
              greeting={settings.whatsappGreeting}
              hours={settings.whatsappHours}
            />
          )}
        </CartProvider>
      </body>
    </html>
  );
}
