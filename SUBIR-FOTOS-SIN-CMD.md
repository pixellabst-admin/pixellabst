# Subir las fotos a GitHub sin usar CMD

La página ya funciona; solo faltan seis fotos en Vercel. Haz esto exactamente:

## 1. Descarga las fotos

Descarga `imagenes-pixellabst.zip` desde la página `/descargar` y descomprímelo.
Obtendrás una carpeta llamada `images` con 6 archivos `.jpg`.

## 2. Entra a GitHub

1. Ve a: https://github.com/pixellabst-admin/pixellabst
2. Inicia sesión con la cuenta `pixellabst-admin` si GitHub te lo pide.
3. Haz clic en la carpeta **public**.

## 3. Crea la carpeta images (solo si no aparece)

Si dentro de `public` NO ves una carpeta llamada `images`:

1. Pulsa **Add file** → **Create new file**.
2. En el campo de nombre escribe exactamente:
   ```text
   images/.keep
   ```
3. Baja y pulsa el botón verde **Commit new file**.
4. Ahora dentro de `public` aparecerá la carpeta **images**. Haz clic en ella.

Si ya ves `images`, solo ábrela.

## 4. Sube las 6 fotos

1. Dentro de la carpeta `public/images`, pulsa **Add file** → **Upload files**.
2. Pulsa **choose your files**.
3. Abre la carpeta `images` que descomprimiste en el paso 1.
4. Selecciona las 6 fotos con `Ctrl + A`.
5. Pulsa **Abrir**.
6. Baja hasta el final de GitHub y pulsa el botón verde **Commit changes**.

## 5. Espera a Vercel

1. Ve a Vercel → tu proyecto → **Deployments**.
2. Verás un deployment nuevo. Espera a que cambie a **Ready** ✅.
3. Recarga la tienda con `Ctrl + Shift + R`.

## Verificación rápida

Abre esta dirección:

```text
https://pixellabst.vercel.app/images/oficina.jpg
```

Si ves la foto del organizador, las fotos ya están bien cargadas y la tienda
las mostrará de inmediato.

---

No necesitas usar `git init`, CMD, Git Bash ni ningún comando para este método.
