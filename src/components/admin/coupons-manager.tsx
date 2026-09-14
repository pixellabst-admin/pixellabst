"use client";

import { useCallback, useEffect, useState } from "react";
import { formatPrice, fromCents, toCents } from "@/lib/format";

type Coupon = {
  id: number;
  code: string;
  kind: string;
  value: number;
  minTotal: number;
  active: boolean;
  usedCount: number;
};

export function CouponsManager() {
  const [list, setList] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);
  const [form, setForm] = useState({ code: "", kind: "percent", value: "10", minTotal: "0" });

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/coupons", { cache: "no-store" });
    setList(res.ok ? ((await res.json()) as Coupon[]) : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function notify(text: string) {
    setMsg(text);
    setTimeout(() => setMsg(null), 2500);
  }

  async function create(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/coupons", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        code: form.code,
        kind: form.kind,
        value: form.kind === "percent" ? Number(form.value) : toCents(form.value),
        minTotal: toCents(form.minTotal),
      }),
    });
    if (!res.ok) {
      const data = (await res.json()) as { error?: string };
      notify(data.error ?? "No se pudo crear");
      return;
    }
    setForm({ code: "", kind: "percent", value: "10", minTotal: "0" });
    await load();
    notify("Cupón creado ✅");
  }

  async function toggle(c: Coupon) {
    await fetch(`/api/coupons/${c.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !c.active }),
    });
    await load();
  }

  async function remove(id: number) {
    if (!confirm("¿Eliminar este cupón?")) return;
    await fetch(`/api/coupons/${id}`, { method: "DELETE" });
    await load();
  }

  const field = "rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500";

  return (
    <div>
      <h1 className="text-3xl font-black">Cupones de descuento</h1>
      <p className="mt-1 text-sm text-slate-500">
        Los clientes los aplican durante el checkout dentro de la página.
      </p>

      {msg && (
        <div className="mt-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">
          {msg}
        </div>
      )}

      <form onSubmit={create} className="mt-6 flex flex-wrap items-end gap-3 rounded-2xl bg-white p-5 shadow-sm">
        <label className="text-sm font-medium">
          Código
          <input
            required
            value={form.code}
            onChange={(e) => setForm({ ...form, code: e.target.value.toUpperCase() })}
            placeholder="VERANO20"
            className={`mt-1 block font-normal ${field}`}
          />
        </label>
        <label className="text-sm font-medium">
          Tipo
          <select
            value={form.kind}
            onChange={(e) => setForm({ ...form, kind: e.target.value })}
            className={`mt-1 block font-normal ${field}`}
          >
            <option value="percent">Porcentaje %</option>
            <option value="fixed">Monto fijo USD</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Valor
          <input
            type="number"
            min="0"
            step={form.kind === "percent" ? "1" : "0.01"}
            value={form.value}
            onChange={(e) => setForm({ ...form, value: e.target.value })}
            className={`mt-1 block w-28 font-normal ${field}`}
          />
        </label>
        <label className="text-sm font-medium">
          Compra mínima
          <input
            type="number"
            min="0"
            step="0.01"
            value={form.minTotal}
            onChange={(e) => setForm({ ...form, minTotal: e.target.value })}
            className={`mt-1 block w-32 font-normal ${field}`}
          />
        </label>
        <button className="rounded-xl bg-teal-600 px-5 py-2.5 font-semibold text-white hover:bg-teal-700">
          Crear cupón
        </button>
      </form>

      <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Código</th>
              <th className="px-4 py-3">Descuento</th>
              <th className="px-4 py-3">Mínimo</th>
              <th className="px-4 py-3">Usos</th>
              <th className="px-4 py-3">Activo</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Cargando…
                </td>
              </tr>
            )}
            {!loading && list.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-center text-slate-400">
                  Sin cupones
                </td>
              </tr>
            )}
            {list.map((c) => (
              <tr key={c.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-mono font-bold">{c.code}</td>
                <td className="px-4 py-3">
                  {c.kind === "percent" ? `${c.value}%` : formatPrice(c.value)}
                </td>
                <td className="px-4 py-3 text-slate-500">
                  {c.minTotal > 0 ? formatPrice(c.minTotal) : "—"}
                </td>
                <td className="px-4 py-3 text-slate-500">{c.usedCount}</td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={c.active}
                    onChange={() => void toggle(c)}
                    className="h-5 w-5 accent-teal-600"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() => void remove(c.id)}
                    className="rounded-lg px-3 py-1 font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <p className="mt-4 text-xs text-slate-400">
        Sugerencia: escribe los montos en dólares (por ejemplo {fromCents(599)} para $5.99 de
        descuento). El sistema los convierte a centavos automáticamente.
      </p>
    </div>
  );
}
