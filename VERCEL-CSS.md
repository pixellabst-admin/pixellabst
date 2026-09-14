# La página se ve sin diseño (letras azules y sin colores)

Si la tienda aparece como texto azul subrayado, enlaces simples y cajas sin
colores, significa que el navegador no recibió la hoja de estilos. **No es un
problema de tus productos ni de la base de datos.**

La versión actual ya incluye un respaldo independiente en
`public/site.css` (aprox. 40 KB). El layout lo carga directamente, sin pasar
por el procesador de Tailwind de Vercel. Solo hay que subir esta versión y
redesplegar sin caché.

---

## Solución (5 minutos)

### 1. Descarga el ZIP nuevo

Usa el enlace de descarga de la página `/descargar` y descomprímelo.

### 2. Actualiza GitHub

Reemplaza los archivos por los del ZIP nuevo y, desde la terminal dentro de
la carpeta, ejecuta:

```bash
git add .
git commit -m "Corregir estilos visuales"
git push
```

### 3. Redespliega SIN caché en Vercel

1. Entra a **vercel.com** → tu proyecto
2. Abre la pestaña **Deployments**
3. En el despliegue más reciente, clic en el menú `…`
4. Clic en **Redeploy**
5. En la ventana que aparece, **DESMARCA** la opción
   `Use existing Build Cache`
6. Clic en **Redeploy**

Espera a que el estado cambie a **Ready** ✅.

### 4. Recarga sin caché en tu navegador

Al abrir la tienda:

- **Windows:** `Ctrl + Shift + R`
- **Mac:** `Cmd + Shift + R`
- **Celular:** abre la tienda en una pestaña incógnita, o borra datos del
  navegador para el sitio.

---

## Cómo saber que quedó bien

Debes ver:

- Fondo gris claro, no blanco puro
- Encabezado blanco y pegado arriba al desplazarte
- Botones verdes y oscuros, no links azules
- Tarjetas con esquinas redondeadas y sombras
- Fotos de productos cuadradas con etiquetas de categoría

---

## Si aún se ve sin diseño

1. Abre la tienda en una ventana de incógnito.
2. En Vercel confirma que el último deployment dice **Ready**, no Error.
3. Confirma que GitHub muestra el commit `Corregir estilos visuales`.
4. Revisa que en GitHub exista el archivo:
   `src/app/globals.css`

Ese archivo debe aparecer y pesar aproximadamente 40 KB. Si mide muy poco,
se subió una versión vieja del ZIP: vuelve a descargar el archivo más reciente.
