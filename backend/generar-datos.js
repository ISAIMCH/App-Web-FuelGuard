#!/usr/bin/env node

/**
 * Script para generar datos de prueba en la BD
 * Útil para probar el dashboard sin esperar datos reales del LilyGO
 */

require('dotenv').config();
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || './database/datos.db';
const db = new sqlite3.Database(dbPath);

// Función para generar dato aleatorio
function generarDato() {
  const ahora = new Date();
  const hace = new Date(ahora - Math.random() * 24 * 60 * 60 * 1000);
  
  return {
    timestamp: hace.toISOString(),
    temperatura: 20 + Math.random() * 10,        // Entre 20-30°C
    humedad: 40 + Math.random() * 40,            // Entre 40-80%
    presion: 1010 + Math.random() * 10,          // Entre 1010-1020 hPa
    lat_sim: 19.4326 + (Math.random() - 0.5) * 0.01,
    lon_sim: -99.1332 + (Math.random() - 0.5) * 0.01,
    gateway: 'Tanque-01'
  };
}

console.log('📊 Generando datos de prueba...');

// Generar 100 datos de prueba
let count = 0;
for (let i = 0; i < 100; i++) {
  const dato = generarDato();
  
  db.run(`
    INSERT INTO sensores (timestamp, temperatura, humedad, presion, lat_sim, lon_sim, gateway, payload)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `, [
    dato.timestamp,
    dato.temperatura,
    dato.humedad,
    dato.presion,
    dato.lat_sim,
    dato.lon_sim,
    dato.gateway,
    JSON.stringify(dato)
  ], (err) => {
    if (err) console.error('Error:', err);
    count++;
    if (count === 100) {
      console.log('✓ 100 datos generados exitosamente');
      db.close();
    }
  });
}
