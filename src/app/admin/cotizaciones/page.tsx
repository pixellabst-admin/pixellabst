import { redirect } from "next/navigation";
import { QuotesManager } from "@/components/admin/quotes-manager";
import { isAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminQuotesPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const settings = await getSettings();
  return <QuotesManager storeName={settings.storeName} />;
}
