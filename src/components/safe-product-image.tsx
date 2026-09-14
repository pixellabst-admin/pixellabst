"use client";

import { useMemo } from "react";

function escapeXml(value: string): string {
  return value.replace(/[<>&'\"]/g, (char) => {
    const map: Record<string, string> = {
      "<": "&lt;",
      ">": "&gt;",
      "&": "&amp;",
      "'": "&apos;",
      '"': "&quot;",
    };
    return map[char];
  });
}

/**
 * Genera una portada SVG compacta para cuando una foto no se encuentre.
 * No usa red ni archivos externos, por lo que nunca muestra el icono roto.
 */
function placeholder(label: string): string {
  const clean = escapeXml((label || "Producto 3D").slice(0, 28));
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#0f766e"/>
        <stop offset="1" stop-color="#4338ca"/>
      </linearGradient>
      <filter id="s" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="18" stdDeviation="18" flood-opacity=".22"/>
      </filter>
    </defs>
    <rect width="800" height="800" fill="url(#g)"/>
    <circle cx="90" cy="120" r="170" fill="#fff" opacity=".10"/>
    <circle cx="710" cy="690" r="250" fill="#fff" opacity=".08"/>
    <g filter="url(#s)">
      <path d="M255 298 400 214l145 84v168L400 550 255 466Z" fill="#fff" opacity=".97"/>
      <path d="M400 214v168l145-84Z" fill="#c7d2fe"/>
      <path d="M400 382 255 298v168l145 84Z" fill="#ccfbf1"/>
      <path d="m350 411 50 29 50-29v58l-50 29-50-29Z" fill="#0f766e" opacity=".88"/>
    </g>
    <text x="400" y="650" text-anchor="middle" fill="#fff" font-family="Arial, Helvetica, sans-serif" font-size="35" font-weight="700">Impresión 3D</text>
    <text x="400" y="700" text-anchor="middle" fill="#d1fae5" font-family="Arial, Helvetica, sans-serif" font-size="25">${clean}</text>
  </svg>`;
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}

export function SafeProductImage({
  src,
  alt,
  label,
  className,
}: {
  src?: string | null;
  alt: string;
  label?: string;
  className?: string;
}) {
  const fallback = useMemo(() => placeholder(label || alt), [label, alt]);
  const imageSrc = src || fallback;

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      onError={(event) => {
        // Evita un ciclo si por alguna razón el SVG también falla.
        if (!event.currentTarget.src.startsWith("data:image/svg+xml")) {
          event.currentTarget.src = fallback;
        }
      }}
    />
  );
}
