import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/add-to-cart";
import { ProductCard } from "@/components/product-card";
import { SafeProductImage } from "@/components/safe-product-image";
import { WhatsappProductButton } from "@/components/whatsapp-product-button";
import { formatPrice } from "@/lib/format";
import { getProductBySlug, listProducts } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { isValidWhatsapp } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function ProductPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.active) notFound();

  const [related, settings] = await Promise.all([
    listProducts({ category: product.categorySlug }).then((rows) =>
      rows.filter((p) => p.id !== product.id).slice(0, 4),
    ),
    getSettings(),
  ]);
  const showWhatsapp = settings.whatsappEnabled !== "0" && isValidWhatsapp(settings.whatsapp);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <nav className="mb-6 text-sm text-slate-500">
        <Link href="/" className="hover:underline">
          Inicio
        </Link>{" "}
        /{" "}
        <Link href={`/categoria/${product.categorySlug}`} className="hover:underline">
          {product.categoryName}
        </Link>{" "}
        / <span className="text-slate-900">{product.name}</span>
      </nav>

      <div className="grid gap-8 md:grid-cols-2">
        <div className="overflow-hidden rounded-3xl bg-white shadow-sm">
          <SafeProductImage
            src={product.imageUrl}
            alt={product.name}
            label={product.categoryName}
            className="aspect-square w-full object-cover"
          />
        </div>

        <div>
          <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-semibold text-teal-700">
            {product.categoryName}
          </span>
          <h1 className="mt-3 text-3xl font-black">{product.name}</h1>
          <div className="mt-4 flex items-end gap-3">
            <p className="text-4xl font-black text-slate-900">{formatPrice(product.price)}</p>
            {product.compareAtPrice ? (
              <p className="pb-1 text-lg text-slate-400 line-through">
                {formatPrice(product.compareAtPrice)}
              </p>
            ) : null}
          </div>
          <p className="mt-2 text-sm text-slate-500">
            {product.stock > 0 ? `${product.stock} disponibles` : "Temporalmente agotado"}
          </p>
          <p className="mt-6 whitespace-pre-line leading-relaxed text-slate-700">{product.description}</p>

          <div className="mt-8">
            <AddToCart
              id={product.id}
              slug={product.slug}
              name={product.name}
              price={product.price}
              imageUrl={product.imageUrl}
              stock={product.stock}
            />
          </div>

          {showWhatsapp && (
            <div className="mt-4">
              <WhatsappProductButton
                phone={settings.whatsapp}
                storeName={settings.storeName}
                productName={product.name}
                price={formatPrice(product.price)}
              />
              <p className="mt-2 text-xs text-slate-500">
                ¿Lo quieres en otro color o tamaño? Pregúntanos sin compromiso.
              </p>
            </div>
          )}

          <ul className="mt-8 space-y-2 text-sm text-slate-600">
            <li>🚚 Envío a todo el país en 3-5 días hábiles</li>
            <li>🎨 Personalizamos color y tamaño sin costo extra</li>
            <li>♻️ Materiales PLA y PETG de alta calidad</li>
          </ul>
        </div>
      </div>

      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-2xl font-bold">También te puede gustar</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
