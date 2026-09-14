import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

/**
 * Conexión perezosa (lazy).
 *
 * Importante para Vercel: durante `next build` Next.js importa todos los
 * módulos para analizar las rutas. Si aquí lanzáramos un error cuando falta
 * DATABASE_URL, el build entero fallaría. En vez de eso, la conexión se crea
 * en la primera consulta real, ya en tiempo de ejecución.
 */

const globalForDb = globalThis as typeof globalThis & {
  __arenaPool?: Pool;
  __arenaDb?: NodePgDatabase;
};

function needsSsl(url: string): boolean {
  return /sslmode=require|neon\.tech|supabase|render\.com|railway|amazonaws/.test(url);
}

export function getPool(): Pool {
  if (globalForDb.__arenaPool) return globalForDb.__arenaPool;

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error(
      "Falta la variable DATABASE_URL. En Vercel agrégala en Settings → Environment Variables y vuelve a desplegar (Redeploy).",
    );
  }

  const pool = new Pool({
    connectionString: databaseUrl,
    // Pocas conexiones: en serverless cada instancia abre su propio pool.
    max: Number(process.env.DB_POOL_MAX ?? 3),
    idleTimeoutMillis: 20_000,
    connectionTimeoutMillis: 15_000,
    ssl: needsSsl(databaseUrl) ? { rejectUnauthorized: false } : undefined,
  });

  // Evita que un error de red tumbe el proceso.
  pool.on("error", (err) => {
    console.error("[db] error inesperado en el pool:", err.message);
  });

  globalForDb.__arenaPool = pool;
  return pool;
}

function getDb(): NodePgDatabase {
  if (!globalForDb.__arenaDb) {
    globalForDb.__arenaDb = drizzle(getPool());
  }
  return globalForDb.__arenaDb;
}

/**
 * Proxy que difiere la creación real del cliente hasta la primera consulta.
 * Permite `import { db } from "@/db"` sin efectos secundarios en el build.
 */
export const db = new Proxy({} as NodePgDatabase, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getDb(), prop, receiver);
    return typeof value === "function" ? value.bind(getDb()) : value;
  },
});

export const pool = new Proxy({} as Pool, {
  get(_target, prop, receiver) {
    const value = Reflect.get(getPool(), prop, receiver);
    return typeof value === "function" ? value.bind(getPool()) : value;
  },
});
