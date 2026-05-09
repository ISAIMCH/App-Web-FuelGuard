# 🌍 Hacer tu App Accesible desde Internet

Tienes varias opciones. La **máquina virtual es perfecta** si es accesible desde internet.

---

## ✅ OPCIÓN 1: Usar tu Máquina Virtual (RECOMENDADO)

### Paso 1: Verificar IP de la Máquina Virtual

En la VM, abre terminal y ejecuta:

**Windows:**
```powershell
ipconfig
```
Busca: `IPv4 Address` (algo como `192.168.x.x` o `10.x.x.x`)

**Linux:**
```bash
hostname -I
# o
ip addr show
```

### Paso 2: Verificar que sea accesible desde el exterior

**Si la VM está en tu red local:**
```
Tu IP es: 192.168.1.100 (ejemplo)
Desde internet NO funciona
→ Ver: OPCIÓN 1B (Port Forwarding)
```

**Si la VM tiene IP pública o es en cloud:**
```
Tu IP es: 203.0.113.45 (ejemplo)
Desde internet SÍ funciona ✓
→ Continúa al Paso 3
```

### Paso 3: Configurar servidor para escuchar en red

Edita el archivo `backend/.env`:

```env
# CAMBIAR:
# De esto:
PORT=3000
CORS_ORIGIN=http://localhost:3000

# A esto:
PORT=80
CORS_ORIGIN=http://TU_IP_PUBLICA:80
```

O para escuchar en puerto 3000:
```env
PORT=3000
CORS_ORIGIN=http://TU_IP_PUBLICA:3000
```

### Paso 4: Modificar server.js (para escuchar en todas las interfaces)

En `backend/server.js`, cambiar la última línea de:

```javascript
app.listen(PORT, () => {
```

A:

```javascript
app.listen(PORT, '0.0.0.0', () => {
```

Esto hace que escuche en TODAS las interfaces de red (no solo localhost).

### Paso 5: Iniciar servidor

```bash
cd backend
npm install
npm start
```

### Paso 6: Acceder desde otra máquina

```
http://TU_IP_PUBLICA:3000
```

**Ejemplo:**
- Si tu VM tiene IP `192.168.1.100` en red local:
  ```
  http://192.168.1.100:3000
  ```

- Si tu VM tiene IP pública `203.0.113.45`:
  ```
  http://203.0.113.45:3000
  ```

---

### ⚠️ OPCIÓN 1B: Si la VM está en Red Local (Requiere Port Forwarding)

Si tu VM es local pero quieres acceder desde internet:

**1. Acceder al router:**
```
IP: 192.168.1.1 (o similar)
Usuario: admin
Contraseña: admin (o la que hayas configurado)
```

**2. Buscar sección "Port Forwarding" o "Virtual Server"**

**3. Configurar:**
```
Puerto Externo: 3000
Puerto Interno: 3000
IP Interna: 192.168.1.100 (tu VM)
Protocolo: TCP
Habilitar: Sí
```

**4. Obtener IP pública:**
```
Accede a: https://www.whatismyipaddress.com
Verás: 203.0.113.45 (ejemplo)
```

**5. Acceder desde internet:**
```
http://203.0.113.45:3000
```

---

## 🚀 OPCIÓN 2: Ngrok (MÁS FÁCIL - Temporal)

Perfecto para pruebas rápidas sin configuración.

### Paso 1: Descargar Ngrok
```
https://ngrok.com/download
```

Descomprime el archivo.

### Paso 2: Copiar ngrok a proyecto (opcional)
```bash
# En Windows, copiar ngrok.exe a raíz del proyecto
cp C:\Path\a\ngrok.exe .
```

### Paso 3: Asegurarse que el servidor corre en localhost

En `backend/.env`:
```env
PORT=3000
```

Iniciar servidor:
```bash
cd backend
npm start
```

### Paso 4: En otra terminal, exponer con Ngrok

```bash
# Windows/Mac/Linux
ngrok http 3000
```

**Verás algo como:**
```
Session Status                online
Account                       FreeTier
Version                       3.0.5
Region                        United States (us)
Latency                       45ms
Web Interface                 http://127.0.0.1:4040
Forwarding                    https://abc123def456-us.ngrok.io -> http://localhost:3000
```

### Paso 5: Acceder desde cualquier lado

```
https://abc123def456-us.ngrok.io
```

**¡Listo!** Funciona desde cualquier dispositivo en internet.

### Ventajas:
✅ Rápido
✅ Sin configuración
✅ Funciona desde cualquier lado
✅ Gratis

### Desventajas:
❌ URL cambia cada vez
❌ Requiere ngrok corriendo
❌ Límite de velocidad en plan gratuito
❌ Temporal

---

## ☁️ OPCIÓN 3: Usar un Servicio Cloud

Si quieres algo permanente:

### Railway.app (Más fácil)
```
1. Registrarse en railway.app
2. Conectar GitHub
3. Deploy automático
4. Tu URL: https://nombre-app-random.railway.app
```

### Heroku (Clásico)
```
1. Registrarse en heroku.com
2. Instalar Heroku CLI
3. Ejecutar: heroku create
4. Tu URL: https://tu-app.herokuapp.com
```

### DigitalOcean (Más control)
```
1. Crear Droplet (VPS $5/mes)
2. SSH al servidor
3. Instalar Node.js
4. Clonar repo
5. npm start
```

---

## 📋 COMPARATIVA DE OPCIONES

| Opción | Ventaja | Desventaja | Costo | Setup |
|--------|---------|-----------|-------|-------|
| **Máquina Virtual Local** | Control total | Requiere port forwarding | $0 | Medio |
| **Ngrok** | Rápido | Temporal, URL cambia | Gratis* | Fácil |
| **Railway** | Muy fácil | Menos control | $5/mes | 5 min |
| **DigitalOcean** | Barato + Control | Requiere configuración | $5/mes | 20 min |
| **AWS EC2** | Potente | Complejo | $3-20/mes | 30 min |

---

## 🎯 MI RECOMENDACIÓN

**Para empezar ahora:**
→ **Ngrok** (2 minutos, sin configuración)

**Para desarrollo continuo:**
→ **Máquina Virtual + Port Forwarding** (10 minutos)

**Para producción:**
→ **Railway o DigitalOcean** (muy fácil ambos)

---

## 📝 PASOS RÁPIDOS (Tu Máquina Virtual)

### Si está en red local:

```bash
# 1. Obtener IP de VM
ipconfig  # Windows
# o
hostname -I  # Linux

# 2. Configurar port forwarding en router
# (Ver OPCIÓN 1B arriba)

# 3. Editar .env
CORS_ORIGIN=http://TU_IP_PUBLICA:3000

# 4. Editar server.js
app.listen(3000, '0.0.0.0', () => { ... })

# 5. Iniciar
npm start

# 6. Acceder
http://TU_IP_EXTERNA:3000
```

### Si está en la nube (AWS, Azure, etc):

```bash
# 1. IP ya es pública ✓

# 2. Solo cambiar .env y server.js (pasos 3-4 arriba)

# 3. Iniciar
npm start

# 4. Acceder
http://TU_IP_PUBLICA:3000
```

---

## 🔒 IMPORTANTE: Seguridad

Cuando esté en internet:

1. **Cambiar JWT_SECRET** en `.env`:
   ```env
   JWT_SECRET=algo_muy_seguro_y_aleatorio
   ```

2. **Cambiar CORS_ORIGIN** a tu dominio:
   ```env
   CORS_ORIGIN=https://tu-dominio.com
   ```

3. **Usar HTTPS** (no HTTP):
   - Ngrok: Automático
   - Cloud: Let's Encrypt (gratis)
   - VM local: Necesita certificado

4. **Firewall**: Solo abrir puerto necesario (3000)

---

## ✅ CHECKLIST

- [ ] IP de VM identificada
- [ ] Verificar si es accesible desde internet
- [ ] .env actualizado con IP/dominio
- [ ] server.js escucha en 0.0.0.0
- [ ] Puerto abierto/forwardeado
- [ ] Servidor corriendo
- [ ] Acceso desde otra máquina probado
- [ ] JWT_SECRET cambió de valor

---

¿Cuál es tu situación exacta?

**A)** VM en red local (192.168.x.x)
**B)** VM en cloud (IP pública)
**C)** Quiero usar Ngrok temporalmente

Dame la respuesta para configurar exactamente según tu caso. 🚀
