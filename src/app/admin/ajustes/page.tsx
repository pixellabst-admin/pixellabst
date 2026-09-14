import { redirect } from "next/navigation";
import { SettingsForm } from "@/components/admin/settings-form";
import { isAdmin } from "@/lib/auth";
import { getSettings } from "@/lib/settings";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  if (!(await isAdmin())) redirect("/admin/login");
  const settings = await getSettings();
  return <SettingsForm initial={settings} />;
}
