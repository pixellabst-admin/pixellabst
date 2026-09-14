import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const ART: Record<string, { title: string; subtitle: string; icon: string; a: string; b: string }> = {
  "oficina.jpg": {
    title: "Oficina",
    subtitle: "Organiza tu espacio",
    icon: "⌘",
    a: "#0f766e",
    b: "#164e63",
  },
  "llaveros.jpg": {
    title: "Llaveros",
    subtitle: "Personalizados para ti",
    icon: "✦",
    a: "#a21caf",
    b: "#4f46e5",
  },
  "hogar.jpg": {
    title: "Hogar",
    subtitle: "Diseño para cada rincón",
    icon: "⌂",
    a: "#c2410c",
    b: "#b45309",
  },
  "figuras.jpg": {
    title: "Figuras 3D",
    subtitle: "Colecciona lo extraordinario",
    icon: "◇",
    a: "#4338ca",
    b: "#312e81",
  },
  "juguetes.jpg": {
    title: "Juguetes",
    subtitle: "Imagina, juega, crea",
    icon: "★",
    a: "#be123c",
    b: "#c2410c",
  },
  "hero.jpg": {
    title: "PixelLabs Studio",
    subtitle: "Diseño e impresión 3D",
    icon: "3D",
    a: "#0f172a",
    b: "#0f766e",
  },
};

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (char) => {
    const chars: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return chars[char];
  });
}

function artwork(item: (typeof ART)[string]): string {
  const title = escapeXml(item.title);
  const subtitle = escapeXml(item.subtitle);
  const icon = escapeXml(item.icon);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 900" role="img" aria-label="${title}">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="${item.a}"/>
      <stop offset="1" stop-color="${item.b}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="36%" r="65%">
      <stop offset="0" stop-color="#fff" stop-opacity=".27"/>
      <stop offset="1" stop-color="#fff" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="25" stdDeviation="22" flood-color="#000" flood-opacity=".28"/>
    </filter>
  </defs>
  <rect width="1200" height="900" fill="url(#bg)"/>
  <rect width="1200" height="900" fill="url(#glow)"/>
  <circle cx="92" cy="80" r="230" fill="#fff" fill-opacity=".07"/>
  <circle cx="1110" cy="810" r="310" fill="#fff" fill-opacity=".08"/>
  <g opacity=".16" stroke="#fff" stroke-width="2" fill="none">
    <path d="M0 710 1200 340M0 810 1200 440M200 900 1200 590"/>
    <path d="M112 0 552 900M370 0 810 900M630 0 1070 900"/>
  </g>
  <g filter="url(#shadow)">
    <path d="M436 319 600 224l164 95v190L600 604 436 509Z" fill="#fff" fill-opacity=".96"/>
    <path d="M600 224v190l164-95Z" fill="#c7d2fe"/>
    <path d="M600 414 436 319v190l164 95Z" fill="#ccfbf1"/>
    <path d="m542 414 58 34 58-34v69l-58 34-58-34Z" fill="${item.a}"/>
  </g>
  <text x="600" y="410" text-anchor="middle" dominant-baseline="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="78" font-weight="800">${icon}</text>
  <text x="600" y="710" text-anchor="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="58" font-weight="800">${title}</text>
  <text x="600" y="764" text-anchor="middle" fill="#e2e8f0" font-family="Arial, Helvetica, sans-serif" font-size="27">${subtitle}</text>
</svg>`;
}

/**
 * Respaldo para las imágenes de catálogo de ejemplo.
 * Si los JPG originales están en public/images, Next sirve esos archivos.
 * Si no fueron subidos al deployment, esta ruta responde una ilustración SVG
 * para que la tienda nunca entregue una imagen rota.
 */
export async function GET(_request: Request, context: { params: Promise<{ filename: string }> }) {
  const { filename } = await context.params;
  const item = ART[filename] ?? {
    title: "Producto 3D",
    subtitle: "Diseñado para ti",
    icon: "3D",
    a: "#0f766e",
    b: "#4338ca",
  };

  return new NextResponse(artwork(item), {
    headers: {
      "Content-Type": "image/svg+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
