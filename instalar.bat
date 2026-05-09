@echo off
REM ========== SCRIPT INSTALACIÓN RÁPIDA ==========
REM Este script instala todas las dependencias automáticamente

echo.
echo ╔════════════════════════════════════════════════════╗
echo ║     SensorHub - Instalación Rápida              ║
echo ╚════════════════════════════════════════════════════╝
echo.

echo [1/3] Entrando a carpeta backend...
cd backend
echo ✓ OK

echo.
echo [2/3] Instalando dependencias...
call npm install
if %errorlevel% equ 0 (
    echo ✓ Dependencias instaladas
) else (
    echo ✗ Error en instalación
    pause
    exit /b 1
)

echo.
echo [3/3] ¡Listo para iniciar!
echo.
echo ╔════════════════════════════════════════════════════╗
echo ║   Para iniciar el servidor ejecuta:            ║
echo ║                                                  ║
echo ║   npm run dev                                   ║
echo ║                                                  ║
echo ║   Luego abre:                                   ║
echo ║   http://localhost:3000                         ║
echo ╚════════════════════════════════════════════════════╝
echo.

pause
