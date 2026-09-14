# Errores comunes en Vercel y cómo resolverlos

## Primero: lee el error real

1. Entra a **vercel.com** → tu proyecto
2. Pestaña **Deployments**
3. Clic en el despliegue que está en rojo (**Error**)
4. Abre la sección **Building**
5. Baja hasta la primera línea roja que diga `Error:`

Esa línea dice exactamente qué pasó. Búscala en la tabla de abajo.

---

## 1. `DATABASE_URL is required` (el más común)

**Causa:** olvidaste agregar la variable de entorno, o la agregaste
**después** del primer deploy.

**Solución:**

1. Proyecto → **Settings** → **Environment Variables**
2. Agrega:
   | Key | Value |
   |---|---|
   | `DATABASE_URL` | la cadena de Neon completa |
   | `ADMIN_PASSWORD` | tu contraseña |
3. Asegúrate de que estén marcados los 3 ambientes
   (*Production*, *Preview*, *Development*)
4. **Muy importante:** ve a **Deployments** → menú `…` del último →
   **Redeploy**

> Las variables **no se aplican solas**. Siempre hay que redesplegar.

✅ *Nota:* la versión actual del proyecto ya no truena el build por esto.
Si te pasó, actualiza el código con la última versión del ZIP.

---

## 2. `No Next.js version detected`

**Causa:** subiste la carpeta en lugar de su contenido. Vercel busca
`package.json` en la raíz y encuentra una carpeta.

**Solución A (rápida):**
Proyecto → Settings → **General** → **Root Directory** → **Edit** →
escribe el nombre de la carpeta (ej. `pixellabst`) → Save → Redeploy.

**Solución B (correcta):**
Borra los archivos en GitHub y vuelve a subir **el contenido** de la
carpeta, no la carpeta.

---

## 3. `Module not found: Can't resolve '@/components/...'`

**Causa:** faltan archivos al subir, normalmente porque el explorador
ocultó carpetas o se interrumpió la carga.

**Solución:** verifica en GitHub que exista `src/components/` con todos
los archivos `.tsx`. Si falta algo, vuelve a subirlo.

---

## 4. `Type error:` / `Failed to compile`

**Causa:** archivos incompletos o mezclados con una versión vieja.

**Solución:** borra el repositorio y sube de nuevo el ZIP más reciente,
sin mezclar archivos de descargas anteriores.

---

## 5. El deploy funciona pero la página da error 500

No es un error de build. Revisa:

- ¿Hiciste el **Paso 4** (crear las tablas con `drizzle-kit push`)?
- ¿La cadena de Neon termina en `?sslmode=require`?
- En Neon, usa la opción **Pooled connection** si ves *too many connections*.

Para ver el error exacto: proyecto → pestaña **Logs** (o *Runtime Logs*).

---

## 6. `ENOTFOUND` / `ECONNREFUSED` / `timeout`

**Causa:** la `DATABASE_URL` apunta a `localhost`. Esa dirección solo
existe en tu computadora, no en el servidor.

**Solución:** usa la cadena de **Neon**, que empieza así:
```
postgresql://neondb_owner:...@ep-algo-123.us-east-2.aws.neon.tech/neondb?sslmode=require
```

---

## 7. `Error: P1001` o la base tarda en responder

Neon en plan gratis **suspende** la base tras unos minutos sin uso.
La primera visita puede tardar 2–5 segundos mientras despierta.
Es normal, no es un error.

---

## 8. El build tarda mucho o se queda pegado

Revisa que **no subiste `node_modules`** a GitHub. Esa carpeta pesa
cientos de MB y no debe subirse; Vercel instala las dependencias solo.

Si la subiste: bórrala del repositorio y vuelve a desplegar.

---

## Cómo volver a desplegar

Después de cualquier corrección:

**Deployments** → menú `…` en el último → **Redeploy**
→ desmarca *Use existing Build Cache* → **Redeploy**

---

## Si nada funciona: empezar limpio

1. En Vercel: Settings → hasta abajo → **Delete Project**
2. En GitHub: verifica que los archivos estén bien
3. Vuelve a importar el proyecto en Vercel
4. **Agrega las variables ANTES de dar Deploy**

---

## Checklist antes de desplegar

- [ ] En GitHub se ve `package.json` en la raíz (no dentro de una carpeta)
- [ ] Se ven las carpetas `src/` y `public/`
- [ ] **No** se ve `node_modules/`
- [ ] En Vercel están `DATABASE_URL` y `ADMIN_PASSWORD`
- [ ] La `DATABASE_URL` es la de Neon, no `localhost`
