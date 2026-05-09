# 🌐 Guía Google Cloud - SensorHub

Tu aplicación ya está configurada para funcionar en Google Cloud.

## ✅ Configuración Completada

```
IP Pública: 34.145.56.208
Puerto: 8000
URL: http://34.145.56.208:8000
```

---

## 🔧 PASO 1: Configurar Firewall en Google Cloud

**Esto es MUY IMPORTANTE** para que sea accesible desde internet.

### 1.1 Abrir consola de Google Cloud

Ir a: https://console.cloud.google.com/

### 1.2 Navegar a Firewall

Menú → VPC Network → Firewall rules

### 1.3 Crear regla entrante

Click en: **Create Firewall Rule**

Configurar:
```
Name: allow-sensorhub
Direction: Ingress (Entrante)
Priority: 1000
Action on match: Allow
Protocols: TCP
Port: 8000

Source IPv4 ranges:
0.0.0.0/0  (acceso desde cualquier lado)

Target tags: (dejar en blanco o poner "http-server")
```

Click: **Create**

### ✅ Listo - Puertos abiertos

---

## 🚀 PASO 2: Instalar y Ejecutar en Google Cloud

### 2.1 Conectar a tu VM por SSH

En Google Cloud Console:
```
Compute Engine → Instances → Tu instancia
Click en: SSH in browser
```

O por terminal local:
```bash
gcloud compute ssh tu-instancia-name --zone=us-central1-a
```

### 2.2 Instalar Node.js (si no lo tienes)

```bash
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs npm
```

Verificar:
```bash
node --version
npm --version
```

### 2.3 Descargar tu proyecto

**Opción A: Clonar de GitHub** (RECOMENDADO)
```bash
git clone https://github.com/tu-usuario/tu-repo.git
cd AplicacionWeb/backend
```

**Opción B: Subir archivos manualmente**
```bash
# Desde tu máquina local
gcloud compute scp --recurse ./backend/* tu-instancia:~/backend --zone=us-central1-a
```

### 2.4 Instalar dependencias

```bash
cd backend
npm install --production
```

### 2.5 Crear carpeta de base de datos

```bash
mkdir -p database
```

---

## ⚙️ PASO 3: Configurar Variables de Entorno

El `.env` ya está configurado, pero VERIFICA en Google Cloud:

```bash
cat .env
```

Debe mostrar:
```
PORT=3000
NODE_ENV=production
CORS_ORIGIN=http://34.145.56.208:3000
```

Si necesitas editar:
```bash
nano .env
```

---

## 🎯 PASO 4: Iniciar Servidor

### Opción A: Ejecutar directo (para pruebas)
```bash
npm start
```

Verás:
```
🚀 Servidor escuchando en puerto 3000
🌐 Accesible desde: http://34.145.56.208:3000
```

### Opción B: Con PM2 (Para producción - RECOMENDADO)

Instalar PM2:
```bash
sudo npm install -g pm2
```

Iniciar servidor:
```bash
pm2 start server.js --name "sensorhub"
```

Hacer que inicie automáticamente:
```bash
pm2 startup
pm2 save
```

Ver estado:
```bash
pm2 status
pm2 logs sensorhub
```

---

## 🌍 PASO 5: Acceder desde Internet

Abre en tu navegador:

```
http://34.145.56.208:8000
```

Deberías ver:
✅ Landing page con SensorHub
✅ Botón "Acceso"
✅ Puedes registrarte y entrar al dashboard

---

## 📊 PASO 6: Verificar Dashboard

Una vez logueado:
1. Sección Resumen - Verás datos (vacíos si no hay sensor conectado aún)
2. Sección Tiempo Real - Tabla de datos
3. Sección Histórico - Gráficos
4. Sección Mapa - Coordenadas GPS

---

## 🔌 PASO 7: Conectar Dispositivo LilyGO

Una vez que tu LilyGO envíe datos al broker MQTT:

```
MQTT Topic: itics/mgti/isai/sensor
Broker: broker.hivemq.com
```

Los datos **automáticamente**:
1. Llegan al servidor
2. Se guardan en base de datos
3. Se muestran en el dashboard en tiempo real

---

## 🔒 SEGURIDAD

⚠️ **IMPORTANTE para Producción:**

1. **Cambiar JWT_SECRET**:
```bash
# Editar .env
nano .env
```

Reemplazar:
```
JWT_SECRET=tu_clave_secreta_super_segura_cambiar_en_produccion_google_cloud
```

Con algo como:
```
JWT_SECRET=aBcD1234efGH5678ijKL9012mnOP3456qrST7890uvWX
```

2. **Usar HTTPS**:
```bash
# Instalar certbot
sudo apt-get install certbot python3-certbot-apache

# Generar certificado (necesitas dominio)
sudo certbot certonly --standalone -d tu-dominio.com
```

3. **Firewall restrictivo**:
En lugar de `0.0.0.0/0`, especificar IPs si es posible.

---

## 🛠️ TROUBLESHOOTING

### ❌ "No puedo conectar a http://34.145.56.208:8000"

```
✓ Verificar firewall en Google Cloud
✓ Verificar que puerto 8000 esté abierto
✓ Verificar que servidor esté corriendo: pm2 status
✓ Ver logs: pm2 logs sensorhub
```

### ❌ "Error: EADDRINUSE port 8000"

```
Puerto ya está en uso. Soluciones:

# Opción 1: Cambiar puerto en .env
PORT=8001

# Opción 2: Liberar puerto
sudo fuser -k 8000/tcp
```

### ❌ "MQTT no conecta"

```
✓ Verificar internet en VM
✓ Ping a broker: ping broker.hivemq.com
✓ Ver logs: pm2 logs sensorhub
```

### ❌ "Base de datos vacía"

```
✓ Normal si no hay datos del LilyGO aún
✓ Generar datos de prueba:
   node generar-datos.js
```

---

## 📈 Monitoreo Continuo

Ver logs en tiempo real:
```bash
pm2 logs sensorhub --lines 50
```

Ver recursos usados:
```bash
pm2 monit
```

Reiniciar servidor:
```bash
pm2 restart sensorhub
```

Detener servidor:
```bash
pm2 stop sensorhub
```

---

## 📞 Conectividad

### Desde tu computadora local:
```
http://34.145.56.208:3000
```

### Desde celular (misma red o internet):
```
http://34.145.56.208:3000
```

### Desde otra ubicación:
```
http://34.145.56.208:3000
```

✅ **Funciona desde cualquier lado con internet**

---

## 🎓 Comandos Útiles

```bash
# Ver IP pública de tu VM
curl ifconfig.me

# Ver procesos
pm2 list

# Ver logs del servidor
tail -f database/datos.db  # Ver BD

# Ver puerto 3000 abierto
sudo netstat -tlnp | grep 3000

# SSH a VM
gcloud compute ssh tu-instancia --zone=us-central1-a
```

---

## ✅ CHECKLIST FINAL

- [ ] Firewall abierto en puerto 3000
- [ ] Node.js instalado en VM
- [ ] Proyecto descargado/subido
- [ ] npm install ejecutado
- [ ] .env configurado
- [ ] Servidor corriendo (pm2 start)
- [ ] Acceso desde http://34.145.56.208:3000 ✓
- [ ] Puedo registrar usuario ✓
- [ ] Dashboard visible y funcional ✓

---

¡Listo! Tu aplicación está accesible desde internet. 🚀

Ahora puedes:
1. Compartir URL con otros: `http://34.145.56.208:3000`
2. Conectar LilyGO para recibir datos
3. Monitorear desde cualquier dispositivo

Si necesitas ayuda, revisa los logs: `pm2 logs sensorhub`
