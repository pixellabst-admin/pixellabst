import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/login-form";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function LoginPage() {
  if (await isAdmin()) redirect("/admin");

  // Solo avisamos de la contraseña por defecto si NO se configuró una propia.
  // Así nunca se filtra la pista en una tienda publicada.
  const usingDefault = !process.env.ADMIN_PASSWORD;

  return <LoginForm usingDefault={usingDefault} />;
}
