"use client";

import { useState } from "react";
import type { SiteSettings } from "@/lib/settings";
import { fromCents, toCents } from "@/lib/format";
import { isValidWhatsapp, normalizePhone, waLink } from "@/lib/whatsapp";

export function SettingsForm({ initial }: { initial: SiteSettings }) {
  const [form, setForm] = useState({
    ...initial,
    shippingCents: fromCents(Number(initial.shippingCents) || 0),
  });
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const digits = normalizePhone(form.whatsapp);
  const phoneOk = isValidWhatsapp(form.whatsapp);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    await fetch("/api/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        shippingCents: String(toCents(form.shippingCents)),
      }),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  }

  const field = "mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-500";

  return (
    <form onSubmit={submit} className="max-w-2xl">
      <h1 className="text-3xl font-black">Ajustes de la tienda</h1>
      <p className="mt-1 text-sm text-slate-500">
        Personaliza el nombre, los textos de portada y el costo de envío.
      </p>

      <div className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <label className="block text-sm font-medium">
          Nombre de la tienda
          <input
            value={form.storeName}
            onChange={(e) => setForm({ ...form, storeName: e.target.value })}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Eslogan
          <input
            value={form.tagline}
            onChange={(e) => setForm({ ...form, tagline: e.target.value })}
            className={field}
          />
        </label>
        <label className="block text-sm font-medium">
          Texto de portada
          <textarea
            rows={3}
            value={form.heroText}
            onChange={(e) => setForm({ ...form, heroText: e.target.value })}
            className={field}
          />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="block text-sm font-medium">
            Correo de contacto
            <input
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className={field}
            />
          </label>
          <label className="block text-sm font-medium">
            WhatsApp
            <input
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              className={field}
            />
          </label>
        </div>
        <label className="block text-sm font-medium sm:w-1/2">
          Costo de envío (USD)
          <input
            type="number"
            step="0.01"
            min="0"
            value={form.shippingCents}
            onChange={(e) => setForm({ ...form, shippingCents: e.target.value })}
            className={field}
          />
        </label>
      </div>

      <div className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-[#25D366] text-xl text-white">
            💬
          </span>
          <div>
            <h2 className="text-lg font-black">Contacto por WhatsApp</h2>
            <p className="text-sm text-slate-500">
              Controla el botón flotante y la sección de contacto de la tienda.
            </p>
          </div>
        </div>

        <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm font-medium">
          <input
            type="checkbox"
            checked={form.whatsappEnabled !== "0"}
            onChange={(e) => setForm({ ...form, whatsappEnabled: e.target.checked ? "1" : "0" })}
            className="h-5 w-5 accent-[#25D366]"
          />
          Mostrar WhatsApp en la tienda
        </label>

        <label className="block text-sm font-medium">
          Número de WhatsApp (con código de país)
          <input
            value={form.whatsapp}
            onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
            placeholder="+52 55 1234 5678"
            className={field}
          />
          <span
            className={`mt-1 block text-xs ${
              phoneOk ? "text-emerald-600" : "text-amber-600"
            }`}
          >
            {phoneOk
              ? `✅ Se abrirá como wa.me/${digits}`
              : "⚠️ Escribe el número completo con código de país (ej. +52 55 1234 5678)"}
          </span>
        </label>

        <label className="block text-sm font-medium">
          Mensaje inicial que verá el cliente
          <textarea
            rows={2}
            value={form.whatsappGreeting}
            onChange={(e) => setForm({ ...form, whatsappGreeting: e.target.value })}
            className={field}
          />
        </label>

        <label className="block text-sm font-medium">
          Horario de atención
          <input
            value={form.whatsappHours}
            onChange={(e) => setForm({ ...form, whatsappHours: e.target.value })}
            placeholder="Lunes a viernes de 9:00 a 19:00"
            className={field}
          />
        </label>

        {phoneOk && (
          <a
            href={waLink(form.whatsapp, form.whatsappGreeting)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-xl border-2 border-[#25D366] px-4 py-2 text-sm font-semibold text-[#128C7E] hover:bg-emerald-50"
          >
            🔎 Probar el enlace
          </a>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 disabled:bg-slate-300"
          >
            {saving ? "Guardando…" : "Guardar ajustes"}
          </button>
          {saved && <span className="text-sm font-medium text-emerald-600">Guardado ✅</span>}
        </div>
      </div>

      <div className="mt-6 space-y-4 rounded-2xl bg-white p-6 shadow-sm">
        <div className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-pink-500 to-purple-600 text-xl text-white">
            📣
          </span>
          <div>
            <h2 className="text-lg font-black">Redes sociales</h2>
            <p className="text-sm text-slate-500">
              Aparecen como botones en el pie de página y en la sección de contacto. Deja vacío
              lo que no uses y no se mostrará.
            </p>
          </div>
        </div>

        <label className="block text-sm font-medium">
          Facebook
          <input
            value={form.facebook}
            onChange={(e) => setForm({ ...form, facebook: e.target.value })}
            placeholder="Facebook: pagina o enlace completo"
            className={field}
          />
        </label>

        <label className="block text-sm font-medium">
          Instagram
          <input
            value={form.instagram}
            onChange={(e) => setForm({ ...form, instagram: e.target.value })}
            placeholder="Instagram: @tu-cuenta o enlace completo"
            className={field}
          />
        </label>

        <label className="block text-sm font-medium">
          TikTok
          <input
            value={form.tiktok}
            onChange={(e) => setForm({ ...form, tiktok: e.target.value })}
            placeholder="TikTok: @tu-cuenta o enlace completo"
            className={field}
          />
        </label>

        {(form.facebook || form.instagram || form.tiktok) && (
          <div className="rounded-xl bg-slate-50 p-4 text-sm">
            <p className="font-semibold text-slate-700">Vista previa</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {form.facebook && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                  Facebook ✓
                </span>
              )}
              {form.instagram && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                  Instagram ✓
                </span>
              )}
              {form.tiktok && (
                <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-slate-600 shadow-sm">
                  TikTok ✓
                </span>
              )}
            </div>
          </div>
        )}

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 disabled:bg-slate-300"
          >
            {saving ? "Guardando…" : "Guardar ajustes"}
          </button>
          {saved && <span className="text-sm font-medium text-emerald-600">Guardado ✅</span>}
        </div>
      </div>
    </form>
  );
}
