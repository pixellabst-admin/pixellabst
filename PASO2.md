# Paso 2 — Subir el código a GitHub

Tu repositorio: **https://github.com/pixellabst-admin/pixellabst**

Hay **dos formas**. Elige la que te acomode.

- **Opción A (fácil):** arrastrar archivos en la página de GitHub. No requiere instalar nada.
- **Opción B (terminal):** para quien ya usa Git.

---

# OPCIÓN A — Sin instalar nada (recomendada)

## A1. Descarga el proyecto

Abre esta dirección en tu navegador:

```
/descargar
```

(en la vista previa actual, agrega `/descargar` al final de la URL)

Haz clic en **⬇️ Descargar pixellabst.zip** y luego **descomprime** el archivo:

- **Windows:** clic derecho → *Extraer todo…*
- **Mac:** doble clic

Te queda una carpeta con `src`, `public`, `package.json`, etc.

---

## A2. Crea la cuenta y el repositorio

1. Entra a **https://github.com** y crea una cuenta (si no tienes).
2. Arriba a la derecha, clic en **+** → **New repository**.
3. Llena así:

   | Campo | Qué poner |
   |---|---|
   | Repository name | `pixellabst` (exactamente así) |
   | Description | (opcional) Tienda de impresión 3D |
   | Visibilidad | **Private** ✅ |
   | Add a README file | ❌ **NO marcar** |
   | Add .gitignore | ❌ **None** |
   | Choose a license | ❌ **None** |

   > Es importante **no marcar** esas casillas. Si las marcas, el
   > repositorio no queda vacío y el siguiente paso no aparece.

4. Clic en el botón verde **Create repository**.

---

## A3. Sube los archivos

Verás una página que dice *"Quick setup"*. Busca esta línea:

> …or **uploading an existing file**

Haz clic en **uploading an existing file** (es un enlace azul).

Ahora:

1. Abre la carpeta que descomprimiste en el paso A1.
2. **Entra dentro de la carpeta.**
3. Selecciona **todo el contenido**:
   - Windows: `Ctrl + E` (o Ctrl+A)
   - Mac: `Cmd + A`
4. **Arrástralo** al recuadro de GitHub que dice *"Drag files here"*.

> ⚠️ **El error más común:** arrastrar la carpeta en vez de su contenido.
> GitHub debe recibir `package.json`, `src/`, `public/`… sueltos en la raíz,
> **no** una carpeta `pixellabst` que los contenga.
> Si ves una sola carpeta en la lista, bórrala y vuelve a arrastrar
> entrando primero a ella.

5. Espera a que suban (barra de progreso, ~1 minuto).
6. Baja hasta el final y clic en **Commit changes** (botón verde).

✅ **Listo.** Deberías ver tus archivos listados. Ya puedes ir al **Paso 3**
(publicar en Vercel) en `DEPLOY.md`.

---

## Cómo verificar que quedó bien

En la página principal de tu repositorio debes ver, entre otros:

```
public/
src/
.gitignore
DEPLOY.md
README.md
next.config.ts
package.json
tsconfig.json
```

Si solo ves **una carpeta**, repite el paso A3 entrando dentro de ella.

Si **no ves `.gitignore`** no pasa nada: Windows y Mac ocultan los archivos
que empiezan con punto. El proyecto funciona igual porque el ZIP no
contiene `node_modules` ni contraseñas.

---

# OPCIÓN B — Con la terminal

Requiere tener Git instalado (https://git-scm.com/downloads).

## B1. Crea el repositorio

Igual que en **A2** (vacío, sin README).

## B2. Ejecuta los comandos

Abre una terminal **dentro de la carpeta del proyecto** y pega esto
(ya lleva tu usuario real, cópialo tal cual):

```bash
git init
git add .
git commit -m "Tienda Pixel Labs"
git branch -M main
git remote add origin https://github.com/pixellabst-admin/pixellabst.git
git push -u origin main
```

### Cómo abrir la terminal en la carpeta correcta

**Windows:** abre la carpeta descomprimida en el Explorador, haz clic en la
barra de dirección de arriba, escribe `cmd` y presiona Enter.

**Mac:** clic derecho sobre la carpeta → *Servicios* → *Nueva terminal en la carpeta*.
O abre Terminal y escribe `cd ` (con espacio) y arrastra la carpeta encima.

> Si ves `fatal: not a git repository` es que la terminal no está dentro
> de la carpeta del proyecto.

## B3. Si te pide usuario y contraseña

GitHub **ya no acepta la contraseña normal**. Necesitas un token:

1. GitHub → foto de perfil → **Settings**
2. Hasta abajo: **Developer settings**
3. **Personal access tokens** → **Tokens (classic)**
4. **Generate new token (classic)**
5. Marca la casilla **repo**
6. **Generate token** y **copia el código** (solo se muestra una vez)
7. Cuando la terminal pida *Password*, pega ese token

---

# Problemas comunes

**"Repository not found"**
→ Revisa que el nombre de usuario en la URL esté bien escrito.

**"Support for password authentication was removed"**
→ Usa un token, como se explica en B3.

**Subí la carpeta en vez del contenido**
→ En GitHub: entra a la carpeta → botón `…` arriba a la derecha →
*Delete directory* → confirma. Y vuelve a subir correctamente.

**Los archivos pesan mucho / tarda**
→ Asegúrate de que no estás subiendo `node_modules`.
El ZIP que te dimos ya la excluye; si descargaste el proyecto por
otro medio, borra esa carpeta antes de subir.

**Me equivoqué en todo y quiero empezar de nuevo**
→ Settings del repositorio → hasta abajo → *Delete this repository*.
Y repites desde A2.

**`remote origin already exists`**
→ Ya habías corrido el comando antes. Ejecuta:
```bash
git remote set-url origin https://github.com/pixellabst-admin/pixellabst.git
```

**`failed to push some refs` / `rejected`**
→ El repositorio no estaba vacío (marcaste README al crearlo). Solución:
```bash
git pull origin main --allow-unrelated-histories
git push -u origin main
```

**`src refspec main does not match any`**
→ Falta el commit. Ejecuta `git add .` y `git commit -m "Tienda"` antes del push.
