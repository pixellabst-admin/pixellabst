"use client";

import { useState } from "react";
import { useCart } from "./cart-provider";

type Props = {
  id: number;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
};

export function AddToCart(props: Props) {
  const { add, openCart } = useCart();
  const [qty, setQty] = useState(1);
  const soldOut = props.stock <= 0;

  const item = {
    id: props.id,
    slug: props.slug,
    name: props.name,
    price: props.price,
    imageUrl: props.imageUrl,
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex items-center rounded-lg border border-slate-300">
        <button
          type="button"
          className="px-3 py-2 text-lg"
          onClick={() => setQty((q) => Math.max(1, q - 1))}
        >
          −
        </button>
        <span className="w-10 text-center font-semibold">{qty}</span>
        <button
          type="button"
          className="px-3 py-2 text-lg"
          onClick={() => setQty((q) => Math.min(99, q + 1))}
        >
          +
        </button>
      </div>
      <button
        type="button"
        disabled={soldOut}
        onClick={() => add(item, qty)}
        className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-800 disabled:bg-slate-300"
      >
        Agregar a mi lista
      </button>
      <button
        type="button"
        disabled={soldOut}
        onClick={() => {
          add(item, qty);
          openCart();
        }}
        className="rounded-lg bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#20BD5A] disabled:bg-slate-300"
      >
        💬 Cotizar ahora
      </button>
    </div>
  );
}
