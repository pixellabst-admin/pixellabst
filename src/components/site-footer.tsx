"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { SocialLinks } from "@/lib/social";
import { hasAnySocial } from "@/lib/social";

function FacebookIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M22 12.06C22 6.5 17.52 2 12 2S2 6.5 2 12.06c0 5.02 3.66 9.18 8.44 9.94v-7.03H7.9v-2.9h2.54V9.85c0-2.52 1.5-3.9 3.78-3.9 1.09 0 2.24.2 2.24.2v2.47H15.2c-1.24 0-1.63.78-1.63 1.57v1.88h2.78l-.45 2.9h-2.33V22c4.78-.76 8.43-4.92 8.43-9.94Z" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23a3.7 3.7 0 0 1-.9 1.38c-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16M12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63a5.7 5.7 0 0 0-2.07 1.35A5.7 5.7 0 0 0 .72 4.05C.42 4.81.22 5.69.16 6.96.1 8.24.09 8.65.09 11.91s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.31.8.72 1.47 1.35 2.1a5.7 5.7 0 0 0 2.07 1.35c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.7 5.7 0 0 0 2.07-1.35 5.7 5.7 0 0 0 1.35-2.07c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.7 5.7 0 0 0-1.35-2.07A5.7 5.7 0 0 0 19.86.72C19.1.42 18.22.22 16.95.16 15.67.1 15.26.09 12 .09V0h0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.15A4 4 0 1 1 16 12a4 4 0 0 1-4 3.99Zm7.85-10.4a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0Z" />
    </svg>
  );
}

function TiktokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.3 0 .58.05.85.13V9.4a6.33 6.33 0 0 0-.85-.08A6.34 6.34 0 0 0 5.16 20.5a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1.2-.1Z" />
    </svg>
  );
}

export function SiteFooter({
  storeName,
  email,
  whatsapp,
  social,
}: {
  storeName: string;
  email: string;
  whatsapp: string;
  social: SocialLinks;
}) {
  const pathname = usePathname();
  if (pathname.startsWith("/admin")) return null;

  const showSocial = hasAnySocial(social);

  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-10 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="flex items-center gap-2 font-black tracking-tight">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-gradient-to-br from-teal-500 to-indigo-600 text-sm text-white">
              3D
            </span>
            {storeName}
          </p>
          <p className="mt-2 text-sm text-slate-500">
            © {new Date().getFullYear()} {storeName}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {email}
            {email && whatsapp ? " · " : ""}
            {whatsapp}
          </p>
        </div>

        <div className="flex flex-col gap-3">
          <nav className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-slate-600">
            <Link href="/" className="hover:text-slate-900 hover:underline">
              Inicio
            </Link>
            <Link href="/cotizar" className="hover:text-slate-900 hover:underline">
              Cotizar
            </Link>
            <Link href="/cotizacion" className="hover:text-slate-900 hover:underline">
              Mis cotizaciones
            </Link>
            <a href="/#contacto" className="hover:text-slate-900 hover:underline">
              Contacto
            </a>
          </nav>

          {showSocial && (
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                Síguenos
              </p>
              <div className="mt-2 flex gap-2">
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    title="Facebook"
                    className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-[#1877F2] hover:text-white"
                  >
                    <FacebookIcon />
                  </a>
                )}
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    title="Instagram"
                    className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-gradient-to-br hover:from-amber-500 hover:via-pink-600 hover:to-purple-600 hover:text-white"
                  >
                    <InstagramIcon />
                  </a>
                )}
                {social.tiktok && (
                  <a
                    href={social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    title="TikTok"
                    className="grid h-10 w-10 place-items-center rounded-full bg-slate-100 text-slate-600 transition hover:bg-slate-900 hover:text-white"
                  >
                    <TiktokIcon />
                  </a>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
