"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * Enlace útil para el administrador: borra su sesión actual y muestra
 * inmediatamente el formulario de acceso. No expone ninguna credencial.
 */
export default function CloseAdminSessionPage() {
  const router = useRouter();

  useEffect(() => {
    void fetch("/api/admin/session", { method: "DELETE" }).finally(() => {
      router.replace("/admin/login");
      router.refresh();
    });
  }, [router]);

  return (
    <div className="mx-auto max-w-md py-20 text-center">
      <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-slate-900 text-2xl text-white">
        🔒
      </div>
      <h1 className="mt-4 text-xl font-black">Cerrando sesión…</h1>
      <p className="mt-2 text-sm text-slate-500">Te llevamos al acceso seguro.</p>
    </div>
  );
}
