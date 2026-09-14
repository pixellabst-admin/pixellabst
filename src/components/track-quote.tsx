"use client";

import { useState } from "react";
import { formatPrice } from "@/lib/format";
import { quoteFollowUpMessage, waLink } from "@/lib/whatsapp";

type Quote = {
  code: string;
  customerName: string;
  city: string;
  notes: string;
  status: string;
  couponCode: string;
  estimatedTotal: number;
  createdAt: string;
  items: { id: number; name: string; unitPrice: number; quantity: number }[];
};

const FLOW = ["nueva", "contactado", "cotizado", "aceptada", "cerrada"];

const FLOW_LABEL: Record<string, string> = {
  nueva: "Recibida",
  contactado: "Te contactamos",
  cotizado: "Cotizada",
  aceptada: "Aceptada",
  cerrada: "Completada",
};

export function TrackQuote({
  initialCode,
  whatsapp,
  storeName,
}: {
  initialCode: string;
  whatsapp?: string;
  storeName?: string;
}) {
  const [code, setCode] = useState(initialCode);
  const [email, setEmail] = useState("");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function search(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await fetch(
      `/api/quotes/track?code=${encodeURIComponent(code)}&email=${encodeURIComponent(email)}`,
    );
    const data = (await res.json()) as Quote & { error?: string };
    setLoading(false);
    if (!res.ok) {
      setQuote(null);
      setError(data.error ?? "No encontramos esa cotización");
      return;
    }
    setQuote(data);
  }

  const stage = quote ? FLOW.indexOf(quote.status) : -1;

  return (
    <div className="mx-auto max-w-2xl px-4 py-12">
      <h1 className="text-3xl font-black">Mis cotizaciones</h1>
      <p className="mt-1 text-slate-500">
        Consulta el estado de tu solicitud con el código y el correo que registraste.
      </p>

      <form
        onSubmit={search}
        className="mt-6 flex flex-col gap-3 rounded-2xl bg-white p-5 shadow-sm sm:flex-row"
      >
        <input
          required
          placeholder="Código (ej. C12345678)"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#25D366]"
        />
        <input
          required
          type="email"
          placeholder="Tu correo"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#25D366]"
        />
        <button
          disabled={loading}
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white disabled:bg-slate-400"
        >
          {loading ? "Buscando…" : "Buscar"}
        </button>
      </form>

      {error && <p className="mt-4 rounded-xl bg-rose-50 p-4 text-sm text-rose-700">{error}</p>}

      {quote && (
        <div className="mt-6 space-y-5 rounded-2xl bg-white p-6 shadow-sm">
          <div>
            <p className="text-sm text-slate-500">Cotización</p>
            <p className="text-2xl font-black">#{quote.code}</p>
            <p className="text-sm text-slate-500">
              {new Date(quote.createdAt).toLocaleString("es-US")} · {quote.customerName}
            </p>
          </div>

          {quote.status === "cancelada" ? (
            <p className="rounded-xl bg-rose-50 p-4 text-sm font-semibold text-rose-700">
              Esta cotización fue cancelada.
            </p>
          ) : (
            <ol className="flex items-center gap-1">
              {FLOW.map((s, i) => (
                <li key={s} className="flex flex-1 flex-col items-center gap-1">
                  <span
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                      i <= stage ? "bg-[#25D366] text-white" : "bg-slate-200 text-slate-500"
                    }`}
                  >
                    {i <= stage ? "✓" : i + 1}
                  </span>
                  <span className="text-center text-[10px] font-semibold text-slate-500">
                    {FLOW_LABEL[s]}
                  </span>
                </li>
              ))}
            </ol>
          )}

          <ul className="space-y-1 text-sm">
            {quote.items.map((i) => (
              <li key={i.id} className="flex justify-between">
                <span>
                  {i.quantity} × {i.name}
                </span>
                <span className="font-semibold">{formatPrice(i.unitPrice * i.quantity)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-slate-200 pt-3">
            <div className="flex justify-between text-lg font-black">
              <span>Total de referencia</span>
              <span>{formatPrice(quote.estimatedTotal)}</span>
            </div>
            <p className="mt-1 text-xs text-slate-400">
              El precio final se confirma por WhatsApp según cantidad y personalización.
            </p>
            {quote.couponCode && (
              <p className="mt-2 text-sm text-emerald-600">
                Código aplicado: <strong>{quote.couponCode}</strong>
              </p>
            )}
          </div>

          {quote.notes && (
            <div className="rounded-xl bg-slate-50 p-4 text-sm">
              <p className="font-semibold">Tus notas</p>
              <p className="mt-1 whitespace-pre-line text-slate-600">{quote.notes}</p>
            </div>
          )}

          {whatsapp && (
            <a
              href={waLink(
                whatsapp,
                quoteFollowUpMessage({
                  storeName: storeName ?? "la tienda",
                  code: quote.code,
                  customerName: quote.customerName,
                }),
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#20BD5A]"
            >
              💬 Dar seguimiento por WhatsApp
            </a>
          )}
        </div>
      )}
    </div>
  );
}
