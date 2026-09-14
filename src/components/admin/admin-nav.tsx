"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const LINKS = [
  { href: "/admin", label: "Productos" },
  { href: "/admin/categorias", label: "Categorías" },
  { href: "/admin/cotizaciones", label: "Cotizaciones" },
  { href: "/admin/cupones", label: "Cupones" },
  { href: "/admin/ajustes", label: "Ajustes" },
];

export function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/admin/session", { method: "DELETE" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <div className="border-b border-slate-800 bg-slate-900 text-white">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center gap-2 px-4 py-3">
        <span className="mr-4 font-black">🛠️ Panel de administración</span>
        {LINKS.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            aria-current={pathname === l.href ? "page" : undefined}
            style={
              pathname === l.href
                ? { backgroundColor: "#ffffff", color: "#0f172a", fontWeight: 700 }
                : undefined
            }
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              pathname === l.href ? "shadow-sm" : "text-slate-300 hover:bg-slate-800"
            }`}
          >
            {l.label}
          </Link>
        ))}
        <div className="ml-auto flex items-center gap-2">
          <Link
            href="/"
            className="rounded-lg border border-slate-700 px-3 py-2 text-sm text-slate-300 hover:bg-slate-800"
          >
            Ver tienda
          </Link>
          <button
            onClick={logout}
            title="Cierra esta sesión; la próxima visita pedirá contraseña"
            className="rounded-lg bg-rose-600 px-3 py-2 text-sm font-semibold hover:bg-rose-500"
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    </div>
  );
}
