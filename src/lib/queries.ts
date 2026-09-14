import { db } from "@/db";
import { categories, products } from "@/db/schema";
import { and, asc, desc, eq, ilike, or, type SQL } from "drizzle-orm";
import { ensureSeed } from "./seed";

export type ProductWithCategory = {
  id: number;
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  categoryId: number;
  imageUrl: string;
  stock: number;
  active: boolean;
  featured: boolean;
  categoryName: string;
  categorySlug: string;
};

const selection = {
  id: products.id,
  slug: products.slug,
  name: products.name,
  description: products.description,
  price: products.price,
  compareAtPrice: products.compareAtPrice,
  categoryId: products.categoryId,
  imageUrl: products.imageUrl,
  stock: products.stock,
  active: products.active,
  featured: products.featured,
  categoryName: categories.name,
  categorySlug: categories.slug,
};

export async function getCategories() {
  await ensureSeed();
  return db.select().from(categories).orderBy(asc(categories.sortOrder));
}

export async function listProducts(opts: {
  category?: string;
  q?: string;
  includeInactive?: boolean;
} = {}): Promise<ProductWithCategory[]> {
  await ensureSeed();
  const filters: SQL[] = [];
  if (!opts.includeInactive) filters.push(eq(products.active, true));
  if (opts.category) filters.push(eq(categories.slug, opts.category));
  if (opts.q) {
    const like = `%${opts.q}%`;
    const search = or(ilike(products.name, like), ilike(products.description, like));
    if (search) filters.push(search);
  }

  const query = db
    .select(selection)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(asc(categories.sortOrder), desc(products.id));

  if (filters.length > 0) return query.where(and(...filters));
  return query;
}

export async function getProductBySlug(slug: string): Promise<ProductWithCategory | null> {
  await ensureSeed();
  const rows = await db
    .select(selection)
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);
  return rows[0] ?? null;
}
