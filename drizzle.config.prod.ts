// Configuración de Drizzle para la base de datos en la nube.
// Uso:  DATABASE_URL="tu-cadena" npx drizzle-kit push --config=drizzle.config.prod.ts
import type { Config } from "drizzle-kit";

const url = process.env.DATABASE_URL;
if (!url) throw new Error("Falta la variable DATABASE_URL");

export default {
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  dbCredentials: { url },
} satisfies Config;
