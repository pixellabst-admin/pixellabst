"use client";

import { useState } from "react";
import { waLink } from "@/lib/whatsapp";

const TOPICS = [
  { id: "info", icon: "💬", label: "Información general" },
  { id: "custom", icon: "🎨", label: "Pieza personalizada" },
  { id: "bulk", icon: "🏢", label: "Pedido por mayoreo" },
  { id: "status", icon: "📦", label: "Estado de mi pedido" },
];

export function WhatsappSection({
  phone,
  storeName,
  email,
  hours,
  social,
}: {
  phone: string;
  storeName: string;
  email: string;
  hours: string;
  social?: { facebook: string; instagram: string; tiktok: string };
}) {
  const [topic, setTopic] = useState("info");
  const [name, setName] = useState("");
  const [detail, setDetail] = useState("");

  const topicLabel = TOPICS.find((t) => t.id === topic)?.label ?? "Información general";

  const message = [
    `¡Hola ${storeName}! 👋`,
    "",
    `Motivo: ${topicLabel}`,
    name ? `Mi nombre: ${name}` : "",
    detail ? `\n${detail}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  return (
    <section id="contacto" className="bg-gradient-to-br from-[#075E54] to-[#128C7E] py-16 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 lg:grid-cols-2 lg:items-center">
        <div>
          <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1 text-sm font-semibold">
            <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-300" />
            Atención por WhatsApp
          </span>
          <h2 className="mt-4 text-4xl font-black leading-tight">
            ¿Tienes dudas? Escríbenos por WhatsApp
          </h2>
          <p className="mt-4 text-lg text-emerald-50">
            Te ayudamos a elegir color, tamaño y material. También cotizamos piezas totalmente
            personalizadas a partir de tu idea, una foto o un archivo 3D.
          </p>

          <ul className="mt-6 space-y-3 text-emerald-50">
            <li className="flex items-center gap-3">
              <span className="text-xl">⚡</span> Respuesta rápida en horario de atención
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">🎨</span> Cotizaciones personalizadas sin costo
            </li>
            <li className="flex items-center gap-3">
              <span className="text-xl">🏢</span> Precios especiales para empresas y eventos
            </li>
          </ul>

          <div className="mt-8 space-y-1 text-sm text-emerald-100">
            <p>
              📱 <strong className="text-white">{phone}</strong>
            </p>
            <p>✉️ {email}</p>
            {hours && <p>🕐 {hours}</p>}
          </div>

          {social && (social.facebook || social.instagram || social.tiktok) && (
            <div className="mt-6">
              <p className="text-sm font-semibold text-emerald-100">Síguenos</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {social.facebook && (
                  <a
                    href={social.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
                  >
                    Facebook
                  </a>
                )}
                {social.instagram && (
                  <a
                    href={social.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
                  >
                    Instagram
                  </a>
                )}
                {social.tiktok && (
                  <a
                    href={social.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/25"
                  >
                    TikTok
                  </a>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="rounded-3xl bg-white p-6 text-slate-900 shadow-2xl">
          <h3 className="text-lg font-black">Inicia la conversación</h3>
          <p className="mt-1 text-sm text-slate-500">
            Arma tu mensaje y se abrirá WhatsApp con todo listo para enviar.
          </p>

          <p className="mt-5 text-sm font-semibold">¿Sobre qué nos escribes?</p>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {TOPICS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTopic(t.id)}
                className={`rounded-xl border px-3 py-3 text-left text-sm font-medium transition ${
                  topic === t.id
                    ? "border-[#25D366] bg-emerald-50 text-slate-900"
                    : "border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                <span className="mr-1">{t.icon}</span>
                {t.label}
              </button>
            ))}
          </div>

          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Tu nombre (opcional)"
            className="mt-4 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#25D366]"
          />
          <textarea
            rows={3}
            value={detail}
            onChange={(e) => setDetail(e.target.value)}
            placeholder="Cuéntanos qué necesitas (opcional)"
            className="mt-3 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#25D366]"
          />

          <div className="mt-4 rounded-xl bg-[#ECE5DD] p-3">
            <p className="text-xs font-semibold text-slate-500">Vista previa del mensaje</p>
            <div className="mt-2 whitespace-pre-line rounded-xl rounded-tr-none bg-[#DCF8C6] px-3 py-2 text-sm text-slate-800 shadow-sm">
              {message}
            </div>
          </div>

          <a
            href={waLink(phone, message)}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] px-6 py-4 font-bold text-white transition hover:bg-[#20BD5A]"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884a9.82 9.82 0 0 1 6.988 2.896 9.82 9.82 0 0 1 2.893 6.994c-.003 5.45-4.437 9.886-9.885 9.886m8.413-18.297A11.82 11.82 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.88 11.88 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.82 11.82 0 0 0 20.464 3.488" />
            </svg>
            Abrir WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
