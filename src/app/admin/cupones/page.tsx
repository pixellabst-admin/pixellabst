import { redirect } from "next/navigation";
import { CouponsManager } from "@/components/admin/coupons-manager";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function AdminCouponsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  return <CouponsManager />;
}
