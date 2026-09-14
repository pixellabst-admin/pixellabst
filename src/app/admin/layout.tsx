import type { Metadata } from "next";
import type { ReactNode } from "react";
import { AdminNav } from "@/components/admin/admin-nav";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

// El panel es privado: no debe aparecer en Google ni en ningún buscador.
export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function AdminLayout({ children }: { children: ReactNode }) {
  const authed = await isAdmin();
  return (
    <div className="min-h-screen bg-slate-100">
      {authed && <AdminNav />}
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
