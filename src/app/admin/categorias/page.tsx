import { redirect } from "next/navigation";
import { CategoriesManager } from "@/components/admin/categories-manager";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return <CategoriesManager />;
}
