import { redirect } from "next/navigation";
import { ProductManager } from "@/components/admin/product-manager";
import { isAdmin } from "@/lib/auth";
import { getCategories } from "@/lib/queries";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const categories = await getCategories();
  return (
    <ProductManager
      categories={categories.map((c) => ({
        id: c.id,
        slug: c.slug,
        name: c.name,
        emoji: c.emoji,
      }))}
    />
  );
}
