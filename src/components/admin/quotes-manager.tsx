"use client";

import { useCallback, useEffect, useState } from "react";
import { formatPrice } from "@/lib/format";
import { waLink } from "@/lib/whatsapp";

type QuoteItem = { id: number; name: string; unitPrice: number; quantity: number };
type Quote = {
  id: number;
  code: string;
  customerName: string;
  email: string;
  phone: string;
  city: string;
  notes: string;
  estimatedTotal: number;
  couponCode: string;
  status: string;
  createdAt: string;
  items: QuoteItem[];
};

const STATUSES = ["nueva", "contactado", "cotizado", "aceptada", "cerrada", "cancelada"];

const STATUS_STYLE: Record<string, string> = {
  nueva: "bg-amber-100 text-amber-800",
  contactado: "bg-blue-100 text-blue-800",
  cotizado: "bg-indigo-100 text-indigo-800",
  aceptada: "bg-emerald-100 text-emerald-800",
  cerrada: "bg-slate-200 text-slate-700",
  cancelada: "bg-rose-100 text-rose-800",
};

export function QuotesManager({ storeName }: { storeName: string }) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState<number | null>(null);
  const [filter, setFilter] = useState("todas");

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/quotes", { cache: "no-store" });
    setQuotes(res.ok ? ((await res.json()) as Quote[]) : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  async function changeStatus(id: number, status: string) {
    await fetch(`/api/quotes/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    await load();
  }

  async function remove(id: number) {
    if (!confirm("¿Eliminar esta cotización?")) return;
    await fetch(`/api/quotes/${id}`, { method: "DELETE" });
    await load();
  }

  const visible = quotes.filter((q) => filter === "todas" || q.status === filter);
  const pipeline = quotes
    .filter((q) => !["cancelada", "cerrada"].includes(q.status))
    .reduce((sum, q) => sum + q.estimatedTotal, 0);

  function replyLink(q: Quote) {
    const msg = [
      `¡Hola ${q.customerName}! 👋`,
      "",
      `Gracias por tu solicitud de cotización *#${q.code}* en ${storeName}.`,
      "",
      "Estos son los precios finales para tu pedido:",
      ...q.items.map((i) => `• ${i.quantity} × ${i.name}`),
      "",
      "Quedo al pendiente de cualquier duda 🙌",
    ].join("\n");
    return waLink(q.phone, msg);
  }

  return (
    <div>
      <h1 className="text-3xl font-black">Cotizaciones</h1>
      <p className="mt-1 text-sm text-slate-500">
        Solicitudes que llegan desde la tienda y por WhatsApp.
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Solicitudes</p>
          <p className="text-3xl font-black">{quotes.length}</p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Nuevas por atender</p>
          <p className="text-3xl font-black text-amber-600">
            {quotes.filter((q) => q.status === "nueva").length}
          </p>
        </div>
        <div className="rounded-2xl bg-white p-5 shadow-sm">
          <p className="text-sm text-slate-500">Valor en proceso</p>
          <p className="text-3xl font-black">{formatPrice(pipeline)}</p>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        <button
          onClick={() => setFilter("todas")}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            filter === "todas" ? "bg-slate-900 text-white" : "bg-white text-slate-600"
          }`}
        >
          Todas
        </button>
        {STATUSES.map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-lg px-3 py-2 text-sm font-medium capitalize ${
              filter === s ? "bg-slate-900 text-white" : "bg-white text-slate-600"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-3">
        {loading && <p className="text-slate-400">Cargando…</p>}
        {!loading && visible.length === 0 && (
          <p className="rounded-2xl bg-white p-10 text-center text-slate-400 shadow-sm">
            No hay cotizaciones en esta vista.
          </p>
        )}
        {visible.map((q) => (
          <div key={q.id} className="rounded-2xl bg-white p-5 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <div>
                <p className="font-bold">
                  #{q.code} · {q.customerName}
                </p>
                <p className="text-sm text-slate-500">
                  {q.email}
                  {q.phone ? ` · ${q.phone}` : ""} ·{" "}
                  {new Date(q.createdAt).toLocaleString("es-US")}
                </p>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase ${
                  STATUS_STYLE[q.status] ?? "bg-slate-100 text-slate-700"
                }`}
              >
                {q.status}
              </span>
              <div className="ml-auto flex flex-wrap items-center gap-2">
                <span className="text-lg font-black">{formatPrice(q.estimatedTotal)}</span>
                {q.phone && (
                  <a
                    href={replyLink(q)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white hover:bg-[#20BD5A]"
                  >
                    💬 Responder
                  </a>
                )}
                <select
                  value={q.status}
                  onChange={(e) => void changeStatus(q.id, e.target.value)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm capitalize"
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>
                      {s}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => setOpen(open === q.id ? null : q.id)}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium"
                >
                  {open === q.id ? "Ocultar" : "Detalle"}
                </button>
              </div>
            </div>

            {open === q.id && (
              <div className="mt-4 grid gap-4 border-t border-slate-100 pt-4 sm:grid-cols-2">
                <div>
                  <h3 className="text-sm font-bold uppercase text-slate-500">
                    Productos solicitados
                  </h3>
                  <ul className="mt-2 space-y-1 text-sm">
                    {q.items.map((i) => (
                      <li key={i.id} className="flex justify-between">
                        <span>
                          {i.quantity} × {i.name}
                        </span>
                        <span className="font-semibold">
                          {formatPrice(i.unitPrice * i.quantity)}
                        </span>
                      </li>
                    ))}
                  </ul>
                  {q.couponCode && (
                    <p className="mt-2 text-sm text-emerald-600">
                      Código promocional: <strong>{q.couponCode}</strong>
                    </p>
                  )}
                </div>
                <div className="text-sm">
                  <h3 className="text-sm font-bold uppercase text-slate-500">Datos del cliente</h3>
                  <p className="mt-2 text-slate-600">📍 {q.city || "Sin ciudad"}</p>
                  <p className="mt-1 text-slate-600">✉️ {q.email}</p>
                  <p className="mt-1 text-slate-600">📱 {q.phone || "Sin teléfono"}</p>
                  {q.notes && (
                    <div className="mt-3 rounded-lg bg-slate-50 p-3">
                      <p className="font-semibold text-slate-700">Detalles</p>
                      <p className="mt-1 whitespace-pre-line text-slate-600">{q.notes}</p>
                    </div>
                  )}
                  <button
                    onClick={() => void remove(q.id)}
                    className="mt-3 text-sm font-medium text-rose-600 hover:underline"
                  >
                    Eliminar cotización
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
