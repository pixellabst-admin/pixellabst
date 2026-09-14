# Publicar la tienda en www.pixellabst.com

Guía paso a paso. En total toma **30–45 minutos** y cuesta **$0** extra
(ya pagaste el dominio).

---

## Lo que vas a hacer

| Paso | Qué | Tiempo |
|---|---|---|
| 1 | Crear la base de datos en la nube (Neon) | 5 min |
| 2 | Subir el código a GitHub | 10 min |
| 3 | Publicar en Vercel | 5 min |
| 4 | Crear las tablas | 2 min |
| 5 | Conectar `pixellabst.com` | 10 min + espera |
| 6 | Configurar tu tienda | 10 min |

---

## PASO 1 — Base de datos en la nube

Tu PostgreSQL actual solo existe en esta computadora. Necesitas una en internet.

1. Entra a **https://neon.tech** y crea una cuenta (puedes usar Google/GitHub).
2. Clic en **Create project**. Ponle nombre `pixellabst`.
3. Elige la región más cercana a tus clientes.
4. Al terminar te muestra la **Connection string**. Cópiala completa:

```
postgresql://neondb_owner:AbC123xyz@ep-cool-name-12345.us-east-2.aws.neon.tech/neondb?sslmode=require
```

> 📋 Guárdala en un bloc de notas. La usarás dos veces.

---

## PASO 2 — Subir el código a GitHub

1. Crea cuenta en **https://github.com** si no tienes.
2. Clic en **+ → New repository**.
   - Nombre: `pixellabst`
   - Marca **Private** (para que nadie vea tu código)
   - **No** marques "Add a README"
   - Clic en **Create repository**

3. Descarga el proyecto de esta herramienta a tu computadora.
4. Abre una terminal dentro de la carpeta y ejecuta:

```bash
git init
git add .
git commit -m "Tienda Pixel Labs"
git branch -M main
git remote add origin https://github.com/pixellabst-admin/pixellabst.git
git push -u origin main
```

> Esta URL ya tiene tu usuario real (`pixellabst-admin`).
> Si te pide contraseña, usa un **Personal Access Token**
> (GitHub → Settings → Developer settings → Tokens).

✅ El proyecto ya tiene `.gitignore`, así que **tu archivo `.env` con
contraseñas NO se sube**. Eso es a propósito y correcto.

---

## PASO 3 — Publicar en Vercel

1. Entra a **https://vercel.com** → **Sign up** → **Continue with GitHub**.
2. Clic en **Add New… → Project**.
3. Busca tu repositorio `pixellabst` y clic en **Import**.
4. **ANTES de dar Deploy**, abre **Environment Variables** y agrega estas dos:

   | Key | Value |
   |---|---|
   | `DATABASE_URL` | la cadena de Neon del Paso 1 |
   | `ADMIN_PASSWORD` | una contraseña fuerte tuya |

   > ⚠️ **No dejes `admin123`.** Cualquiera podría entrar a tu panel.
   > Usa algo como `PixelLabs2026!Seguro`

5. Clic en **Deploy** y espera 1–2 minutos.

Al terminar, Vercel te muestra una pantalla de felicitación con **tu dirección real**.

> ⚠️ **Importante:** esa dirección **no la eliges tú ni la puedes adivinar**.
> Vercel la genera. Puede ser `pixellabst.vercel.app`, pero si ese nombre ya
> lo tomó otra persona en el mundo, te dará algo como
> `pixellabst-a1b2c3.vercel.app` o `pixellabst-tuusuario.vercel.app`.
>
> **Cópiala de la pantalla de Vercel.** Si intentas adivinarla verás el error
> `DEPLOYMENT_NOT_FOUND`.

### Dónde encontrar tu dirección después

Si cerraste la ventana: entra a **vercel.com** → clic en tu proyecto →
arriba aparece **Domains** con tu dirección real. También hay un botón **Visit**.

**Ya funciona**, pero todavía no tiene tablas. Sigue al Paso 4.

---

## PASO 4 — Crear las tablas

Una sola vez, desde tu computadora, en la carpeta del proyecto:

**Mac / Linux:**
```bash
DATABASE_URL="pega-aquí-la-cadena-de-neon" npx drizzle-kit push --config=drizzle.config.prod.ts
```

**Windows (PowerShell):**
```powershell
$env:DATABASE_URL="pega-aquí-la-cadena-de-neon"
npx drizzle-kit push --config=drizzle.config.prod.ts
```

Debe decir `[✓] Changes applied`.

Ahora abre `pixellabst.vercel.app` y verás la tienda con los productos
de ejemplo (se crean solos).

---

## PASO 5 — Conectar www.pixellabst.com

### 5a. En Vercel

1. Tu proyecto → **Settings → Domains**
2. Escribe `pixellabst.com` → **Add**
3. Escribe también `www.pixellabst.com` → **Add**
4. Vercel te mostrará los registros DNS que necesitas. Déjalo abierto.

### 5b. Donde compraste el dominio

Entra al panel de tu registrador y busca **DNS / Administrar DNS /
Zone Editor**. Agrega estos dos registros:

| Tipo | Nombre / Host | Valor / Apunta a | TTL |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` | Automático |
| `CNAME` | `www` | `cname.vercel-dns.com` | Automático |

**Dónde encontrarlo según el registrador:**

- **GoDaddy:** Mis productos → DNS → Administrar zonas
- **Namecheap:** Domain List → Manage → Advanced DNS
- **Hostinger:** Dominios → Administrar → DNS / Nameservers
- **Google Domains / Squarespace:** DNS → Registros personalizados

> ⚠️ Si ya existen registros `A` o `CNAME` con el nombre `@` o `www`
> (algunos registradores ponen una página de "en construcción"),
> **bórralos primero**.

### 5c. Esperar

Los cambios de DNS tardan entre **10 minutos y 2 horas** (raras veces hasta 24 h).
En Vercel el dominio pasará de *Invalid Configuration* a **Valid** ✅

El certificado HTTPS se genera solo. No tienes que hacer nada.

🎉 Listo: **https://www.pixellabst.com**

---

## PASO 6 — Configurar tu tienda

Entra a `https://www.pixellabst.com/admin` con tu contraseña nueva.

- [ ] **Ajustes** → pon tu **número real de WhatsApp** (¡lo más importante!)
      Usa el botón "Probar el enlace" para confirmar que abre tu chat
- [ ] **Ajustes** → nombre de la tienda, eslogan, correo, horario
- [ ] **Productos** → borra los de ejemplo y sube los tuyos con fotos reales
- [ ] **Cupones** → ajusta o elimina los de ejemplo
- [ ] Haz una **cotización de prueba desde tu celular** y verifica que
      te llegue el mensaje a WhatsApp

---

## Cómo actualizar la página después

Cada vez que cambies algo en el código:

```bash
git add .
git commit -m "descripción del cambio"
git push
```

Vercel detecta el cambio y republica automáticamente en ~1 minuto.

> Los cambios que haces desde `/admin` (precios, fotos, productos)
> son **inmediatos**, no requieren esto.

---

## Problemas comunes

**`DEPLOYMENT_NOT_FOUND` al abrir una dirección `.vercel.app`**
→ Significa que **ahí no hay nada publicado**. Dos causas:
1. Todavía no completaste el Paso 3 (no has hecho el Deploy).
2. Estás escribiendo una dirección inventada. La real te la da Vercel;
   búscala en vercel.com → tu proyecto → botón **Visit**.

**"This site can't be reached" en pixellabst.com**
→ Normal si aún no llegas al Paso 5. El dominio no muestra nada hasta que
lo conectes a Vercel y se propaguen los DNS.

**"Invalid Configuration" en Vercel después de horas**
→ Revisa que borraste los registros DNS viejos. Verifica en
https://dnschecker.org escribiendo `pixellabst.com`

**La página carga pero sin productos**
→ Faltó el Paso 4. Ejecuta el comando de `drizzle-kit push`.

**Error 500 / "DATABASE_URL is required"**
→ La variable no quedó guardada en Vercel. Ve a
Settings → Environment Variables, revísala y haz **Redeploy**.

**"too many connections"**
→ En Neon usa la cadena **Pooled connection** (hay un selector en su panel).

**Las fotos que subo no aparecen**
→ Ya está resuelto: las imágenes se guardan en la base de datos,
no en archivos. Funciona correctamente en Vercel.

---

## Costos

| Concepto | Costo |
|---|---|
| Dominio (ya pagado) | ~$12/año |
| Vercel Hobby | **$0** |
| Neon Free | **$0** |

Los planes gratis alcanzan de sobra para empezar. Vercel Hobby incluye
100 GB de tráfico al mes; Neon Free, 0.5 GB de datos.
