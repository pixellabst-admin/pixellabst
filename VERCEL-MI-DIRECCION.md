# ¿Cuál es MI dirección en Vercel?

Vercel crea **varias** direcciones para el mismo proyecto. Todas funcionan,
pero conviene usar la correcta.

---

## La forma más rápida

1. Entra a **https://vercel.com/dashboard**
2. Verás una tarjeta con tu proyecto (`pixellabst`).
3. **Debajo del nombre aparece la dirección en gris.** Esa es.
4. Haz clic en la tarjeta y luego en el botón **Visit** (arriba a la derecha).

> El botón **Visit** siempre abre la dirección correcta.
> Si dudas, usa ese botón y copia lo que salga en la barra del navegador.

---

## Si ves varias direcciones

Al entrar al proyecto, en la sección **Domains** pueden aparecer 3 tipos:

| Ejemplo | Qué es | ¿Usarla? |
|---|---|---|
| `pixellabst.vercel.app` | **Producción** | ✅ Sí, es la principal |
| `pixellabst-git-main-tuuser.vercel.app` | La rama `main` | ⚠️ Funciona, pero es secundaria |
| `pixellabst-k3j9x8f2.vercel.app` | Un despliegue puntual | ❌ Cambia con cada cambio |

**Usa siempre la primera** (la más corta, sin guiones raros).

---

## ¿Y si el nombre ya estaba ocupado?

Los subdominios `.vercel.app` son únicos a nivel mundial. Si alguien más ya
tenía `pixellabst`, Vercel te habrá dado algo como:

- `pixellabst-tuusuario.vercel.app`
- `pixellabst-2.vercel.app`

No es un error. De todos modos esa dirección es **temporal**: cuando conectes
`pixellabst.com` (Paso 5), esa será la que le des a tus clientes.

---

## Cómo cambiar el nombre (opcional)

Si no te gusta el que te tocó:

1. Proyecto → **Settings** → **Domains**
2. Busca el dominio `.vercel.app` → menú `…` → **Edit**
3. Escribe otro nombre y guarda

No es necesario. Tu dirección final será `www.pixellabst.com`.

---

## Verifica que funcione

Abre tu dirección. Deberías ver:

- ✅ **La tienda con productos** → todo bien, sigue al Paso 5
- ⚠️ **La tienda pero vacía / error de base de datos** → falta el Paso 4
  (crear las tablas con `drizzle-kit push`)
- ❌ **`DEPLOYMENT_NOT_FOUND`** → esa dirección no es la tuya, vuelve arriba
- ❌ **Error 500** → revisa las variables de entorno en
  Settings → Environment Variables (`DATABASE_URL` y `ADMIN_PASSWORD`)

---

## ¿El deploy falló?

Si en el dashboard ves el proyecto en rojo con **Error**:

1. Entra al proyecto → pestaña **Deployments**
2. Clic en el despliegue que falló
3. Abre **Building** para leer el error

El fallo más común es olvidar la variable `DATABASE_URL`.
Agrégala en Settings → Environment Variables y luego
**Deployments → menú `…` → Redeploy**.
