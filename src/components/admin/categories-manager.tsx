"use client";

import { useCallback, useEffect, useMemo, useState } from "react";

type Category = {
  id: number;
  slug: string;
  name: string;
  emoji: string;
  description: string;
  sortOrder: number;
};

type ProductRef = { id: number; categoryId: number };

type Draft = {
  id?: number;
  name: string;
  slug: string;
  emoji: string;
  description: string;
  sortOrder: string;
};

const COMMON_ICONS = ["📦", "🖇️", "🔑", "🏠", "🐉", "🧸", "🎁", "✨", "🖨️", "🪴", "🎮", "🛠️"];

function emptyDraft(nextOrder: number): Draft {
  return {
    name: "",
    slug: "",
    emoji: "📦",
    description: "",
    sortOrder: String(nextOrder),
  };
}

function makeSlug(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

export function CategoriesManager() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [products, setProducts] = useState<ProductRef[]>([]);
  const [loading, setLoading] = useState(true);
  const [draft, setDraft] = useState<Draft | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "ok" | "error" } | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [catRes, productsRes] = await Promise.all([
        fetch("/api/categories", { cache: "no-store" }),
        fetch("/api/products?all=1", { cache: "no-store" }),
      ]);
      if (!catRes.ok) throw new Error("No se pudieron cargar las categorías");
      setCategories((await catRes.json()) as Category[]);
      setProducts(productsRes.ok ? ((await productsRes.json()) as ProductRef[]) : []);
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Ocurrió un error", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  function showMessage(text: string, type: "ok" | "error") {
    setMessage({ text, type });
    window.setTimeout(() => setMessage(null), 3500);
  }

  const sorted = useMemo(
    () => [...categories].sort((a, b) => a.sortOrder - b.sortOrder || a.id - b.id),
    [categories],
  );

  const maxOrder = useMemo(
    () => categories.reduce((max, category) => Math.max(max, category.sortOrder), 0),
    [categories],
  );

  function productCount(categoryId: number): number {
    return products.filter((product) => product.categoryId === categoryId).length;
  }

  function newCategory() {
    setDraft(emptyDraft(maxOrder + 1));
  }

  function editCategory(category: Category) {
    setDraft({
      id: category.id,
      name: category.name,
      slug: category.slug,
      emoji: category.emoji,
      description: category.description,
      sortOrder: String(category.sortOrder),
    });
  }

  async function save(e: React.FormEvent) {
    e.preventDefault();
    if (!draft) return;

    const name = draft.name.trim();
    const slug = makeSlug(draft.slug || name);
    if (!name || !slug) {
      showMessage("Escribe un nombre válido para la categoría", "error");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch(draft.id ? `/api/categories/${draft.id}` : "/api/categories", {
        method: draft.id ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          slug,
          emoji: draft.emoji || "📦",
          description: draft.description,
          sortOrder: Math.max(0, Number.parseInt(draft.sortOrder || "0", 10) || 0),
        }),
      });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "No se pudo guardar la categoría");

      setDraft(null);
      await load();
      showMessage(draft.id ? "Categoría actualizada ✅" : "Categoría creada ✅", "ok");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Ocurrió un error", "error");
    } finally {
      setSaving(false);
    }
  }

  async function deleteCategory(category: Category) {
    const count = productCount(category.id);
    if (count > 0) {
      showMessage(
        `No puedes eliminar “${category.name}” porque tiene ${count} producto(s). Edita esos productos y muévelos primero.`,
        "error",
      );
      return;
    }
    if (!confirm(`¿Eliminar la categoría “${category.name}”? Esta acción no se puede deshacer.`)) return;

    try {
      const response = await fetch(`/api/categories/${category.id}`, { method: "DELETE" });
      const data = (await response.json().catch(() => ({}))) as { error?: string };
      if (!response.ok) throw new Error(data.error || "No se pudo eliminar la categoría");
      await load();
      showMessage("Categoría eliminada", "ok");
    } catch (error) {
      showMessage(error instanceof Error ? error.message : "Ocurrió un error", "error");
    }
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div>
          <h1 className="text-3xl font-black">Categorías</h1>
          <p className="mt-1 text-sm text-slate-500">
            Crea y organiza las secciones que verán tus visitantes en la tienda.
          </p>
        </div>
        <button
          type="button"
          onClick={newCategory}
          className="ml-auto rounded-xl bg-teal-600 px-5 py-3 font-semibold text-white transition hover:bg-teal-700"
        >
          + Nueva categoría
        </button>
      </div>

      {message && (
        <div
          className={`mb-4 rounded-xl px-4 py-3 text-sm font-semibold ${
            message.type === "ok" ? "bg-emerald-50 text-emerald-800" : "bg-rose-50 text-rose-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div className="overflow-hidden rounded-2xl bg-white shadow-sm">
        <div className="border-b border-slate-100 px-5 py-4 text-sm text-slate-500">
          {categories.length} categoría{categories.length === 1 ? "" : "s"} en la tienda
        </div>
        <div className="divide-y divide-slate-100">
          {loading && <p className="p-10 text-center text-slate-400">Cargando categorías…</p>}
          {!loading && sorted.length === 0 && (
            <p className="p-10 text-center text-slate-400">Aún no hay categorías.</p>
          )}
          {sorted.map((category) => {
            const count = productCount(category.id);
            return (
              <div
                key={category.id}
                className="flex flex-col gap-4 px-5 py-4 sm:flex-row sm:items-center"
              >
                <div className="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-slate-100 text-2xl">
                  {category.emoji}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-bold text-slate-900">{category.name}</h2>
                    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-600">
                      {count} producto{count === 1 ? "" : "s"}
                    </span>
                    <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-700">
                      Orden {category.sortOrder}
                    </span>
                  </div>
                  <p className="mt-1 truncate text-sm text-slate-500">
                    {category.description || "Sin descripción"}
                  </p>
                  <p className="mt-1 text-xs text-slate-400">/categoria/{category.slug}</p>
                </div>
                <div className="flex shrink-0 gap-2">
                  <button
                    type="button"
                    onClick={() => editCategory(category)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => void deleteCategory(category)}
                    className="rounded-lg px-3 py-2 text-sm font-semibold text-rose-600 hover:bg-rose-50"
                  >
                    Eliminar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {draft && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 p-4">
          <form
            onSubmit={save}
            className="mx-auto my-8 max-w-xl rounded-3xl bg-white p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-black">
                  {draft.id ? "Editar categoría" : "Nueva categoría"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Se mostrará en el menú y en la portada de la tienda.
                </p>
              </div>
              <div className="grid h-12 w-12 place-items-center rounded-xl bg-slate-100 text-2xl">
                {draft.emoji || "📦"}
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="block text-sm font-semibold text-slate-700">
                Nombre de la categoría *
                <input
                  required
                  value={draft.name}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? {
                            ...current,
                            name: event.target.value,
                            slug:
                              !current.id || current.slug === makeSlug(current.name)
                                ? makeSlug(event.target.value)
                                : current.slug,
                          }
                        : current,
                    )
                  }
                  placeholder="Ej. Regalos personalizados"
                  className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-500"
                />
              </label>

              <div className="grid gap-4 sm:grid-cols-[1fr_130px]">
                <label className="block text-sm font-semibold text-slate-700">
                  Icono
                  <input
                    value={draft.emoji}
                    onChange={(event) =>
                      setDraft((current) => (current ? { ...current, emoji: event.target.value } : current))
                    }
                    maxLength={16}
                    placeholder="📦"
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-500"
                  />
                </label>
                <label className="block text-sm font-semibold text-slate-700">
                  Orden
                  <input
                    type="number"
                    min="0"
                    value={draft.sortOrder}
                    onChange={(event) =>
                      setDraft((current) =>
                        current ? { ...current, sortOrder: event.target.value } : current,
                      )
                    }
                    className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-500"
                  />
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                {COMMON_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() =>
                      setDraft((current) => (current ? { ...current, emoji: icon } : current))
                    }
                    aria-label={`Usar icono ${icon}`}
                    className={`grid h-9 w-9 place-items-center rounded-lg text-lg transition ${
                      draft.emoji === icon
                        ? "bg-teal-100 ring-2 ring-teal-500"
                        : "bg-slate-100 hover:bg-slate-200"
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>

              <label className="block text-sm font-semibold text-slate-700">
                Descripción
                <textarea
                  rows={3}
                  value={draft.description}
                  onChange={(event) =>
                    setDraft((current) =>
                      current ? { ...current, description: event.target.value } : current,
                    )
                  }
                  placeholder="Ej. Regalos únicos impresos especialmente para cada ocasión."
                  className="mt-1 w-full resize-none rounded-lg border border-slate-300 px-3 py-2 font-normal outline-none focus:border-teal-500"
                />
              </label>

              <label className="block text-sm font-semibold text-slate-700">
                URL de la categoría
                <div className="mt-1 flex items-center overflow-hidden rounded-lg border border-slate-300 focus-within:border-teal-500">
                  <span className="border-r border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-400">
                    /categoria/
                  </span>
                  <input
                    value={draft.slug}
                    onChange={(event) =>
                      setDraft((current) =>
                        current ? { ...current, slug: makeSlug(event.target.value) } : current,
                      )
                    }
                    placeholder="regalos-personalizados"
                    className="min-w-0 flex-1 px-3 py-2 font-normal outline-none"
                  />
                </div>
                <span className="mt-1 block text-xs font-normal text-slate-400">
                  Usa minúsculas, números y guiones. Si ya tienes productos en esta categoría, sus
                  enlaces anteriores cambiarán.
                </span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDraft(null)}
                className="rounded-xl border border-slate-300 px-5 py-3 font-semibold text-slate-600 hover:bg-slate-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-teal-600 px-6 py-3 font-semibold text-white hover:bg-teal-700 disabled:bg-slate-300"
              >
                {saving ? "Guardando…" : draft.id ? "Guardar cambios" : "Crear categoría"}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
