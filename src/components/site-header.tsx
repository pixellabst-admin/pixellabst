"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./cart-provider";

type Cat = { slug: string; name: string; emoji: string };

export function SiteHeader({
  storeName,
  categories,
}: {
  storeName: string;
  categories: Cat[];
}) {
  const { count, lastAdded, openCart } = useCart();
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 font-black tracking-tight">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-teal-500 to-indigo-600 text-white">
            3D
          </span>
          <span className="text-lg text-slate-900">{storeName}</span>
        </Link>

        <nav className="ml-auto hidden items-center gap-1 md:flex">
          {categories.map((c) => (
            <Link
              key={c.slug}
              href={`/categoria/${c.slug}`}
              className={`rounded-lg px-3 py-2 text-sm font-medium transition ${
                pathname === `/categoria/${c.slug}`
                  ? "bg-slate-900 text-white"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <span className="mr-1">{c.emoji}</span>
              {c.name}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          <Link
            href="/cotizacion"
            className="hidden rounded-lg px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 sm:block"
          >
            Mis cotizaciones
          </Link>
          <button
            type="button"
            onClick={openCart}
            className="relative rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
          >
            📋 Mi cotización
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-6 min-w-6 place-items-center rounded-full bg-teal-500 px-1 text-xs font-bold text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto px-4 pb-3 md:hidden">
        {categories.map((c) => (
          <Link
            key={c.slug}
            href={`/categoria/${c.slug}`}
            className="whitespace-nowrap rounded-full border border-slate-200 px-3 py-1 text-sm text-slate-600"
          >
            {c.emoji} {c.name}
          </Link>
        ))}
      </div>

      {lastAdded && (
        <div className="pointer-events-none fixed bottom-6 left-1/2 z-50 -translate-x-1/2 rounded-full bg-slate-900 px-5 py-3 text-sm font-medium text-white shadow-lg">
          ✅ {lastAdded} agregado a tu cotización
        </div>
      )}
    </header>
  );
}
