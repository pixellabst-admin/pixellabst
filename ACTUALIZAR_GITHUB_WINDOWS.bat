@echo off
setlocal EnableExtensions
color 0A
title PixelLabs Studio - Actualizar GitHub

REM =============================================================
REM  ACTUALIZADOR DE PIXELLABS PARA WINDOWS
REM  Doble clic en este archivo desde la carpeta del proyecto.
REM =============================================================

REM Siempre trabaja desde la carpeta en la que esta este .bat.
cd /d "%~dp0"

set "REPO=https://github.com/pixellabst-admin/pixellabst.git"
set "MENSAJE=Actualizar tienda PixelLabs"

echo.
echo ============================================================
echo              PIXELLABS - ACTUALIZAR GITHUB
echo ============================================================
echo.
echo Carpeta actual:
echo %CD%
echo.
echo Repositorio:
echo %REPO%
echo.

REM Evita ejecutar el archivo desde una carpeta equivocada.
if not exist "package.json" (
  echo ERROR: No encuentro el archivo package.json.
  echo.
  echo Este archivo debe estar dentro de la carpeta principal del proyecto.
  echo Abre la carpeta que descomprimiste y ejecuta este .bat desde ahi.
  echo Debes ver las carpetas src y public junto a este archivo.
  echo.
  pause
  exit /b 1
)

if not exist "src" (
  echo ERROR: No encuentro la carpeta src.
  echo Ejecuta este archivo desde la carpeta principal de PixelLabs.
  echo.
  pause
  exit /b 1
)

where git >nul 2>&1
if errorlevel 1 (
  echo ERROR: Git no esta instalado o Windows no lo encuentra.
  echo.
  echo 1. Descarga Git aqui: https://git-scm.com/download/win
  echo 2. Instalalo dejando las opciones por defecto.
  echo 3. Cierra esta ventana y abre este archivo otra vez.
  echo.
  pause
  exit /b 1
)

echo [1 de 6] Preparando la carpeta...
git init >nul 2>&1
if errorlevel 1 goto :GITERROR

echo [2 de 6] Conectando con GitHub...
git remote get-url origin >nul 2>&1
if errorlevel 1 (
  git remote add origin "%REPO%"
) else (
  git remote set-url origin "%REPO%"
)
if errorlevel 1 goto :GITERROR

echo [3 de 6] Buscando archivos nuevos y fotos...
git add -A
if errorlevel 1 goto :GITERROR

echo [4 de 6] Revisando cambios...
git diff --cached --quiet
if not errorlevel 1 goto :SIN_CAMBIOS

echo [5 de 6] Guardando la actualizacion...
REM Si Git no tiene nombre/correo configurado, pide los datos una sola vez.
git config user.name >nul 2>&1
if errorlevel 1 (
  echo.
  echo Git necesita saber tu nombre para registrar el cambio.
  set /p NOMBRE=Escribe tu nombre: 
  if "%NOMBRE%"=="" set "NOMBRE=PixelLabs Admin"
  git config user.name "%NOMBRE%"
)
git config user.email >nul 2>&1
if errorlevel 1 (
  set /p CORREO=Escribe tu correo de GitHub: 
  if "%CORREO%"=="" set "CORREO=pixellabst-admin@users.noreply.github.com"
  git config user.email "%CORREO%"
)

git commit -m "%MENSAJE%"
if errorlevel 1 goto :GITERROR

echo [6 de 6] Subiendo todo a GitHub...
git branch -M main
git push -u origin main --force
if errorlevel 1 goto :PUSHERROR

goto :EXITO

:SIN_CAMBIOS
echo.
echo ============================================================
echo                   NO HAY CAMBIOS NUEVOS
echo ============================================================
echo.
echo Esta carpeta ya contiene exactamente los mismos archivos que
 echo el ultimo commit local. Si esperabas cambios, asegurate de:
echo.
echo - Descomprimir el ZIP nuevo en una carpeta nueva.
echo - Ejecutar ESTE archivo desde esa carpeta nueva.
echo - No ejecutar el .bat desde la carpeta Downloads o desde images.
echo.
pause
exit /b 0

:EXITO
echo.
echo ============================================================
echo            LISTO - ARCHIVOS SUBIDOS A GITHUB
echo ============================================================
echo.
echo GitHub: https://github.com/pixellabst-admin/pixellabst
echo.
echo Ahora Vercel detectara los cambios automaticamente.
echo 1. Entra a Vercel -^> tu proyecto -^> Deployments.
echo 2. Espera a que el nuevo deployment diga READY.
echo 3. Abre: https://pixellabst.vercel.app
echo.
echo Si acabas de corregir estilos o fotos, en Vercel usa Redeploy
echo y DESMARCA la opcion Use existing Build Cache.
echo.
start "" "https://github.com/pixellabst-admin/pixellabst"
pause
exit /b 0

:GITERROR
echo.
echo ============================================================
echo                       ERROR DE GIT
echo ============================================================
echo.
echo No se pudo preparar los archivos. Toma una captura de esta
 echo ventana completa y compartela para revisar el mensaje.
echo.
pause
exit /b 1

:PUSHERROR
echo.
echo ============================================================
echo                    NO SE PUDO SUBIR A GITHUB
echo ============================================================
echo.
echo Si pide usuario, escribe: pixellabst-admin
echo Si pide Password, usa un Personal Access Token de GitHub,
echo no tu contrasena normal.
echo.
echo Para crear un token:
echo GitHub -^> Settings -^> Developer settings -^> Personal access tokens
 echo -^> Tokens classic -^> Generate new token -^> marca repo.
echo.
echo Toma una captura del error que aparece arriba si necesitas ayuda.
echo.
pause
exit /b 1
