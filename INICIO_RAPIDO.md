# 🚀 Guía de Inicio Rápido - SensorHub

## 1. Instalación Rápida (5 minutos)

### Paso 1: Instalar dependencias
```powershell
cd backend
npm install
```

### Paso 2: Generar estructura de BD
```powershell
# La BD se crea automáticamente al iniciar el servidor
# Pero puedes pre-popular datos de prueba:
node generar-datos.js
```

### Paso 3: Iniciar servidor
```powershell
npm run dev
```

**✓ Servidor activo en: http://localhost:3000**

---

## 2. Prueba el Sistema (10 minutos)

### Acceder a Landing Page
```
http://localhost:3000/
```
- Verás presentación profesional del producto
- Especificaciones técnicas
- Casos de uso

### Crear Cuenta
```
1. Click en "Comenzar Ahora" o "Registrarse Ahora"
2. Rellenar formulario:
   - Nombre: Tu nombre
   - Email: test@example.com
   - Contraseña: demo123456
3. Click en "Crear Cuenta"
```

### Acceder al Dashboard
```
http://localhost:3000/dashboard.html
```

**Verás:**
- 4 cards con datos en tiempo real
- Tabla de últimos datos
- Gráficos históricos (si generaste datos de prueba)

---

## 3. Probar Secciones del Dashboard

### 📋 Resumen
- Últimas lecturas: Temperatura, Humedad, Presión
- Gráfico del último día
- Estado de conexión MQTT

### ⚡ Tiempo Real
- Tabla actualizada cada 5 segundos
- Toggle para auto-actualización
- Últimos 100 registros

### 📈 Histórico
- Gráficos de últimos 7 días
- Estadísticas: Mín, Máx, Promedio
- 3 gráficos interactivos

### 🗺️ Mapa
- Coordenadas GPS actuales del dispositivo
- Precisión del SIM7070

---

## 4. Conectar Dispositivo LilyGO

### Configurar el LilyGO

1. **Subir código** al dispositivo (el código que proporcionaste)

2. **Verificar configuración en código:**
   ```cpp
   const char* broker = "broker.hivemq.com";
   const char* topicPublish = "itics/mgti/isai/sensor";
   const char apn[] = "web.iusacellgsm.mx";
   ```

3. **Datos esperados en JSON:**
   ```json
   {
     "temperatura": 25.5,
     "humedad": 65.2,
     "presion": 1013.25
   }
   ```

4. **Verificar conexión:**
   - LED en el dispositivo debe encenderse al publicar
   - Abre consola: `http://localhost:3000/dashboard.html`
   - Verás datos llegando en tiempo real

---

## 5. Acceso Demo (sin hardware)

Si no tienes el LilyGO aún:

```bash
# Generar 100 datos de prueba
cd backend
node generar-datos.js

# Reiniciar servidor
npm run dev
```

Ahora el dashboard mostrará datos históricos completos ✓

---

## 6. Troubleshooting

### ❌ "Conexión rechazada"
```
→ Verificar que servidor esté corriendo
→ npm run dev
→ Acceder a http://localhost:3000
```

### ❌ "Sin datos en gráficos"
```
→ Generar datos de prueba: node generar-datos.js
→ O esperar a que lleguen datos del LilyGO
→ Comprobar consola del navegador (F12)
```

### ❌ "Token expirado"
```
→ Cerrar sesión
→ Limpiar localStorage (F12 → Application → Storage)
→ Volver a iniciar sesión
```

### ❌ "MQTT no conecta"
```
→ Verificar conexión a internet
→ Broker por defecto: broker.hivemq.com:1883
→ Revisar firewall/puerto 1883
```

---

## 7. Estructura de Archivos Importantes

```
backend/
├── server.js          ← Lógica principal (MQTT, BD, API)
├── package.json       ← Dependencias
├── .env               ← Configuración
└── generar-datos.js   ← Script de prueba

frontend/
├── index.html         ← Landing page
├── login.html         ← Autenticación
├── dashboard.html     ← Panel principal
├── css/
│   ├── styles.css
│   ├── auth.css
│   └── dashboard.css
└── js/
    ├── auth.js
    └── dashboard.js
```

---

## 8. Variables de Entorno (.env)

```env
PORT=3000                                    # Puerto del servidor
JWT_SECRET=tu_clave_secreta               # Para autenticación
MQTT_BROKER=broker.hivemq.com             # Broker MQTT
MQTT_TOPIC=itics/mgti/isai/sensor         # Topic a escuchar
DB_PATH=./database/datos.db               # Base de datos
```

**⚠️ IMPORTANTE:** Cambiar `JWT_SECRET` antes de producción

---

## 9. Comandos Útiles

```bash
# Instalar dependencias
npm install

# Modo desarrollo (auto-reload)
npm run dev

# Modo producción
npm start

# Generar datos de prueba
node generar-datos.js

# Ver logs del servidor
npm run dev 2>&1 | tee server.log
```

---

## 10. Próximos Pasos

- [ ] Conectar LilyGO y verificar llegada de datos
- [ ] Customizar tema (colores, logos)
- [ ] Agregar notificaciones por email
- [ ] Configurar alertas por temperatura
- [ ] Deploy a producción (Heroku, AWS, Vercel)
- [ ] Agregar histórico de más de 7 días
- [ ] Integrar Google Maps

---

## 📞 Soporte

**Documentación completa:** Ver `README.md`
**Ejemplos de API:** Ver `API_EXAMPLES.md`

---

¡Listo! Ahora tienes un sistema de monitoreo profesional funcionando. 🎉
