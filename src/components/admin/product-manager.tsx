"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { formatPrice, fromCents, toCents } from "@/lib/format";
import type { ProductWithCategory } from "@/lib/queries";
import { SafeProductImage } from "@/components/safe-product-image";

type Category = { id: number; slug: string; name: string; emoji: string };

type Draft = {
  id?: number;
  name: string;
  description: string;
  price: string;
  compareAtPrice: string;
  categoryId: number;
  imageUrl: string;
  stock: string;
  active: boolean;
  featured: boolean;
};

function emptyDraft(categoryId: number): Draft {
  return {
    name: "",
    description: "",
    price: "0.00",
    compareAtPrice: "",
    categoryId,
    imageUrl: "",
    stock: "0",
    active: true,
    featured: false,
  };
}

export function ProductManager({ categories }: { categories: Category[] }) {
  const [products, setProducts] = useState<ProductWithCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("todas");
  const [search, setSearch] = useState("");
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/products?all=1", { cache: "no-store" });
    setProducts(res.ok ? ((await res.json()) as ProductWithCategory[]) : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function notify(text: string) {
    setMessage(text);
    setTimeout(() => setMessage(null), 2500);
  }

  const visible = useMemo(
    () =>
      products.filter(
        (p) =>
          (filter === "todas" || p.categorySlug === filter) &&
          p.name.toLowerCase().includes(search.toLowerCase()),
      ),
    [products, filter, search],
  );

  async function uploadImage(file: File): Promise<string | null> {
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    setUploading(false);
    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      notify(data.error ?? "Error al subir la imagen");
      return null;
    }
    const data = (await res.json()) as { url: string };
    return data.url;
  }

  async function patch(id: number, body: Record<string, unknown>) {
    const res = await fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (res.ok) {
      await load();
      notify("Cambios guardados ✅");
    } else {
      notify("No se pudo guardar");
    }
  }

  async function saveDraft(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;
    setSaving(true);
    const payload = {
      name: draft.name,
      description: draft.description,
      price: toCents(draft.price),
      compareAtPrice: draft.compareAtPrice ? toCents(draft.compareAtPrice) : null,
      categoryId: draft.categoryId,
      imageUrl: draft.imageUrl,
      stock: parseInt(draft.stock || "0", 10),
      active: draft.active,
      featured: draft.featured,
    };
    const res = await fetch(draft.id ? `/api/products/${draft.id}` : "/api/products", {
      method: draft.id ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      notify("Error al guardar el producto");
      return;
    }
    setDraft(null);
    await load();
    notify(draft.id ? "Producto actualizado ✅" : "Producto creado ✅");
  }

  async function removeProduct(id: number) {
    if (!confirm("¿Eliminar este producto definitivamente?")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await load();
    notify("Producto eliminado");
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-3xl font-black">Productos</h1>
          <p className="text-sm text-slate-500">
            {products.length} productos · edita precios, stock y fotos al instante
          </p>
        </div>
        <button
          onClick={() => setDraft(emptyDraft(categories[0]?.id ?? 1))}
          className="ml-auto rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white hover:bg-teal-700"
        >
          + Nuevo producto
        </button>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          onClick={() => setFilter("todas")}
          className={`rounded-lg px-3 py-2 text-sm font-medium ${
            filter === "todas" ? "bg-slate-900 text-white" : "bg-white text-slate-600"
          }`}
        >
          Todas
        </button>
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilter(c.slug)}
            className={`rounded-lg px-3 py-2 text-sm font-medium ${
              filter === c.slug ? "bg-slate-900 text-white" : "bg-white text-slate-600"
            }`}
          >
            {c.emoji} {c.name}
          </button>
        ))}
        <input
          placeholder="Buscar…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="ml-auto rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
        />
      </div>

      {message && (
        <div className="mb-4 rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white">
          {message}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
            <tr>
              <th className="px-4 py-3">Producto</th>
              <th className="px-4 py-3">Categoría</th>
              <th className="px-4 py-3">Precio</th>
              <th className="px-4 py-3">Stock</th>
              <th className="px-4 py-3">Visible</th>
              <th className="px-4 py-3">Destacado</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  Cargando…
                </td>
              </tr>
            )}
            {!loading && visible.length === 0 && (
              <tr>
                <td colSpan={7} className="px-4 py-10 text-center text-slate-400">
                  Sin productos
                </td>
              </tr>
            )}
            {visible.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-12 w-12 overflow-hidden rounded-lg bg-slate-100">
                      <SafeProductImage
                        src={p.imageUrl}
                        alt={p.name}
                        label={p.categoryName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div>
                      <p className="font-semibold">{p.name}</p>
                      <p className="text-xs text-slate-400">{formatPrice(p.price)}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-slate-600">{p.categoryName}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    defaultValue={fromCents(p.price)}
                    onBlur={(e) => {
                      const cents = toCents(e.target.value);
                      if (cents !== p.price) void patch(p.id, { price: cents });
                    }}
                    className="w-24 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min="0"
                    defaultValue={p.stock}
                    onBlur={(e) => {
                      const stock = parseInt(e.target.value || "0", 10);
                      if (stock !== p.stock) void patch(p.id, { stock });
                    }}
                    className="w-20 rounded-lg border border-slate-300 px-2 py-1 text-sm"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={p.active}
                    onChange={(e) => void patch(p.id, { active: e.target.checked })}
                    className="h-5 w-5 accent-teal-600"
                  />
                </td>
                <td className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={p.featured}
                    onChange={(e) => void patch(p.id, { featured: e.target.checked })}
                    className="h-5 w-5 accent-amber-500"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    onClick={() =>
                      setDraft({
                        id: p.id,
                        name: p.name,
                        description: p.description,
                        price: fromCents(p.price),
                        compareAtPrice: p.compareAtPrice ? fromCents(p.compareAtPrice) : "",
                        categoryId: p.categoryId,
                        imageUrl: p.imageUrl,
                        stock: String(p.stock),
                        active: p.active,
                        featured: p.featured,
                      })
                    }
                    className="rounded-lg border border-slate-300 px-3 py-1 font-medium hover:bg-slate-100"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => void removeProduct(p.id)}
                    className="ml-2 rounded-lg px-3 py-1 font-medium text-rose-600 hover:bg-rose-50"
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 p-4">
          <form
            onSubmit={saveDraft}
            className="mx-auto my-8 max-w-2xl rounded-3xl bg-white p-6 shadow-2xl"
          >
            <h2 className="text-xl font-black">
              {draft.id ? "Editar producto" : "Nuevo producto"}
            </h2>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <label className="sm:col-span-2 text-sm font-medium">
                Nombre
                <input
                  required
                  value={draft.name}
                  onChange={(e) => setDraft({ ...draft, name: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-500"
                />
              </label>

              <label className="sm:col-span-2 text-sm font-medium">
                Descripción
                <textarea
                  rows={3}
                  value={draft.description}
                  onChange={(e) => setDraft({ ...draft, description: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-500"
                />
              </label>

              <label className="text-sm font-medium">
                Precio (USD)
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  required
                  value={draft.price}
                  onChange={(e) => setDraft({ ...draft, price: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal"
                />
              </label>

              <label className="text-sm font-medium">
                Precio anterior (opcional)
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={draft.compareAtPrice}
                  onChange={(e) => setDraft({ ...draft, compareAtPrice: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal"
                />
              </label>

              <label className="text-sm font-medium">
                Categoría
                <select
                  value={draft.categoryId}
                  onChange={(e) => setDraft({ ...draft, categoryId: Number(e.target.value) })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.emoji} {c.name}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-medium">
                Stock
                <input
                  type="number"
                  min="0"
                  value={draft.stock}
                  onChange={(e) => setDraft({ ...draft, stock: e.target.value })}
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal"
                />
              </label>

              <div className="sm:col-span-2">
                <p className="text-sm font-medium">Foto del producto</p>
                <div className="mt-2 flex flex-wrap items-center gap-4">
                  <div className="h-28 w-28 overflow-hidden rounded-xl border border-slate-200 bg-slate-100">
                    <SafeProductImage
                      src={draft.imageUrl}
                      alt="Vista previa del producto"
                      label="Producto 3D"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1 space-y-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        const url = await uploadImage(file);
                        if (url) setDraft((d) => (d ? { ...d, imageUrl: url } : d));
                      }}
                      className="block w-full text-sm file:mr-3 file:rounded-lg file:border-0 file:bg-slate-900 file:px-4 file:py-2 file:text-white"
                    />
                    <input
                      placeholder="o pega una URL de imagen"
                      value={draft.imageUrl}
                      onChange={(e) => setDraft({ ...draft, imageUrl: e.target.value })}
                      className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm"
                    />
                    {uploading && <p className="text-sm text-teal-600">Subiendo imagen…</p>}
                  </div>
                </div>
              </div>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={draft.active}
                  onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
                  className="h-5 w-5 accent-teal-600"
                />
                Visible en la tienda
              </label>

              <label className="flex items-center gap-2 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={draft.featured}
                  onChange={(e) => setDraft({ ...draft, featured: e.target.checked })}
                  className="h-5 w-5 accent-amber-500"
                />
                Destacado en portada
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving || uploading}
                className="rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 disabled:bg-slate-300"
              >
                {saving ? "Guardando…" : "Guardar producto"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
