"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { formatPrice } from "@/lib/format";
import { quoteMessage, waLink } from "@/lib/whatsapp";
import { useCart } from "./cart-provider";
import { SafeProductImage } from "./safe-product-image";

type Step = 1 | 2 | 3;

const STEP_LABELS: Record<number, string> = {
  1: "Mi lista",
  2: "Mis datos",
  3: "Enviar",
};

const input =
  "w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none transition focus:border-[#25D366] focus:ring-2 focus:ring-emerald-100";

export function QuotePanel({
  whatsapp,
  storeName,
  onClose,
}: {
  whatsapp?: string;
  storeName: string;
  onClose?: () => void;
}) {
  const { items, subtotal, setQuantity, remove, clear } = useCart();
  const [step, setStep] = useState<Step>(1);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [couponInput, setCouponInput] = useState("");
  const [coupon, setCoupon] = useState<{ code: string; label: string } | null>(null);
  const [couponMsg, setCouponMsg] = useState<string | null>(null);

  const [form, setForm] = useState({
    customerName: "",
    email: "",
    phone: "",
    city: "",
    notes: "",
  });

  const [sent, setSent] = useState<{ code: string; link: string } | null>(null);

  const formValid = useMemo(
    () => form.customerName.trim().length > 2 && /\S+@\S+\.\S+/.test(form.email),
    [form],
  );

  async function checkCoupon() {
    setCouponMsg(null);
    const res = await fetch("/api/coupons", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: couponInput, subtotal }),
    });
    const data = (await res.json()) as { code?: string; label?: string; error?: string };
    if (!res.ok) {
      setCoupon(null);
      setCouponMsg(data.error ?? "Código no válido");
      return;
    }
    setCoupon({ code: data.code!, label: data.label! });
    setCouponMsg(`✅ ${data.label} — lo aplicaremos en tu cotización`);
  }

  async function sendQuote() {
    setError(null);
    setSending(true);
    try {
      const res = await fetch("/api/quotes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          couponCode: coupon?.code ?? "",
          items: items.map((i) => ({ productId: i.id, quantity: i.quantity })),
        }),
      });
      const data = (await res.json()) as { code?: string; error?: string };
      if (!res.ok) throw new Error(data.error ?? "No se pudo enviar la solicitud");

      const message = quoteMessage({
        storeName,
        code: data.code!,
        customerName: form.customerName,
        phone: form.phone,
        city: form.city,
        notes: form.notes,
        couponCode: coupon?.code,
        items: items.map((i) => ({
          name: i.name,
          quantity: i.quantity,
          unitPrice: formatPrice(i.price),
          lineTotal: formatPrice(i.price * i.quantity),
        })),
        estimatedTotal: formatPrice(subtotal),
      });

      const link = whatsapp ? waLink(whatsapp, message) : "";
      if (link) window.open(link, "_blank", "noopener,noreferrer");

      setSent({ code: data.code!, link });
      clear();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error inesperado");
    } finally {
      setSending(false);
    }
  }

  /* --------------------------- Confirmación --------------------------- */
  if (sent) {
    return (
      <div className="px-6 py-12 text-center">
        <div className="text-6xl">💬</div>
        <h2 className="mt-4 text-2xl font-black">¡Solicitud enviada!</h2>
        <p className="mt-2 text-sm text-slate-600">
          Tu cotización <strong className="text-slate-900">#{sent.code}</strong> quedó registrada.
          {sent.link
            ? " Abrimos WhatsApp para que envíes el mensaje y te respondamos con los precios finales."
            : " Te contactaremos muy pronto con los precios finales."}
        </p>

        {sent.link && (
          <>
            <a
              href={sent.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 font-bold text-white hover:bg-[#20BD5A]"
            >
              💬 Abrir WhatsApp de nuevo
            </a>
            <p className="mt-2 text-xs text-slate-400">
              ¿No se abrió? Toca el botón de arriba. Asegúrate de permitir ventanas emergentes.
            </p>
          </>
        )}

        <div className="mt-4 flex flex-col gap-2">
          <Link
            href={`/cotizacion?code=${sent.code}`}
            className="rounded-xl bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800"
          >
            Ver mi cotización
          </Link>
          <button
            onClick={() => {
              setSent(null);
              setStep(1);
              onClose?.();
            }}
            className="rounded-xl border border-slate-300 px-6 py-3 font-semibold text-slate-600"
          >
            Seguir explorando
          </button>
        </div>
      </div>
    );
  }

  /* ------------------------------ Vacío ------------------------------ */
  if (items.length === 0) {
    return (
      <div className="px-6 py-20 text-center">
        <div className="text-6xl">📋</div>
        <h2 className="mt-4 text-xl font-bold">Tu lista está vacía</h2>
        <p className="mt-2 text-sm text-slate-500">
          Agrega las piezas que te interesan y te enviamos una cotización personalizada por
          WhatsApp.
        </p>
        {onClose ? (
          <button
            onClick={onClose}
            className="mt-6 rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700"
          >
            Ver productos
          </button>
        ) : (
          <Link
            href="/"
            className="mt-6 inline-block rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700"
          >
            Ver productos
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-2 border-b border-slate-200 px-5 py-4">
        {[1, 2, 3].map((n) => (
          <div key={n} className="flex flex-1 items-center gap-2">
            <span
              className={`grid h-7 w-7 shrink-0 place-items-center rounded-full text-xs font-bold ${
                step >= n ? "bg-[#25D366] text-white" : "bg-slate-200 text-slate-500"
              }`}
            >
              {step > n ? "✓" : n}
            </span>
            <span
              className={`hidden text-xs font-semibold sm:block ${
                step >= n ? "text-slate-900" : "text-slate-400"
              }`}
            >
              {STEP_LABELS[n]}
            </span>
            {n < 3 && <span className="h-px flex-1 bg-slate-200" />}
          </div>
        ))}
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-5">
        {/* PASO 1 — LISTA */}
        {step === 1 && (
          <div className="space-y-4">
            <div className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-900">
              💡 Los precios que ves son de <strong>referencia</strong>. Te confirmamos el precio
              final por WhatsApp según cantidad, color y personalización.
            </div>

            {items.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-xl border border-slate-200 p-3">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-slate-100">
                  <SafeProductImage
                    src={item.imageUrl}
                    alt={item.name}
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col">
                  <p className="text-sm font-semibold leading-tight">{item.name}</p>
                  <p className="text-xs text-slate-500">{formatPrice(item.price)} c/u aprox.</p>
                  <div className="mt-auto flex items-center gap-2">
                    <div className="flex items-center rounded-lg border border-slate-300">
                      <button
                        className="px-2 py-0.5"
                        onClick={() => setQuantity(item.id, item.quantity - 1)}
                      >
                        −
                      </button>
                      <span className="w-7 text-center text-sm font-semibold">{item.quantity}</span>
                      <button
                        className="px-2 py-0.5"
                        onClick={() => setQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-xs text-rose-600 hover:underline"
                    >
                      Quitar
                    </button>
                  </div>
                </div>
                <span className="text-sm font-bold">{formatPrice(item.price * item.quantity)}</span>
              </div>
            ))}

            <div className="rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-semibold">¿Tienes un código promocional?</p>
              <div className="mt-2 flex gap-2">
                <input
                  value={couponInput}
                  onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                  placeholder="BIENVENIDO10"
                  className={input}
                />
                <button
                  type="button"
                  onClick={() => void checkCoupon()}
                  className="shrink-0 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white"
                >
                  Validar
                </button>
              </div>
              {couponMsg && (
                <p
                  className={`mt-2 text-xs font-medium ${
                    coupon ? "text-emerald-600" : "text-rose-600"
                  }`}
                >
                  {couponMsg}
                </p>
              )}
            </div>
          </div>
        )}

        {/* PASO 2 — DATOS */}
        {step === 2 && (
          <div className="space-y-3">
            <h3 className="font-bold">¿A quién le cotizamos?</h3>
            <p className="text-sm text-slate-500">
              Con estos datos te damos seguimiento y te enviamos el precio final.
            </p>
            <input
              placeholder="Nombre completo *"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
              className={input}
            />
            <input
              type="email"
              placeholder="Correo electrónico *"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={input}
            />
            <input
              placeholder="Teléfono / WhatsApp"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className={input}
            />
            <input
              placeholder="Ciudad o ZIP (para calcular el envío)"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className={input}
            />
            <textarea
              rows={4}
              placeholder="Detalles: colores, tamaños, logotipo, fecha en que lo necesitas…"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
              className={input}
            />
            {!formValid && (
              <p className="text-xs text-slate-400">* Nombre y correo son obligatorios.</p>
            )}
          </div>
        )}

        {/* PASO 3 — REVISAR Y ENVIAR */}
        {step === 3 && (
          <div className="space-y-4">
            <h3 className="font-bold">Revisa tu solicitud</h3>

            <div className="rounded-xl bg-[#ECE5DD] p-3">
              <p className="text-xs font-semibold text-slate-500">
                Así llegará tu mensaje a WhatsApp
              </p>
              <div className="mt-2 max-h-64 overflow-y-auto whitespace-pre-line rounded-xl rounded-tr-none bg-[#DCF8C6] px-3 py-2 text-xs leading-relaxed text-slate-800 shadow-sm">
                {quoteMessage({
                  storeName,
                  code: "———",
                  customerName: form.customerName || "—",
                  phone: form.phone,
                  city: form.city,
                  notes: form.notes,
                  couponCode: coupon?.code,
                  items: items.map((i) => ({
                    name: i.name,
                    quantity: i.quantity,
                    unitPrice: formatPrice(i.price),
                    lineTotal: formatPrice(i.price * i.quantity),
                  })),
                  estimatedTotal: formatPrice(subtotal),
                })}
              </div>
            </div>

            {!whatsapp && (
              <p className="rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
                ⚠️ La tienda aún no tiene WhatsApp configurado. Guardaremos tu solicitud y te
                contactaremos por correo.
              </p>
            )}
            {error && <p className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{error}</p>}
          </div>
        )}
      </div>

      {/* Pie con total y acciones */}
      <div className="border-t border-slate-200 bg-white px-5 py-4">
        <div className="flex items-baseline justify-between">
          <span className="text-sm text-slate-500">Total de referencia</span>
          <span className="text-xl font-black">{formatPrice(subtotal)}</span>
        </div>
        <p className="mt-0.5 text-xs text-slate-400">
          No es un cobro. El precio final te lo confirmamos por WhatsApp.
        </p>

        <div className="mt-3 flex gap-2">
          {step > 1 && (
            <button
              onClick={() => setStep((s) => (s - 1) as Step)}
              className="rounded-xl border border-slate-300 px-4 py-3 text-sm font-semibold text-slate-600"
            >
              Atrás
            </button>
          )}
          {step < 3 && (
            <button
              onClick={() => setStep((s) => (s + 1) as Step)}
              disabled={step === 2 && !formValid}
              className="flex-1 rounded-xl bg-slate-900 px-4 py-3 font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
            >
              Continuar
            </button>
          )}
          {step === 3 && (
            <button
              onClick={() => void sendQuote()}
              disabled={sending}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#25D366] px-4 py-3 font-bold text-white hover:bg-[#20BD5A] disabled:bg-slate-300"
            >
              {sending ? "Enviando…" : "💬 Enviar cotización por WhatsApp"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
