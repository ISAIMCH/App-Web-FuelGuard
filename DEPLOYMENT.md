# 🚀 Guía de Deployment a Producción

## Checklist Pre-Deployment

### 1. Seguridad
- [ ] Cambiar `JWT_SECRET` en `.env` con valor fuerte
- [ ] Verificar `CORS_ORIGIN` sea el dominio correcto
- [ ] Revisar que MQTT_BROKER es HiveMQ o broker propio seguro
- [ ] Usar HTTPS en producción (certificado SSL)
- [ ] Configurar variables de entorno en servidor (no en .env)

### 2. Base de Datos
- [ ] Backups automáticos configurados
- [ ] Path de BD en ubicación persistente
- [ ] Permisos de archivo correctos (600 para datos.db)
- [ ] Considerar migrar a PostgreSQL para mayor concurrencia

### 3. Performance
- [ ] Configurar reverse proxy (Nginx)
- [ ] Habilitar compresión Gzip
- [ ] CDN para archivos estáticos
- [ ] Cache headers optimizados

### 4. Monitoreo
- [ ] Logs centralizados
- [ ] Alertas por errores
- [ ] Métricas de rendimiento
- [ ] Health checks

---

## Opciones de Deployment

### Opción 1: Heroku (Más fácil)

```bash
# 1. Instalar Heroku CLI
npm install -g heroku

# 2. Login
heroku login

# 3. Crear app
heroku create tu-app-sensorhub

# 4. Configurar variables
heroku config:set JWT_SECRET=tu_valor_secreto
heroku config:set NODE_ENV=production

# 5. Deploy
git push heroku main

# 6. Ver logs
heroku logs --tail
```

**Ventajas:**
✅ Setup rápido
✅ SSL automático
✅ Escalado automático
❌ Costo: $7/mes mínimo
❌ SQLite no persistente (usar PostgreSQL add-on)

---

### Opción 2: AWS EC2 (Más control)

```bash
# 1. Crear instancia EC2 (Ubuntu 20.04, t3.micro)
# 2. Conectar por SSH

ssh -i "tu-key.pem" ec2-user@tu-instancia.aws

# 3. Instalar dependencias
sudo yum update
sudo yum install nodejs npm git

# 4. Clonar proyecto
git clone <tu-repo>
cd AplicacionWeb/backend

# 5. Instalar dependencias
npm install --production

# 6. Crear carpeta de datos
mkdir -p database

# 7. Configurar .env
nano .env
# (EDITOR: Añadir variables de entorno)

# 8. Usar PM2 para mantener proceso vivo
sudo npm install -g pm2
pm2 start server.js --name "sensorhub"
pm2 startup
pm2 save

# 9. Configurar Nginx como reverse proxy
sudo yum install nginx
sudo systemctl start nginx
```

**nginx.conf:**
```nginx
upstream sensorhub {
    server localhost:3000;
}

server {
    listen 80;
    server_name tu-dominio.com;

    location / {
        proxy_pass http://sensorhub;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

**Ventajas:**
✅ Control total
✅ Económico (~$5/mes)
✅ No hay restricciones
❌ Mantenimiento manual

---

### Opción 3: Docker (Recomendado)

```bash
# 1. Construir imagen
docker build -t sensorhub:latest .

# 2. Ejecutar contenedor
docker run -d \
  --name sensorhub \
  -p 3000:3000 \
  -e NODE_ENV=production \
  -e JWT_SECRET=tu_valor \
  -v sensorhub-db:/app/database \
  sensorhub:latest

# 3. Ver logs
docker logs -f sensorhub

# 4. Detener
docker stop sensorhub
```

**Dockerfile:**
```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copiar package
COPY package.json .

# Instalar dependencias
RUN npm install --production

# Copiar código
COPY . .

# Crear carpeta BD
RUN mkdir -p database

# Exponer puerto
EXPOSE 3000

# Comando
CMD ["npm", "start"]
```

**Ventajas:**
✅ Consistencia entre dev y prod
✅ Fácil scaling
✅ Compatible con orquestadores (K8s)

---

### Opción 4: DigitalOcean App Platform

```bash
# 1. Conectar GitHub/GitLab
# 2. En panel: Create → App
# 3. Seleccionar tu repositorio
# 4. Configurar:
   - Build: npm install
   - Run: npm start
   - Port: 3000
# 5. Añadir variables de entorno
# 6. Deploy

# Costo: ~$5/mes mínimo
```

---

### Opción 5: Railway.app (Más moderno)

```bash
# 1. Conectar GitHub
# 2. Crear nuevo proyecto
# 3. Seleccionar repo
# 4. Automáticamente detecta Node.js
# 5. Configurar variables (panel)
# 6. Deploy automático

# Ventajas:
# ✅ GitHub auto-deploy
# ✅ SSL automático
# ✅ Histórico de BD (PostgreSQL gratis)
# ❌ Prueba gratis limitada
```

---

## Configuración de Dominio

### 1. Obtener dominio
- GoDaddy
- Namecheap
- .com.mx en México

### 2. Apuntar DNS
Si usar Heroku:
```
CNAME: tu-app.herokuapp.com
```

Si usar AWS/DigitalOcean:
```
A Record: Tu-IP-Pública
```

### 3. SSL (HTTPS)
- Heroku: Automático
- Docker/EC2: Let's Encrypt (certbot)
  ```bash
  sudo certbot certonly --standalone -d tu-dominio.com
  ```

---

## Variables de Entorno en Producción

**NUNCA** incluir `.env` en git.

En servidor, configurar:
```bash
export NODE_ENV=production
export PORT=3000
export JWT_SECRET=tu_clave_ultrasecreta_aqui
export MQTT_BROKER=broker.hivemq.com
export MQTT_TOPIC=itics/mgti/isai/sensor
export DB_PATH=/var/data/sensorhub/datos.db
export CORS_ORIGIN=https://tu-dominio.com
```

---

## Backups de BD

### Script de respaldo automático
```bash
#!/bin/bash
# Guardar en crontab: 0 2 * * * /path/to/backup.sh

BACKUP_DIR="/backups/sensorhub"
DATE=$(date +"%Y%m%d_%H%M%S")
SOURCE="/app/database/datos.db"

mkdir -p $BACKUP_DIR
cp $SOURCE $BACKUP_DIR/datos_$DATE.db

# Comprimir
gzip $BACKUP_DIR/datos_$DATE.db

# Eliminar backups de hace 30 días
find $BACKUP_DIR -name "datos_*.gz" -mtime +30 -delete
```

---

## Monitoreo

### Alertas por correo (usando SendGrid)
```javascript
const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// En server.js
app.use((err, req, res, next) => {
  console.error(err);
  
  // Alertar por email si es error crítico
  if (err.status >= 500) {
    sgMail.send({
      to: 'admin@tu-dominio.com',
      from: 'alerts@tu-dominio.com',
      subject: '🚨 Error en SensorHub',
      text: err.message
    });
  }
  
  res.status(500).json({ error: 'Error del servidor' });
});
```

---

## Performance en Producción

### 1. Compresión
```bash
npm install compression
```

```javascript
const compression = require('compression');
app.use(compression());
```

### 2. Rate Limiting
```bash
npm install express-rate-limit
```

```javascript
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // limite 100 requests por ventana
});

app.use('/api/', limiter);
```

### 3. Caching
```javascript
app.use((req, res, next) => {
  res.set('Cache-Control', 'public, max-age=3600');
  next();
});
```

---

## Checklist Final

- [ ] Variables de entorno configuradas
- [ ] BD tiene suficiente espacio
- [ ] Backups automáticos funcionan
- [ ] Logs centralizados
- [ ] SSL/HTTPS activo
- [ ] Monitoreo de errores
- [ ] Rate limiting activado
- [ ] CORS restringido a tu dominio
- [ ] Test de login funcionando
- [ ] Test de MQTT funcionando
- [ ] Test de base de datos funcionando

---

## Troubleshooting en Producción

### Conexión rechazada
```
→ Verificar firewall
→ Verificar puerto abierto (3000 o 80)
→ npm start mostrar error
```

### MQTT no conecta
```
→ Verificar internet
→ Ping a broker.hivemq.com
→ Revisar logs: docker logs sensorhub
```

### Lento
```
→ Aumentar recursos (CPU/RAM)
→ Habilitar caching
→ Usar CDN para frontend
```

---

¡Listo para producción! 🚀
