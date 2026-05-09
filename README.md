# SensorHub - Dashboard IoT en Tiempo Real

Aplicación web profesional para monitoreo en tiempo real de sensores IoT conectados vía MQTT. Consta de una landing page informativa y un dashboard autenticado con gráficos dinámicos.

## 📋 Características

- **Landing Page**: Presentación profesional del producto con especificaciones técnicas
- **Autenticación**: Sistema de login/registro seguro con JWT
- **Dashboard en Tiempo Real**: Visualización de datos instantánea desde sensores
- **Gráficos Dinámicos**: Charts.js para análisis visual
- **Histórico**: Análisis de últimos 7 días
- **GPS Integration**: Rastreo de ubicación del dispositivo SIM7070
- **Responsive**: Compatible con móvil, tablet y desktop

## 🚀 Instalación

### Prerequisites
- Node.js 14+ 
- npm o yarn
- Acceso a internet (para conectarse con broker MQTT)

### 1. Instalar dependencias del backend

```bash
cd backend
npm install
```

### 2. Configurar variables de entorno

Editar `.env`:
```env
PORT=3000
JWT_SECRET=tu_clave_secreta_super_segura
MQTT_BROKER=broker.hivemq.com
MQTT_TOPIC=itics/mgti/isai/sensor
```

### 3. Iniciar servidor

```bash
# Desarrollo con auto-reload
npm run dev

# Producción
npm start
```

El servidor estará disponible en: `http://localhost:3000`

## 📦 Estructura del Proyecto

```
AplicacionWeb/
├── backend/
│   ├── server.js              # Servidor Node.js + Express
│   ├── package.json           # Dependencias
│   └── .env                   # Variables de entorno
│
└── frontend/
    ├── index.html             # Landing page
    ├── login.html             # Página de autenticación
    ├── dashboard.html         # Dashboard principal
    ├── css/
    │   ├── styles.css         # Landing page styles
    │   ├── auth.css           # Auth page styles
    │   └── dashboard.css      # Dashboard styles
    └── js/
        ├── auth.js            # Lógica de autenticación
        └── dashboard.js       # Lógica del dashboard
```

## 🔌 Configuración MQTT

El servidor está configurado para escuchar en:
- **Broker**: broker.hivemq.com
- **Puerto**: 1883
- **Topic**: `itics/mgti/isai/sensor`

Los datos esperados en JSON:
```json
{
  "temperatura": 25.5,
  "humedad": 65.2,
  "presion": 1013.25,
  "lat_sim": 19.4326,
  "lon_sim": -99.1332,
  "gateway": "Tanque-01",
  "id": "sensor_1"
}
```

## 🛰️ Dispositivo LilyGO

El código del dispositivo está configurado para:
1. Conectar vía 4G/LTE usando SIM7070
2. Recibir datos de sensores vía ESP-NOW
3. Obtener coordenadas GPS
4. Publicar en MQTT con buffer local

### Configuración del dispositivo

El código espera:
```
- APN: web.iusacellgsm.mx
- Usuario GPRS: iusacellgsm
- Contraseña: iusacellgsm
```

## 👥 Uso

### 1. Acceso a Landing Page
```
http://localhost:3000/
```

### 2. Registro de Usuario
- Click en "Comenzar Ahora"
- Rellenar formulario de registro
- Se autenticará automáticamente

### 3. Acceso al Dashboard
- Disponible en: `http://localhost:3000/dashboard.html`
- Requiere estar autenticado

### 4. Secciones del Dashboard

#### Resumen
- Últimas lecturas de sensores
- Gráfico del último día

#### Tiempo Real
- Tabla actualizada cada 5 segundos
- Datos más recientes primero
- Toggle para auto-actualización

#### Histórico
- Gráficos de últimos 7 días
- Estadísticas (mín, máx, promedio)

#### Mapa
- Coordenadas GPS actuales
- Precisión del dispositivo

## 🔐 Seguridad

- **JWT**: Autenticación sin estado
- **bcryptjs**: Encriptación de contraseñas
- **CORS**: Validación de origen
- **Helmet**: Headers de seguridad HTTP

## 📊 Base de Datos

SQLite con 2 tablas:

### usuarios
```sql
- id (PK)
- email (UNIQUE)
- password (hash)
- nombre
- createdAt
```

### sensores
```sql
- id (PK)
- timestamp
- temperatura
- humedad
- presion
- lat_sim
- lon_sim
- gateway
- payload (JSON)
```

## 🎯 Próximas Mejoras

- [ ] Exportar datos a CSV/Excel
- [ ] Notificaciones por email
- [ ] Umbrales de alerta
- [ ] WebSocket para actualización real-time
- [ ] Integración con Google Maps
- [ ] Cálculo de consumo energético
- [ ] API para terceros

## 🐛 Troubleshooting

### No conecta a MQTT
- Verificar conexión a internet
- Confirmar broker: broker.hivemq.com:1883
- Revisar topic en .env

### Gráficos vacíos
- Verificar que llegan datos del dispositivo
- Revisar consola del navegador (F12)
- Confirmar autenticación

### Error 401 Unauthorized
- Token expirado: limpiar localStorage
- Click en "Cerrar Sesión" y volver a entrar

## 📝 Licencia

ISC

## 👨‍💻 Autor

Creado para monitoreo IoT profesional

---

**Nota**: Para producción, cambiar `JWT_SECRET` y usar variables de entorno seguras.
