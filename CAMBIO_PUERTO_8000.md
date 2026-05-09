# 🔧 CAMBIO DE PUERTO A 8000

## ✅ Lo que ya cambió

```
Puerto anterior: 3000
Puerto nuevo: 8000

Archivo .env:
  PORT=8000
  CORS_ORIGIN=http://34.145.56.208:8000

URL de acceso:
  http://34.145.56.208:8000
```

---

## 🌐 PASO 1: Abrir Puerto 8000 en Google Cloud

**IMPORTANTE:** Si no abres el puerto, no funcionará.

### Opción A: Desde Console Google Cloud (más fácil)

1. Ir a: https://console.cloud.google.com/
2. Menú → **VPC Network** → **Firewall rules**
3. Click: **Create Firewall Rule**
4. Configurar:
   ```
   Name: allow-sensorhub-8000
   Direction: Ingress (Entrante)
   Priority: 1000
   Action on match: Allow
   Match - Ingress
     Protocols: TCP
     Port: 8000
   
   Source IPv4 ranges: 0.0.0.0/0
   Target tags: (opcional, dejar en blanco)
   ```
5. Click: **Create**

✅ **Listo**

---

### Opción B: Desde Google Cloud SDK (terminal)

Si prefieres línea de comandos:

```bash
gcloud compute firewall-rules create allow-sensorhub-8000 \
  --allow=tcp:8000 \
  --source-ranges=0.0.0.0/0 \
  --target-tags=http-server
```

---

## 🚀 PASO 2: Reiniciar Servidor en Google Cloud

En tu SSH de Google Cloud:

```bash
# Si está corriendo con npm
pm2 stop sensorhub
pm2 delete sensorhub
pm2 start backend/server.js --name "sensorhub"

# o simplemente
pm2 restart sensorhub
```

---

## 🌍 PASO 3: Acceder a tu App

Abre navegador:

```
http://34.145.56.208:8000
```

✅ **Listo!**

---

## 📋 Checklist

- [ ] Firewall en Google Cloud abierto para puerto 8000
- [ ] Servidor reiniciado en Google Cloud
- [ ] Puedo acceder a http://34.145.56.208:8000
- [ ] Landing page visible
- [ ] Puedo registrarme
- [ ] Dashboard funciona

---

## 🔌 Si Grafana, InfluxDB, Node-RED necesitan compartir

### Configuración de puertos actual

```
SENSORHUB:  http://34.145.56.208:8000
GRAFANA:    http://34.145.56.208:3000
INFLUXDB:   http://34.145.56.208:8086
NODE-RED:   http://34.145.56.208:1880
```

Todo funciona sin conflictos ✓

---

## 💡 Cambiar a otro puerto en el futuro

Si 8000 también se ocupa, simplemente:

1. Editar en Google Cloud: `nano backend/.env`
2. Cambiar: `PORT=8001` (o el que prefieras)
3. Actualizar firewall con el nuevo puerto
4. Guardar y reiniciar

---

¿Necesitas ayuda con el firewall de Google Cloud? 🚀
