/**
 * Normaliza lo que el dueño escribe en los campos de redes sociales.
 * Acepta un @usuario, un nombre de página o una URL completa,
 * y siempre devuelve una URL https:// válida (o "" si está vacío).
 */

function clean(value: string): string {
  return (value ?? "").trim();
}

function ensureUrl(value: string, base: string): string {
  const v = clean(value);
  if (!v) return "";
  // Ya es una URL completa
  if (/^https?:\/\//i.test(v)) return v;
  // Sin protocolo pero parece dominio (contiene punto y sin espacios)
  if (/^[\w-]+(\.[\w-]+)+(\/\S*)?$/.test(v)) return `https://${v}`;
  // Es un @usuario o nombre: quitar @ y espacios, construir URL base
  const handle = v.replace(/^@+/, "").replace(/\s+/g, "");
  if (!handle) return "";
  return `${base}${encodeURIComponent(handle)}`;
}

export function facebookUrl(value: string): string {
  const v = clean(value);
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (/facebook\.com|fb\.com|fb\.me/i.test(v)) return ensureUrl(v, "https://");
  return ensureUrl(v, "https://www.facebook.com/");
}

export function instagramUrl(value: string): string {
  const v = clean(value);
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (/instagram\.com|instagr\.am/i.test(v)) return ensureUrl(v, "https://");
  return ensureUrl(v, "https://www.instagram.com/");
}

export function tiktokUrl(value: string): string {
  const v = clean(value);
  if (!v) return "";
  if (/^https?:\/\//i.test(v)) return v;
  if (/tiktok\.com/i.test(v)) return ensureUrl(v, "https://");
  return ensureUrl(v, "https://www.tiktok.com/@");
}

export type SocialLinks = {
  facebook: string;
  instagram: string;
  tiktok: string;
};

export function getSocialLinks(settings: {
  facebook?: string;
  instagram?: string;
  tiktok?: string;
}): SocialLinks {
  return {
    facebook: facebookUrl(settings.facebook ?? ""),
    instagram: instagramUrl(settings.instagram ?? ""),
    tiktok: tiktokUrl(settings.tiktok ?? ""),
  };
}

export function hasAnySocial(links: SocialLinks): boolean {
  return Boolean(links.facebook || links.instagram || links.tiktok);
}
