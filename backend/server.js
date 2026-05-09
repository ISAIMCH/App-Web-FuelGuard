require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const mqtt = require('mqtt');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

// ============================================
// INICIALIZACIÓN
// ============================================
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN || '*' }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../frontend')));

// ============================================
// BASE DE DATOS
// ============================================
const dbPath = process.env.DB_PATH || './database/datos.db';
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Error BD:', err);
  else console.log('✓ SQLite conectada');
});

// Crear tablas si no existen
db.serialize(() => {
  db.run(`
    CREATE TABLE IF NOT EXISTS usuarios (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nombre TEXT NOT NULL,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  db.run(`
    CREATE TABLE IF NOT EXISTS sensores (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      temperatura REAL,
      humedad REAL,
      presion REAL,
      lat_sim REAL,
      lon_sim REAL,
      gateway TEXT,
      payload TEXT
    )
  `);
});

// ============================================
// MQTT
// ============================================
const mqttClient = mqtt.connect(`mqtt://${process.env.MQTT_BROKER}:${process.env.MQTT_PORT}`, {
  clientId: process.env.MQTT_CLIENT_ID || 'web-dashboard'
});

mqttClient.on('connect', () => {
  console.log('✓ MQTT conectado');
  mqttClient.subscribe(process.env.MQTT_TOPIC);
});

mqttClient.on('message', (topic, message) => {
  try {
    const data = JSON.parse(message.toString());
    console.log('📨 Dato MQTT recibido:', data);
    
    // Guardar en BD
    db.run(`
      INSERT INTO sensores (temperatura, humedad, presion, lat_sim, lon_sim, gateway, payload)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `, [
      data.temperatura || null,
      data.humedad || null,
      data.presion || null,
      data.lat_sim || null,
      data.lon_sim || null,
      data.gateway || null,
      JSON.stringify(data)
    ], (err) => {
      if (err) console.error('Error al guardar:', err);
    });

    // Emitir a clientes conectados (Socket.io, aunque podemos usar polling por ahora)
  } catch (e) {
    console.error('Error parseando MQTT:', e);
  }
});

mqttClient.on('error', (err) => {
  console.error('Error MQTT:', err);
});

// ============================================
// FUNCIONES AUXILIARES
// ============================================

// Generar JWT
function generarToken(usuario) {
  return jwt.sign(
    { id: usuario.id, email: usuario.email },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '7d' }
  );
}

// Middleware de verificación JWT
function verificarToken(req, res, next) {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido' });
  }
}

// ============================================
// RUTAS DE AUTENTICACIÓN
// ============================================

// Registro
app.post('/api/auth/register', async (req, res) => {
  const { email, password, nombre } = req.body;

  if (!email || !password || !nombre) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO usuarios (email, password, nombre) VALUES (?, ?, ?)',
      [email, hashedPassword, nombre],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE constraint failed')) {
            return res.status(400).json({ error: 'El email ya está registrado' });
          }
          return res.status(500).json({ error: 'Error al registrar' });
        }

        const usuario = { id: this.lastID, email, nombre };
        const token = generarToken(usuario);
        res.status(201).json({ token, usuario });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Error en servidor' });
  }
});

// Login
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña requeridos' });
  }

  db.get('SELECT * FROM usuarios WHERE email = ?', [email], async (err, usuario) => {
    if (err || !usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValida = await bcrypt.compare(password, usuario.password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario);
    res.json({ 
      token, 
      usuario: { id: usuario.id, email: usuario.email, nombre: usuario.nombre } 
    });
  });
});

// ============================================
// RUTAS DEL DASHBOARD
// ============================================

// Obtener datos recientes (últimas 24 horas)
app.get('/api/datos', verificarToken, (req, res) => {
  const hace24h = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  db.all(
    `SELECT * FROM sensores WHERE timestamp > ? ORDER BY timestamp DESC LIMIT 100`,
    [hace24h],
    (err, datos) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener datos' });
      }
      res.json(datos);
    }
  );
});

// Obtener datos históricos (últimos 7 días)
app.get('/api/datos/historicos', verificarToken, (req, res) => {
  const hace7d = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString();

  db.all(
    `SELECT * FROM sensores WHERE timestamp > ? ORDER BY timestamp ASC`,
    [hace7d],
    (err, datos) => {
      if (err) {
        return res.status(500).json({ error: 'Error al obtener datos históricos' });
      }
      res.json(datos);
    }
  );
});

// Obtener último dato (para resumen)
app.get('/api/datos/ultimo', verificarToken, (req, res) => {
  db.get(
    `SELECT * FROM sensores ORDER BY timestamp DESC LIMIT 1`,
    (err, dato) => {
      if (err) {
        return res.status(500).json({ error: 'Error' });
      }
      res.json(dato || {});
    }
  );
});

// Verificar token (para refresh)
app.post('/api/auth/verificar', verificarToken, (req, res) => {
  res.json({ valido: true, usuario: req.usuario });
});

// ============================================
// RUTAS ESTÁTICAS
// ============================================
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

// ============================================
// INICIO DEL SERVIDOR
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Servidor escuchando en puerto ${PORT}`);
  console.log(`📊 Dashboard Local: http://localhost:${PORT}`);
  console.log(`🌐 Accesible desde Internet: http://34.145.56.208:${PORT}`);
});
