import Link from "next/link";
import { notFound } from "next/navigation";
import { ProductCard } from "@/components/product-card";
import { getCategories, listProducts } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { slug } = await params;
  const { q } = await searchParams;
  const categories = await getCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const products = await listProducts({ category: slug, q });

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Inicio
        </Link>{" "}
        / <span className="text-slate-900">{category.name}</span>
      </nav>

      <div className="mb-8 flex flex-col gap-4 rounded-2xl bg-white p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-black">
            {category.emoji} {category.name}
          </h1>
          <p className="mt-1 text-slate-500">{category.description}</p>
        </div>
        <form className="flex gap-2" action={`/categoria/${slug}`}>
          <input
            name="q"
            defaultValue={q ?? ""}
            placeholder="Buscar producto…"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-teal-500"
          />
          <button className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white">
            Buscar
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
      {products.length === 0 && (
        <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
          No hay productos en esta categoría todavía.
        </p>
      )}
    </div>
  );
}
