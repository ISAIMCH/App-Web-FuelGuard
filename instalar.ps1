# ========== SCRIPT INSTALACIÓN RÁPIDA POWERSHELL ==========
# Este script instala todas las dependencias automáticamente

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Cyan
Write-Host "║     SensorHub - Instalación Rápida              ║" -ForegroundColor Cyan
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Cyan
Write-Host ""

Write-Host "[1/3] Entrando a carpeta backend..." -ForegroundColor Yellow
Set-Location -Path "backend"
Write-Host "✓ OK" -ForegroundColor Green

Write-Host ""
Write-Host "[2/3] Instalando dependencias..." -ForegroundColor Yellow
& npm install
if ($LASTEXITCODE -eq 0) {
    Write-Host "✓ Dependencias instaladas" -ForegroundColor Green
} else {
    Write-Host "✗ Error en instalación" -ForegroundColor Red
    Read-Host "Presiona Enter para salir"
    exit 1
}

Write-Host ""
Write-Host "╔════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║   ✓ ¡Instalación Completada!                     ║" -ForegroundColor Green
Write-Host "╚════════════════════════════════════════════════════╝" -ForegroundColor Green
Write-Host ""

Write-Host "Para iniciar el servidor:" -ForegroundColor Cyan
Write-Host "  npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Luego abre en el navegador:" -ForegroundColor Cyan
Write-Host "  http://localhost:3000" -ForegroundColor White
Write-Host ""

Read-Host "Presiona Enter para terminar"
