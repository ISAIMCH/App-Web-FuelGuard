#!/bin/bash

# ========== SCRIPT PARA INICIAR SERVIDOR ==========
# Compatible con Linux/Mac/Git Bash

echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║   SensorHub - Iniciando Servidor                ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

# Ir a carpeta backend
cd backend

# Verificar si node_modules existe
if [ ! -d "node_modules" ]; then
    echo "[1/2] Instalando dependencias..."
    npm install
    echo "✓ Dependencias instaladas"
    echo ""
fi

echo "[2/2] Iniciando servidor en desarrollo..."
echo ""
echo "╔════════════════════════════════════════════════════╗"
echo "║   Servidor corriendo en http://localhost:8000    ║"
echo "║   Desde internet: http://34.145.56.208:8000      ║"
echo "║   Presiona Ctrl+C para detener                   ║"
echo "╚════════════════════════════════════════════════════╝"
echo ""

npm run dev
