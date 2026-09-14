import { createHmac } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "admin_session";

export function adminPassword(): string {
  return process.env.ADMIN_PASSWORD || "admin123";
}

function token(): string {
  return createHmac("sha256", "impresiones3d-admin")
    .update(adminPassword())
    .digest("hex");
}

export function sessionToken(): string {
  return token();
}

export async function isAdmin(): Promise<boolean> {
  const store = await cookies();
  return store.get(ADMIN_COOKIE)?.value === token();
}

export async function requireAdmin(): Promise<boolean> {
  return isAdmin();
}
