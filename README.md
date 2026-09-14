# Taller 3D — Tienda + Panel de administración

Tienda de productos impresos en 3D (Oficina, Llaveros, Hogar, Figuras 3D, Juguetes)
con catálogo, carrito, pago dentro de la página y panel para administrar todo el contenido.

---

## 1) Ver la página sin instalar nada (lo más rápido)

Usa la **URL de vista previa** que aparece en el botón *Preview* de esta herramienta.
Ábrela en Chrome, Safari o Edge, en tu computadora o en tu celular.

- Tienda: `/`
- Panel de administración: `/admin`
- Solicitar cotización: `/cotizar`
- Consultar una cotización: `/cotizacion`

> La URL de preview cambia cada vez que se reconstruye el proyecto.
> Siempre toma la más reciente del botón *Preview*.

---

## 2) Correrla en tu propia computadora

### Requisitos
- **Node.js 20 o superior** → https://nodejs.org (descarga la versión LTS)
- **PostgreSQL 14 o superior** → https://www.postgresql.org/download/
  (en Mac lo más fácil es https://postgresapp.com)

### Pasos

**a. Descarga el proyecto** y abre una terminal dentro de la carpeta.

```bash
cd ruta/a/la/carpeta-del-proyecto
```

**b. Instala las dependencias**

```bash
npm install
```

**c. Crea la base de datos**

```bash
createdb app_db
```

Si `createdb` no existe, entra a psql y ejecuta `CREATE DATABASE app_db;`

**d. Crea el archivo `.env`** en la raíz del proyecto con este contenido
(ajusta usuario y contraseña si tu PostgreSQL usa otros):

```
DATABASE_URL=postgresql://postgres:postgres@127.0.0.1:5432/app_db
ADMIN_PASSWORD=admin123
```

**e. Crea las tablas**

```bash
npx drizzle-kit push
```

**f. Arranca la página**

```bash
npm run dev
```

**g. Abre tu navegador en:**

```
http://localhost:3000
```

Los productos de ejemplo y las 5 categorías se crean solos la primera vez que abres la página.

---

## Modo producción (más rápido)

```bash
npm run build
npm run start
```

Y abre `http://localhost:3000`.

### Cambiar el puerto

Si el 3000 está ocupado:

```bash
npm run dev -- -p 4000
```

---

## Moneda

Todos los precios están en **dólares estadounidenses (USD)** y se muestran con
formato `$1,234.56`.

En el panel escribes los precios en dólares normales (por ejemplo `34.90`);
internamente se guardan en centavos para evitar errores de redondeo.

Para cambiar la moneda en el futuro, edita `CURRENCY` en `src/lib/format.ts`.

---

## Cómo administrar el contenido

1. Entra a `http://localhost:3000/admin`
2. Contraseña: **`admin123`**
   (cámbiala editando `ADMIN_PASSWORD` en el archivo `.env` y reiniciando)

Dentro del panel puedes:

| Sección | Qué haces ahí |
|---|---|
| **Productos** | Cambiar precios y stock directo en la tabla, subir y actualizar fotos, crear, editar, ocultar o eliminar productos, marcar destacados |
| **Categorías** | Crear nuevas categorías, cambiar nombre, icono, descripción, URL y orden en el menú; eliminar solo si no tienen productos |
| **Cotizaciones** | Ver solicitudes, responder por WhatsApp y cambiar el estado |
| **Cupones** | Crear códigos promocionales que el cliente incluye en su cotización |
| **Ajustes** | Nombre de la tienda, eslogan, texto de portada, contacto, costo de envío, **WhatsApp** y **redes sociales** (Facebook, Instagram, TikTok) |

### Dos direcciones: visitas y administración

- **Visitas:** la dirección normal (`/`). No muestra ningún botón ni enlace de
  administración, y el panel no aparece en buscadores.
- **Administración:** la misma dirección más `/admin` (ej.
  `https://www.pixellabst.com/admin`). Guárdala en tus favoritos y no la
  compartas. Es la única puerta al panel.
- **Forzar la pantalla de contraseña:** abre `/admin/cerrar-sesion` (ej.
  `https://www.pixellabst.com/admin/cerrar-sesion`). Borra la sesión actual y
  te manda al formulario de acceso. Una sesión dura 8 horas por defecto; se
  puede ajustar con `ADMIN_SESSION_HOURS` en Vercel.

---

## Contacto por WhatsApp

La tienda tiene contacto por WhatsApp en 5 lugares:

1. **Botón flotante** abajo a la derecha en todas las páginas, con menú de opciones.
2. **Sección de contacto** en la portada, con armador de mensaje y vista previa.
3. **Botón en cada producto**: envía el nombre, precio y liga de la pieza.
4. **Al enviar una cotización**: el mensaje completo con productos y datos.
5. **En el seguimiento** (`/cotizacion`) para dar seguimiento a una solicitud.

### Cómo poner tu número

1. Entra a `/admin/ajustes`
2. En la sección **Contacto por WhatsApp** escribe tu número **con código de país**:
   `+52 55 1234 5678` (México), `+34 612 345 678` (España), `+57 300 123 4567` (Colombia)
3. Puedes personalizar el mensaje inicial y el horario de atención.
4. Usa **"Probar el enlace"** para verificar que abre tu chat.
5. Si no quieres mostrarlo, desmarca *Mostrar WhatsApp en la tienda*.

> Los enlaces usan `wa.me`, el sistema oficial de WhatsApp. Funcionan en celular
> (abre la app) y en computadora (abre WhatsApp Web). No requieren ninguna cuenta
> de API ni pago.

---

## Cómo funciona la cotización

La tienda **no cobra en línea**. El cliente arma una lista y la solicitud
te llega por WhatsApp para que tú confirmes el precio final.

1. El cliente toca **"+ Cotizar"** en los productos que le interesan.
2. Se abre el panel lateral: **Mi lista → Mis datos → Enviar**.
3. Ve una **vista previa** exacta del mensaje antes de enviarlo.
4. Al enviar, la solicitud se guarda con un código (`C12345678`) y
   se abre WhatsApp con todo el detalle ya escrito: productos, cantidades,
   precios de referencia, datos del cliente y sus notas.
5. Tú respondes con el precio final desde tu WhatsApp.

El cliente puede consultar su solicitud en `/cotizacion` con el código y su correo.

### Gestionar las solicitudes

En **`/admin/cotizaciones`** ves todas las solicitudes con métricas
(nuevas por atender y valor en proceso), filtros por estado y un botón
**"💬 Responder"** que abre WhatsApp con un mensaje ya armado para ese cliente.

Estados: `nueva` → `contactado` → `cotizado` → `aceptada` → `cerrada` (o `cancelada`).

---

## Problemas comunes

**"DATABASE_URL is required"** → falta el archivo `.env` o está mal escrito el nombre.

**"ECONNREFUSED 127.0.0.1:5432"** → PostgreSQL no está corriendo. Ábrelo (Postgres.app)
o inícialo con `brew services start postgresql` / `sudo service postgresql start`.

**"port 3000 is already in use"** → usa otro puerto: `npm run dev -- -p 4000`

**No aparecen productos** → ejecuta `npx drizzle-kit push` y recarga la página.
