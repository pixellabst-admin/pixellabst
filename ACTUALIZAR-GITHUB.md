# Cómo actualizar los archivos en GitHub

Tu repositorio: **https://github.com/pixellabst-admin/pixellabst**

Elige el método que te acomode.

---

# MÉTODO 1 — Sin terminal (el más fácil)

Como cambiaron varios archivos, lo más limpio es **borrar y volver a subir**.

## 1a. Borra los archivos viejos

1. Entra a **https://github.com/pixellabst-admin/pixellabst**
2. Arriba a la derecha, clic en el ícono de **búsqueda de archivos**… mejor aún:
   haz clic en cualquier archivo, y verás el botón `…`

**Forma más rápida — borrar todo de una vez:**

1. En tu repositorio, clic en **Settings** (engrane)
2. Baja hasta **Danger Zone**
3. Clic en **Delete this repository**
4. Escribe `pixellabst-admin/pixellabst` para confirmar
5. Vuelve a crearlo: **github.com/new** → nombre `pixellabst` → **Private**
   → **sin marcar ninguna casilla** → *Create repository*

> Suena drástico, pero es lo más rápido y evita mezclar versiones viejas
> con nuevas. Como todavía no tienes historial importante, no pierdes nada.

## 1b. Sube los archivos nuevos

1. Descarga el ZIP más reciente y **descomprímelo**
2. En el repositorio vacío, clic en **uploading an existing file**
3. Abre la carpeta descomprimida y **entra dentro de ella**
4. Selecciona **todo el contenido** (`Ctrl+A` / `Cmd+A`)
5. Arrástralo al recuadro
6. Abajo, clic en **Commit changes**

✅ Vercel detectará el cambio y **republicará solo** en 1–2 minutos.

---

# MÉTODO 2 — Actualizador automático para Windows (recomendado)

No necesitas escribir comandos ni abrir CMD manualmente.

1. Descarga el ZIP más reciente y **descomprímelo** en una carpeta.
2. Abre esa carpeta (debe contener `src`, `public` y `package.json`).
3. Haz doble clic en:
   ```text
   ACTUALIZAR_GITHUB_WINDOWS.bat
   ```
4. Si Windows muestra un aviso, pulsa **Más información → Ejecutar de todas formas**.
5. La ventana hará todo: conecta GitHub, agrega archivos y fotos, crea el commit y los sube.
6. Espera el mensaje:
   ```text
   LISTO - ARCHIVOS SUBIDOS A GITHUB
   ```

> Si Git pide tus datos por primera vez, el archivo te solicitará tu nombre y
> correo. Si pide Password de GitHub, usa un Personal Access Token; no tu
> contraseña normal.

---

# MÉTODO 3 — Con terminal (solo si ya la usas)

Si ya hiciste el `git push` antes, tu carpeta ya está conectada al repositorio.

## 2a. Reemplaza los archivos

1. Descarga el ZIP nuevo y descomprímelo
2. **Copia todo su contenido** dentro de tu carpeta del proyecto,
   reemplazando los archivos cuando pregunte

> Si prefieres empezar limpio: descomprime el ZIP en una carpeta nueva
> y usa esa (tendrás que repetir el `git init` de abajo).

## 2b. Sube los cambios

Abre la terminal dentro de la carpeta y ejecuta:

```bash
git add .
git commit -m "Actualización del proyecto"
git push
```

Eso es todo. Tres comandos.

### Si es una carpeta nueva (primera vez)

```bash
git init
git add .
git commit -m "Actualización del proyecto"
git branch -M main
git remote add origin https://github.com/pixellabst-admin/pixellabst.git
git push -u origin main --force
```

> El `--force` sobrescribe lo que había. Úsalo solo cuando quieras
> reemplazar todo el contenido del repositorio.

---

# Verifica que se actualizó

En **https://github.com/pixellabst-admin/pixellabst** deberías ver:

- Arriba del listado, tu mensaje de commit (ej. *"Actualización del proyecto"*)
- La hora: **"now"** o **"1 minute ago"**
- El archivo `VERCEL-ERRORES.md` en la lista (es de la versión nueva)

---

# Verifica que Vercel republicó

1. Entra a **vercel.com** → tu proyecto
2. Pestaña **Deployments**
3. Arriba debe aparecer uno nuevo con estado **Building** y luego **Ready** ✅

Si dice **Error**, abre la sección *Building* y lee la primera línea roja.
Consulta `VERCEL-ERRORES.md`.

> Vercel republica **automáticamente** cada vez que subes algo a GitHub.
> No tienes que hacer nada extra.

---

# Errores comunes

**`Updates were rejected because the remote contains work`**
```bash
git pull origin main --allow-unrelated-histories
git push
```

**`nothing to commit, working tree clean`**
→ Los archivos son idénticos. Verifica que sí reemplazaste los del ZIP nuevo.

**`fatal: not a git repository`**
→ La terminal no está dentro de la carpeta del proyecto.
   Windows: abre la carpeta, escribe `cmd` en la barra de dirección, Enter.
   Mac: clic derecho en la carpeta → *Nueva terminal en la carpeta*.

**`remote origin already exists`**
```bash
git remote set-url origin https://github.com/pixellabst-admin/pixellabst.git
```

**Pide usuario y contraseña**
→ GitHub ya no acepta la contraseña normal. Usa un **Personal Access Token**:
   Settings → Developer settings → Personal access tokens → Tokens (classic)
   → Generate new token → marca `repo` → copia y pégalo como *Password*.

---

# Recuerda

Los cambios que haces desde **/admin** (precios, fotos, productos,
WhatsApp) **no requieren nada de esto**. Se guardan en la base de datos
y son inmediatos.

Esto solo aplica cuando cambia el **código** del proyecto.
