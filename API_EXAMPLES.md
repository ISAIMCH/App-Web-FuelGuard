// ========== EJEMPLO DE PAYLOAD MQTT ==========
// Estos datos se envían desde el LilyGO vía MQTT al topic:
// itics/mgti/isai/sensor

// Formato esperado después de procesamiento en el servidor:
{
  "temperatura": 25.5,
  "humedad": 65.2,
  "presion": 1013.25,
  "lat_sim": 19.432655,
  "lon_sim": -99.133209,
  "gateway": "Tanque-01",
  "id": "heltec_sensor_01"
}

// ========== EJEMPLO DE DATOS HISTÓRICOS ALMACENADOS ==========
// La BD almacena:
{
  "id": 1,
  "timestamp": "2024-05-09 14:30:45",
  "temperatura": 25.5,
  "humedad": 65.2,
  "presion": 1013.25,
  "lat_sim": 19.432655,
  "lon_sim": -99.133209,
  "gateway": "Tanque-01",
  "payload": "{\"temperatura\":25.5,\"humedad\":65.2,...}"
}

// ========== RESPUESTA DEL ENDPOINT /api/datos ==========
// GET /api/datos (requiere JWT token)
// Retorna últimas 24 horas (máximo 100 registros)

[
  {
    "id": 150,
    "timestamp": "2024-05-09 14:35:20",
    "temperatura": 26.1,
    "humedad": 63.5,
    "presion": 1012.8,
    "lat_sim": 19.432660,
    "lon_sim": -99.133215,
    "gateway": "Tanque-01",
    "payload": "..."
  },
  {
    "id": 149,
    "timestamp": "2024-05-09 14:30:15",
    "temperatura": 25.8,
    "humedad": 64.2,
    "presion": 1012.9,
    "lat_sim": 19.432650,
    "lon_sim": -99.133205,
    "gateway": "Tanque-01",
    "payload": "..."
  }
]

// ========== ENDPOINTS DE LA API ==========

// 1. REGISTRO
POST /api/auth/register
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "contraseña123",
  "nombre": "Juan Pérez"
}

Response 201:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "email": "usuario@email.com",
    "nombre": "Juan Pérez"
  }
}

// 2. LOGIN
POST /api/auth/login
Content-Type: application/json

{
  "email": "usuario@email.com",
  "password": "contraseña123"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "usuario": {
    "id": 1,
    "email": "usuario@email.com",
    "nombre": "Juan Pérez"
  }
}

// 3. OBTENER DATOS ÚLTIMAS 24 HORAS
GET /api/datos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200: [array de sensores]

// 4. OBTENER DATOS HISTÓRICOS (7 DÍAS)
GET /api/datos/historicos
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200: [array de sensores históricos]

// 5. OBTENER ÚLTIMO DATO
GET /api/datos/ultimo
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200:
{
  "id": 150,
  "timestamp": "2024-05-09 14:35:20",
  "temperatura": 26.1,
  "humedad": 63.5,
  "presion": 1012.8,
  "lat_sim": 19.432660,
  "lon_sim": -99.133215,
  "gateway": "Tanque-01"
}

// 6. VERIFICAR TOKEN
POST /api/auth/verificar
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

Response 200:
{
  "valido": true,
  "usuario": {
    "id": 1,
    "email": "usuario@email.com"
  }
}
