# Las fotos salen rotas en Vercel

## Qué significa

Si ves un icono de imagen rota y el nombre del producto encima de una tarjeta,
la tienda y los estilos están bien. Solamente faltan los archivos de imagen en
el repositorio de GitHub que Vercel está publicando.

Las fotos que necesita la tienda son estas seis:

```text
public/images/hero.jpg
public/images/oficina.jpg
public/images/llaveros.jpg
public/images/hogar.jpg
public/images/figuras.jpg
public/images/juguetes.jpg
```

---

# Solución en Windows — subir SOLO las fotos

## 1. Confirma que tienes las fotos

1. Abre la carpeta donde descomprimiste `pixellabst.zip`.
2. Entra a la carpeta `public`.
3. Debe existir una carpeta `images`.
4. Dentro deben aparecer las 6 fotos: `hero.jpg`, `oficina.jpg`, etc.

> Si no está la carpeta `images`, descarga de nuevo el ZIP más reciente y
> descomprímelo. No copies solo los archivos sueltos: copia la carpeta
> `public` completa.

## 2. Abre CMD dentro de la carpeta del proyecto

1. Abre la carpeta del proyecto con el Explorador de Windows.
2. Haz clic una vez en la barra superior donde aparece la ruta.
3. Escribe `cmd` y presiona **Enter**.

Se abrirá la ventana negra de comandos en la carpeta correcta.

## 3. Pega estos comandos, uno por uno

```bat
git add public/images
git commit -m "Agregar imagenes de productos"
git push
```

> Si el segundo comando dice `nothing to commit`, significa que las imágenes
> ya estaban incluidas en GitHub. En ese caso Vercel está mostrando un deploy
> viejo: sigue el paso 5.

## 4. Verifica en GitHub

Abre esta dirección:

```text
https://github.com/pixellabst-admin/pixellabst
```

Haz clic en:

```text
public → images
```

Debes ver estas seis imágenes como archivos `.jpg`. Si no las ves, el push no
terminó: revisa el error que mostró CMD.

## 5. Espera el nuevo despliegue de Vercel

1. Ve a **vercel.com** → proyecto `pixellabst` → **Deployments**.
2. Debe aparecer un deployment nuevo llamado `Agregar imagenes de productos`.
3. Espera a que diga **Ready** ✅.
4. Abre `https://pixellabst.vercel.app` y recarga con `Ctrl + Shift + R`.

No uses **Redeploy** antes de hacer el `git push`: Vercel solo puede publicar
lo que realmente exista en GitHub.

---

## Si no quieres usar CMD

1. En GitHub, abre tu repositorio → carpeta `public`.
2. Haz clic en **Add file → Upload files**.
3. Arrastra la carpeta `images` (o las seis imágenes que hay dentro).
4. Abajo, clic en **Commit changes**.
5. Espera el deployment automático de Vercel.

> Recomendación: usa CMD, porque conserva las carpetas automáticamente y evita
> que las fotos queden en la ubicación equivocada.

---

## Cómo comprobar que funcionó

Abre esta URL en el navegador:

```text
https://pixellabst.vercel.app/images/oficina.jpg
```

- Si ves la foto del organizador de escritorio: todo está listo.
- Si aparece una página 404: las imágenes todavía no están en GitHub/Vercel.
