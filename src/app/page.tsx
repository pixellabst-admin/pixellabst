import Link from "next/link";
import { DbError } from "@/components/db-error";
import { ElSalvadorBadge } from "@/components/el-salvador-badge";
import { ProductCard } from "@/components/product-card";
import { WhatsappSection } from "@/components/whatsapp-section";
import { getCategories, listProducts } from "@/lib/queries";
import { getSettings } from "@/lib/settings";
import { getSocialLinks } from "@/lib/social";
import { isValidWhatsapp } from "@/lib/whatsapp";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let settings, categories, products;
  try {
    [settings, categories, products] = await Promise.all([
      getSettings(),
      getCategories(),
      listProducts(),
    ]);
  } catch (err) {
    return <DbError detail={err instanceof Error ? err.message : ""} />;
  }

  const featured = products.filter((p) => p.featured).slice(0, 4);
  const rest = products.slice(0, 8);

  return (
    <div>
      <section className="relative overflow-hidden bg-slate-900 text-white">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/hero.jpg"
          alt="Taller de impresión 3D"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <ElSalvadorBadge />
        <div className="relative mx-auto max-w-6xl px-4 py-20">
          <p className="mb-3 inline-block rounded-full bg-teal-500/20 px-3 py-1 text-sm font-semibold text-teal-300">
            {settings.tagline}
          </p>
          <h1 className="max-w-2xl text-4xl font-black leading-tight sm:text-5xl">
            {settings.storeName}: piezas únicas impresas en 3D
          </h1>
          <p className="mt-4 max-w-xl text-lg text-slate-200">{settings.heroText}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/categoria/oficina"
              className="rounded-xl bg-teal-500 px-6 py-3 font-semibold text-white hover:bg-teal-400"
            >
              Ver catálogo y cotizar
            </Link>
            {isValidWhatsapp(settings.whatsapp) && settings.whatsappEnabled !== "0" && (
              <a
                href="#contacto"
                className="rounded-xl bg-[#25D366] px-6 py-3 font-semibold text-white hover:bg-[#20BD5A]"
              >
                💬 Pedir cotización
              </a>
            )}
            <a
              href="#contacto"
              className="rounded-xl border border-white/40 px-6 py-3 font-semibold text-white hover:bg-white/10"
            >
              Contacto
            </a>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="mb-6 text-2xl font-bold">Categorías</h2>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {categories.map((c) => (
            <Link
              key={c.id}
              href={`/categoria/${c.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:-translate-y-1 hover:shadow-md"
            >
              <div className="text-3xl">{c.emoji}</div>
              <div className="mt-2 font-semibold">{c.name}</div>
              <div className="mt-1 text-xs text-slate-500">
                {products.filter((p) => p.categoryId === c.id).length} productos
              </div>
            </Link>
          ))}
        </div>
      </section>

      {featured.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-12">
          <h2 className="mb-6 text-2xl font-bold">Destacados ⭐</h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {featured.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <h2 className="mb-6 text-2xl font-bold">Novedades</h2>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {rest.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
        {rest.length === 0 && (
          <p className="rounded-xl border border-dashed border-slate-300 p-10 text-center text-slate-500">
            Aún no hay productos publicados. Vuelve pronto o escríbenos por WhatsApp para pedir
            algo personalizado.
          </p>
        )}
      </section>

      {isValidWhatsapp(settings.whatsapp) && settings.whatsappEnabled !== "0" && (
        <WhatsappSection
          phone={settings.whatsapp}
          storeName={settings.storeName}
          email={settings.email}
          hours={settings.whatsappHours}
          social={getSocialLinks(settings)}
        />
      )}
    </div>
  );
}
