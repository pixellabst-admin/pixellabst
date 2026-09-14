"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function LoginForm({ usingDefault = false }: { usingDefault?: boolean }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch("/api/admin/session", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    setLoading(false);
    if (!res.ok) {
      setError("Contraseña incorrecta");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-md py-16">
      <form onSubmit={submit} className="rounded-3xl bg-white p-8 shadow-lg">
        <div className="mb-6 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-gradient-to-br from-teal-500 to-indigo-600 text-xl font-black text-white">
            3D
          </div>
          <h1 className="mt-4 text-2xl font-black">Panel de administración</h1>
          <p className="mt-1 text-sm text-slate-500">Ingresa tu contraseña para administrar la tienda.</p>
        </div>
        <input
          type="password"
          autoFocus
          required
          placeholder="Contraseña"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none focus:border-teal-500"
        />
        {error && <p className="mt-3 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:bg-slate-400"
        >
          {loading ? "Entrando…" : "Entrar"}
        </button>
        {usingDefault && (
          <div className="mt-4 rounded-lg bg-amber-50 p-3 text-center text-xs text-amber-800">
            <p>
              Aún no configuras una contraseña propia. La actual es{" "}
              <code className="rounded bg-amber-100 px-1 font-mono font-bold">admin123</code>
            </p>
            <p className="mt-1">
              Cámbiala con la variable <code className="font-mono">ADMIN_PASSWORD</code> antes de
              publicar tu tienda.
            </p>
          </div>
        )}
      </form>
    </div>
  );
}
