#!/bin/bash

# ========== SCRIPT DE INSTALACIÓN Y INICIO PARA GOOGLE CLOUD ==========
# Ejecuta todo automáticamente: instala Node.js, dependencias e inicia servidor

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   SensorHub - Instalación Google Cloud Automática      ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# ============================================================
# 1. INSTALAR NODE.JS (si no lo tiene)
# ============================================================
echo "[1/5] Verificando Node.js..."

if ! command -v node &> /dev/null; then
    echo "   ⚙️  Instalando Node.js 18..."
    curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
    sudo apt-get install -y nodejs npm
    echo "   ✓ Node.js instalado"
else
    echo "   ✓ Node.js ya está instalado"
    node --version
fi

echo ""
echo "[2/5] Instalando PM2 (para ejecutar en background)..."
sudo npm install -g pm2 > /dev/null 2>&1
echo "   ✓ PM2 instalado"

# ============================================================
# 2. INSTALAR DEPENDENCIAS
# ============================================================
echo ""
echo "[3/5] Instalando dependencias del proyecto..."

if [ -f "backend/package.json" ]; then
    cd backend
    npm install --production
    echo "   ✓ Dependencias instaladas"
else
    echo "   ✗ Error: No se encontró package.json"
    echo "   Asegúrate de estar en la raíz del proyecto"
    exit 1
fi

# ============================================================
# 3. CREAR CARPETA DE BD
# ============================================================
echo ""
echo "[4/5] Preparando base de datos..."
mkdir -p database
echo "   ✓ Carpeta de BD creada"

# ============================================================
# 4. INICIAR CON PM2
# ============================================================
echo ""
echo "[5/5] Iniciando servidor con PM2..."
pm2 start server.js --name "sensorhub"

# Guardar para que reinicie automáticamente
pm2 startup > /dev/null 2>&1
pm2 save > /dev/null 2>&1

echo ""
echo "╔═══════════════════════════════════════════════════════════╗"
echo "║   ✅ ¡INSTALACIÓN COMPLETADA!                          ║"
echo "╚═══════════════════════════════════════════════════════════╝"
echo ""

# Obtener IP pública
IP=$(curl -s ifconfig.me)

echo "🌍 Tu aplicación está accesible en:"
echo ""
echo "   🔗 http://$IP:3000"
echo ""
echo "📊 Status del servidor:"
pm2 status
echo ""
echo "📝 Ver logs en tiempo real:"
echo "   pm2 logs sensorhub"
echo ""
echo "🛑 Para detener:"
echo "   pm2 stop sensorhub"
echo ""
echo "🔄 Para reiniciar:"
echo "   pm2 restart sensorhub"
echo ""
