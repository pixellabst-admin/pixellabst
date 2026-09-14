"use client";

import Link from "next/link";
import { formatPrice } from "@/lib/format";
import { useCart } from "./cart-provider";
import type { ProductWithCategory } from "@/lib/queries";
import { SafeProductImage } from "./safe-product-image";

export function ProductCard({ product }: { product: ProductWithCategory }) {
  const { add } = useCart();
  const soldOut = product.stock <= 0;

  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:shadow-lg">
      <Link href={`/producto/${product.slug}`} className="relative block aspect-square overflow-hidden bg-slate-100">
        <SafeProductImage
          src={product.imageUrl}
          alt={product.name}
          label={product.categoryName}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-slate-700">
          {product.categoryName}
        </span>
        {soldOut && (
          <span className="absolute right-3 top-3 rounded-full bg-rose-600 px-2 py-1 text-xs font-semibold text-white">
            Agotado
          </span>
        )}
      </Link>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <Link href={`/producto/${product.slug}`} className="font-semibold leading-tight text-slate-900 hover:underline">
          {product.name}
        </Link>
        <p className="line-clamp-2 text-sm text-slate-500">{product.description}</p>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div>
            <p className="text-lg font-bold text-slate-900">{formatPrice(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="text-xs text-slate-400 line-through">{formatPrice(product.compareAtPrice)}</p>
            ) : null}
          </div>
          <button
            type="button"
            disabled={soldOut}
            onClick={() =>
              add({
                id: product.id,
                slug: product.slug,
                name: product.name,
                price: product.price,
                imageUrl: product.imageUrl,
              })
            }
            className="rounded-lg bg-[#25D366] px-3 py-2 text-sm font-semibold text-white transition hover:bg-[#20BD5A] disabled:cursor-not-allowed disabled:bg-slate-300"
          >
            {soldOut ? "Sin stock" : "+ Cotizar"}
          </button>
        </div>
      </div>
    </div>
  );
}
