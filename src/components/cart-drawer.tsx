"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { useCart } from "./cart-provider";
import { QuotePanel } from "./quote-panel";

export function CartDrawer({
  whatsapp,
  storeName,
}: {
  whatsapp?: string;
  storeName: string;
}) {
  const { isOpen, closeCart, count } = useCart();
  const pathname = usePathname();

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (pathname.startsWith("/admin") || pathname === "/cotizar") return null;

  return (
    <div
      className={`fixed inset-0 z-50 ${isOpen ? "" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        onClick={closeCart}
        className={`absolute inset-0 bg-slate-900/50 transition-opacity ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      />
      <aside
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <h2 className="text-lg font-black">Solicitar cotización</h2>
            <p className="text-xs text-slate-500">
              {count > 0 ? `${count} producto${count === 1 ? "" : "s"} en tu lista` : "Sin productos"}
            </p>
          </div>
          <button
            onClick={closeCart}
            aria-label="Cerrar"
            className="grid h-9 w-9 place-items-center rounded-lg text-xl text-slate-500 hover:bg-slate-100"
          >
            ✕
          </button>
        </div>
        {isOpen && <QuotePanel whatsapp={whatsapp} storeName={storeName} onClose={closeCart} />}
      </aside>
    </div>
  );
}
