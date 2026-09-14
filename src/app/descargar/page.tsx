import { CopyBlock } from "@/components/copy-block";

export const metadata = {
  title: "Descargar y publicar el proyecto",
};

const GIT_COMMANDS = `git init
git add .
git commit -m "Tienda Pixel Labs"
git branch -M main
git remote add origin https://github.com/pixellabst-admin/pixellabst.git
git push -u origin main`;

const UPDATE_COMMANDS = `git add .
git commit -m "Actualización del proyecto"
git push`;

const STEPS = [
  {
    n: 1,
    title: "Descarga y descomprime",
    body: "Baja el ZIP y descomprímelo. En Windows: clic derecho → Extraer todo. En Mac: doble clic.",
  },
  {
    n: 2,
    title: "Crea el repositorio en GitHub",
    body: "Entra a github.com/new. Nómbralo exactamente pixellabst, márcalo Private y NO marques ninguna casilla extra (ni README, ni .gitignore, ni licencia).",
  },
  {
    n: 3,
    title: "Sube los archivos",
    body: "Abre una terminal dentro de la carpeta descomprimida y pega los comandos de abajo. O usa el método sin terminal: arrastra el contenido en la página de GitHub.",
  },
  {
    n: 4,
    title: "Publica en Vercel",
    body: "Entra a vercel.com con tu cuenta de GitHub, importa el repositorio pixellabst y agrega las variables DATABASE_URL y ADMIN_PASSWORD antes de dar Deploy.",
  },
];

export default function DownloadPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-black">Publicar en www.pixellabst.com</h1>
      <p className="mt-2 text-slate-600">
        Descarga el proyecto y súbelo a tu repositorio{" "}
        <code className="rounded bg-slate-200 px-1 text-sm">pixellabst-admin/pixellabst</code>
      </p>

      <a
        href="/descarga/pixellabst.zip"
        download
        className="mt-6 flex items-center justify-center gap-3 rounded-2xl bg-slate-900 px-6 py-5 text-lg font-bold text-white transition hover:bg-slate-800"
      >
        ⬇️ Descargar pixellabst.zip
      </a>
      <p className="mt-2 text-center text-xs text-slate-400">
        Aproximadamente 1.4 MB · Incluye todo el código, imágenes y guías
      </p>

      <div className="mt-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
        <p className="font-bold">¿Ves fotos rotas en Vercel?</p>
        <p className="mt-1">Descarga únicamente las seis imágenes y súbelas a la carpeta public/images de GitHub.</p>
        <a
          href="/descarga/imagenes-pixellabst.zip"
          download
          className="mt-3 inline-block rounded-lg bg-amber-900 px-4 py-2 font-semibold text-white hover:bg-amber-800"
        >
          ⬇️ Descargar solo las imágenes
        </a>
      </div>

      <div className="mt-10 space-y-4">
        {STEPS.map((s) => (
          <div key={s.n} className="flex gap-4 rounded-2xl bg-white p-5 shadow-sm">
            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-teal-600 font-bold text-white">
              {s.n}
            </span>
            <div>
              <h2 className="font-bold">{s.title}</h2>
              <p className="mt-1 text-sm text-slate-600">{s.body}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-black">Comandos para subir a GitHub</h2>
        <p className="mt-1 text-sm text-slate-600">
          Abre una terminal <strong>dentro de la carpeta descomprimida</strong> y pega esto. Ya
          lleva tu usuario real.
        </p>
        <CopyBlock code={GIT_COMMANDS} />

        <div className="mt-4 rounded-2xl bg-amber-50 p-5 text-sm text-amber-900">
          <p className="font-bold">Si te pide usuario y contraseña</p>
          <p className="mt-1">
            GitHub ya no acepta la contraseña normal. Necesitas un{" "}
            <strong>Personal Access Token</strong>:
          </p>
          <p className="mt-2">
            GitHub → foto de perfil → <strong>Settings</strong> → hasta abajo{" "}
            <strong>Developer settings</strong> → <strong>Personal access tokens</strong> →{" "}
            <strong>Tokens (classic)</strong> → <strong>Generate new token</strong> → marca la
            casilla <code className="rounded bg-amber-100 px-1">repo</code> → copia el código y
            pégalo cuando pida <em>Password</em>.
          </p>
        </div>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-indigo-200 bg-indigo-50 p-5">
        <h2 className="font-black text-indigo-900">
          🔄 ¿Ya lo habías subido y solo quieres actualizarlo?
        </h2>
        <p className="mt-2 text-sm text-indigo-900">
          <strong>En Windows no necesitas escribir comandos:</strong> descomprime el ZIP, abre la
          carpeta y haz doble clic en <code className="rounded bg-white px-1">ACTUALIZAR_GITHUB_WINDOWS.bat</code>.
          El archivo sube todo automáticamente a GitHub.
        </p>
        <p className="mt-3 text-sm text-indigo-900">
          Si prefieres usar la terminal, copia el contenido nuevo sobre tu carpeta actual y ejecuta:
        </p>
        <CopyBlock code={UPDATE_COMMANDS} />
        <p className="mt-2 text-sm text-indigo-900">
          Vercel detecta el cambio y <strong>republica automáticamente</strong> en 1–2 minutos.
        </p>
      </div>

      <div className="mt-8 rounded-2xl bg-slate-100 p-5">
        <h2 className="font-black text-slate-800">¿No tienes Git instalado?</h2>
        <p className="mt-2 text-sm text-slate-600">
          Puedes subirlo sin terminal: entra a tu repositorio vacío en GitHub, haz clic en el
          enlace <strong>&quot;uploading an existing file&quot;</strong>, entra dentro de la carpeta
          descomprimida, selecciona <strong>todo su contenido</strong> (Ctrl+A o Cmd+A) y arrástralo.
        </p>
        <p className="mt-2 text-sm font-semibold text-amber-700">
          ⚠️ Arrastra el contenido, no la carpeta. GitHub debe recibir src/, public/ y
          package.json sueltos en la raíz.
        </p>
      </div>

      <div className="mt-8 rounded-2xl border-2 border-teal-200 bg-teal-50 p-5">
        <h2 className="font-black text-teal-900">Después del Deploy</h2>
        <ol className="mt-2 list-decimal space-y-1 pl-5 text-sm text-teal-900">
          <li>
            Crea las tablas:{" "}
            <code className="rounded bg-white px-1 text-xs">
              DATABASE_URL=&quot;tu-cadena&quot; npx drizzle-kit push
              --config=drizzle.config.prod.ts
            </code>
          </li>
          <li>Conecta tu dominio en Vercel: Settings → Domains → pixellabst.com</li>
          <li>Entra a /admin y pon tu número real de WhatsApp</li>
        </ol>
      </div>
    </div>
  );
}
