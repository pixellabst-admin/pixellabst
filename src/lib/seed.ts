import { db } from "@/db";
import { categories, products } from "@/db/schema";

export const CATEGORY_SEED = [
  {
    slug: "oficina",
    name: "Oficina",
    emoji: "🖇️",
    description: "Organizadores, soportes y accesorios para tu escritorio.",
    sortOrder: 1,
  },
  {
    slug: "llaveros",
    name: "Llaveros",
    emoji: "🔑",
    description: "Llaveros personalizados con nombres, logos y figuras.",
    sortOrder: 2,
  },
  {
    slug: "hogar",
    name: "Hogar",
    emoji: "🏠",
    description: "Macetas, floreros y detalles decorativos para tu casa.",
    sortOrder: 3,
  },
  {
    slug: "figuras-3d",
    name: "Figuras 3D",
    emoji: "🐉",
    description: "Figuras de colección impresas y pintadas a mano.",
    sortOrder: 4,
  },
  {
    slug: "juguetes",
    name: "Juguetes",
    emoji: "🧸",
    description: "Juguetes articulados, fidgets y rompecabezas.",
    sortOrder: 5,
  },
];

const PRODUCT_SEED: Record<
  string,
  { name: string; price: number; stock: number; description: string; image: string; featured?: boolean }[]
> = {
  oficina: [
    {
      name: "Organizador de escritorio modular",
      price: 3490,
      stock: 12,
      description:
        "Sistema modular de 3 piezas para plumas, clips y notas. Impreso en PLA mate, disponible en 8 colores.",
      image: "/images/oficina.jpg",
      featured: true,
    },
    {
      name: "Soporte para audífonos",
      price: 2190,
      stock: 20,
      description: "Base robusta con acabado texturizado para mantener tus audífonos siempre a la mano.",
      image: "/images/oficina.jpg",
    },
    {
      name: "Porta tarjetas de presentación",
      price: 1590,
      stock: 30,
      description: "Elegante porta tarjetas con capacidad para 40 tarjetas. Personalizable con tu logotipo.",
      image: "/images/oficina.jpg",
    },
  ],
  llaveros: [
    {
      name: "Llavero personalizado con nombre",
      price: 890,
      stock: 100,
      description: "Elige nombre, color y tipografía. Ideal para regalos y eventos.",
      image: "/images/llaveros.jpg",
      featured: true,
    },
    {
      name: "Pack 5 llaveros para empresa",
      price: 3990,
      stock: 25,
      description: "Paquete corporativo con tu logo impreso en relieve. Descuentos por volumen.",
      image: "/images/llaveros.jpg",
    },
  ],
  hogar: [
    {
      name: "Florero geométrico espiral",
      price: 4490,
      stock: 10,
      description: "Florero impreso en vaso mode, 100% impermeable con sellado interior. Altura 22 cm.",
      image: "/images/hogar.jpg",
      featured: true,
    },
    {
      name: "Maceta autoirrigable",
      price: 2990,
      stock: 18,
      description: "Maceta con depósito de agua para suculentas y plantas pequeñas.",
      image: "/images/hogar.jpg",
    },
  ],
  "figuras-3d": [
    {
      name: "Dragón de colección pintado a mano",
      price: 8990,
      stock: 5,
      description: "Figura de 18 cm impresa en resina, detallada y pintada a mano pieza por pieza.",
      image: "/images/figuras.jpg",
      featured: true,
    },
    {
      name: "Busto personalizado desde foto",
      price: 12990,
      stock: 3,
      description: "Envíanos tus fotos y modelamos un busto único de 12 cm. Incluye base grabada.",
      image: "/images/figuras.jpg",
    },
  ],
  juguetes: [
    {
      name: "Dinosaurio articulado flexible",
      price: 1990,
      stock: 40,
      description: "Impreso en una sola pieza, articulado y resistente. Colores a elegir.",
      image: "/images/juguetes.jpg",
      featured: true,
    },
    {
      name: "Fidget infinito antiestrés",
      price: 1290,
      stock: 60,
      description: "Cubo infinito impreso en 3D con bisagras suaves. Perfecto para concentrarse.",
      image: "/images/juguetes.jpg",
    },
  ],
};

let seeded = false;

export async function ensureSeed() {
  if (seeded) return;
  try {
    await runSeed();
    seeded = true;
  } catch (err) {
    // No marcamos como sembrado: si falló por un corte de red,
    // se vuelve a intentar en la siguiente visita.
    console.error("[seed] no se pudo inicializar el catálogo:", err);
    throw err;
  }
}

async function runSeed() {
  for (const cat of CATEGORY_SEED) {
    await db.insert(categories).values(cat).onConflictDoNothing();
  }

  const existing = await db.select({ id: products.id }).from(products).limit(1);
  if (existing.length > 0) return;

  const cats = await db.select().from(categories);
  for (const cat of cats) {
    const items = PRODUCT_SEED[cat.slug] ?? [];
    for (const item of items) {
      await db
        .insert(products)
        .values({
          slug: item.name
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-|-$/g, ""),
          name: item.name,
          description: item.description,
          price: item.price,
          categoryId: cat.id,
          imageUrl: item.image,
          stock: item.stock,
          featured: Boolean(item.featured),
          active: true,
        })
        .onConflictDoNothing();
    }
  }
}
