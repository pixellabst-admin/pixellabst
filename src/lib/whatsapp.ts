/**
 * Utilidades para armar enlaces de WhatsApp (wa.me).
 * El número se normaliza quitando espacios, guiones, paréntesis y el "+".
 */

export function normalizePhone(raw: string): string {
  return (raw ?? "").replace(/[^\d]/g, "");
}

export function isValidWhatsapp(raw: string): boolean {
  const n = normalizePhone(raw);
  return n.length >= 8 && n.length <= 15;
}

export function waLink(phone: string, message: string): string {
  const n = normalizePhone(phone);
  const text = encodeURIComponent(message ?? "");
  return `https://wa.me/${n}${text ? `?text=${text}` : ""}`;
}

/** Mensaje prellenado para consultar por un producto */
export function productMessage(opts: {
  storeName: string;
  productName: string;
  price: string;
  url?: string;
}): string {
  const lines = [
    `¡Hola ${opts.storeName}! 👋`,
    "",
    `Me interesa este producto:`,
    `• ${opts.productName} — ${opts.price}`,
  ];
  if (opts.url) lines.push(`• ${opts.url}`);
  lines.push("", "¿Me pueden dar más información?");
  return lines.join("\n");
}

/** Mensaje completo de solicitud de cotización */
export function quoteMessage(opts: {
  storeName: string;
  code: string;
  customerName: string;
  phone?: string;
  city?: string;
  notes?: string;
  couponCode?: string;
  items: { name: string; quantity: number; unitPrice: string; lineTotal: string }[];
  estimatedTotal: string;
}): string {
  const lines: string[] = [
    `¡Hola ${opts.storeName}! 👋`,
    "",
    `*SOLICITUD DE COTIZACIÓN #${opts.code}*`,
    "",
    "*Productos que me interesan:*",
  ];

  opts.items.forEach((i, idx) => {
    lines.push(`${idx + 1}. ${i.name}`);
    lines.push(`   Cantidad: ${i.quantity}  ·  Ref: ${i.unitPrice} c/u = ${i.lineTotal}`);
  });

  lines.push("", `*Total de referencia:* ${opts.estimatedTotal}`);
  if (opts.couponCode) lines.push(`*Código promocional:* ${opts.couponCode}`);

  lines.push("", "*Mis datos:*", `• Nombre: ${opts.customerName}`);
  if (opts.phone) lines.push(`• Teléfono: ${opts.phone}`);
  if (opts.city) lines.push(`• Ciudad: ${opts.city}`);
  if (opts.notes) lines.push("", `*Detalles adicionales:*`, opts.notes);

  lines.push("", "¿Me pueden confirmar el precio final y el tiempo de entrega? ¡Gracias! 🙌");
  return lines.join("\n");
}

/** Mensaje corto para dar seguimiento a una cotización existente */
export function quoteFollowUpMessage(opts: {
  storeName: string;
  code: string;
  customerName?: string;
}): string {
  return [
    `¡Hola ${opts.storeName}! 👋`,
    "",
    `Quiero dar seguimiento a mi cotización *#${opts.code}*.`,
    opts.customerName ? `A nombre de: ${opts.customerName}` : "",
    "",
    "¿Me pueden ayudar con el estado? ¡Gracias!",
  ]
    .filter(Boolean)
    .join("\n");
}

/** Mensaje prellenado con el contenido actual del carrito */
export function cartMessage(opts: {
  storeName: string;
  items: { name: string; quantity: number; lineTotal: string }[];
  total: string;
}): string {
  const lines = [
    `¡Hola ${opts.storeName}! 👋`,
    "",
    "Quiero cotizar estos productos:",
    ...opts.items.map((i) => `• ${i.quantity} × ${i.name} — ${i.lineTotal}`),
    "",
    `Total aproximado: ${opts.total}`,
  ];
  return lines.join("\n");
}

/** Mensaje para pedir una pieza personalizada */
export function customMessage(storeName: string): string {
  return [
    `¡Hola ${storeName}! 👋`,
    "",
    "Quiero cotizar una pieza personalizada en 3D.",
    "",
    "• ¿Qué necesito?: ",
    "• Medidas aproximadas: ",
    "• Color: ",
    "• ¿Para cuándo?: ",
  ].join("\n");
}
