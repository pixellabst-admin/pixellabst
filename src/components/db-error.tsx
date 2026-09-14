export function DbError({ detail }: { detail?: string }) {
  const text = detail ?? "";

  // "relation ... does not exist" = conectó bien, pero faltan las tablas
  const missingTables = /does not exist|relation .* does not exist|42P01/i.test(text);
  const missingUrl = text.includes("DATABASE_URL");
  const cantReach = /ENOTFOUND|ECONNREFUSED|timeout|ETIMEDOUT/i.test(text);

  const title = missingTables
    ? "Faltan las tablas de la base de datos"
    : missingUrl
      ? "Falta configurar DATABASE_URL"
      : cantReach
        ? "No pudimos alcanzar la base de datos"
        : "Hay un problema con la base de datos";

  return (
    <div className="mx-auto max-w-2xl px-4 py-20">
      <div className="rounded-3xl bg-white p-8 shadow-sm">
        <div className="text-5xl">{missingTables ? "🗂️" : "🔌"}</div>
        <h1 className="mt-4 text-2xl font-black">{title}</h1>

        {missingTables ? (
          <>
            <p className="mt-2 text-slate-600">
              ¡Buenas noticias! La conexión funciona correctamente. Solo falta crear las tablas,
              que se hace <strong>una sola vez</strong>.
            </p>
            <div className="mt-6 rounded-2xl bg-emerald-50 p-5 text-sm text-emerald-900">
              <p className="font-bold">Ejecuta esto en tu computadora</p>
              <p className="mt-1">
                Abre una terminal dentro de la carpeta del proyecto y pega:
              </p>
              <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-900 p-3 text-xs text-slate-100">
{`DATABASE_URL="tu-cadena-de-neon" npx drizzle-kit push --config=drizzle.config.prod.ts`}
              </pre>
              <p className="mt-3">
                Debe decir <code className="rounded bg-emerald-100 px-1">Changes applied</code>.
                Luego recarga esta página.
              </p>
            </div>
          </>
        ) : (
          <>
            <p className="mt-2 text-slate-600">
              La tienda está publicada, pero le falta un paso de configuración.
            </p>
            <div className="mt-6 rounded-2xl bg-amber-50 p-5 text-sm text-amber-900">
              <ol className="list-decimal space-y-2 pl-5">
                <li>
                  En <strong>Vercel → Settings → Environment Variables</strong> debe existir{" "}
                  <code className="rounded bg-amber-100 px-1">DATABASE_URL</code> con la cadena de
                  Neon. Después haz <strong>Redeploy</strong>.
                </li>
                <li>
                  Verifica que la cadena sea la de <strong>Neon</strong> (contiene{" "}
                  <code className="rounded bg-amber-100 px-1">neon.tech</code>), no{" "}
                  <code className="rounded bg-amber-100 px-1">localhost</code>.
                </li>
              </ol>
            </div>
          </>
        )}

        {text && (
          <details className="mt-4">
            <summary className="cursor-pointer text-xs text-slate-400">Detalle técnico</summary>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-100 p-3 text-xs text-slate-600">
              {text}
            </pre>
          </details>
        )}
      </div>
    </div>
  );
}
