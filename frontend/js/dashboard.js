// ========== VARIABLES GLOBALES ==========
const API_URL = window.location.origin;
let token = null;
let usuario = null;
let charts = {};
let autoRefreshInterval = null;

// ========== INICIALIZACIÓN ==========
window.addEventListener('DOMContentLoaded', async () => {
  token = localStorage.getItem('token');
  const usuarioData = localStorage.getItem('usuario');
  
  if (!token) {
    window.location.href = '/login.html';
    return;
  }
  
  usuario = JSON.parse(usuarioData);
  document.getElementById('usuarioNombre').textContent = usuario.nombre || 'Usuario';
  
  // Cargar datos iniciales
  await cargarDatos();
  
  // Auto-refresh cada 5 segundos
  if (document.getElementById('autoRefresh').checked) {
    iniciarAutoRefresh();
  }
  
  // Event listener para auto-refresh
  document.getElementById('autoRefresh').addEventListener('change', (e) => {
    if (e.target.checked) {
      iniciarAutoRefresh();
    } else {
      detenerAutoRefresh();
    }
  });
});

// ========== AUTO-REFRESH ==========
function iniciarAutoRefresh() {
  if (autoRefreshInterval) detenerAutoRefresh();
  autoRefreshInterval = setInterval(() => {
    cargarDatos();
  }, 5000); // Cada 5 segundos
}

function detenerAutoRefresh() {
  if (autoRefreshInterval) {
    clearInterval(autoRefreshInterval);
    autoRefreshInterval = null;
  }
}

// ========== LOGOUT ==========
function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('usuario');
  window.location.href = '/login.html';
}

// ========== MOSTRAR/OCULTAR SECCIONES ==========
function mostrarSeccion(seccion) {
  // Ocultar todas las secciones
  document.querySelectorAll('.seccion').forEach(s => s.classList.remove('active'));
  
  // Actualizar menu
  document.querySelectorAll('.menu-item').forEach(m => m.classList.remove('active'));
  event.target.closest('.menu-item').classList.add('active');
  
  // Mostrar sección
  document.getElementById(seccion).classList.add('active');
  
  // Cargar datos específicos
  if (seccion === 'historico') {
    cargarDatosHistoricos();
  }
}

// ========== CARGAR DATOS ==========
async function cargarDatos() {
  try {
    const response = await fetch(`${API_URL}/api/datos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        logout();
      }
      return;
    }
    
    const datos = await response.json();
    
    // Actualizar última lectura
    actualizarUltimaLectura(datos);
    
    // Actualizar tabla
    actualizarTabla(datos);
    
    // Actualizar gráfico último día
    actualizarChartUltimoDia(datos);
    
    // Actualizar hora
    document.getElementById('actualizacion').textContent = 
      `Última actualización: ${new Date().toLocaleTimeString('es-ES')}`;
    
  } catch (error) {
    console.error('Error cargando datos:', error);
  }
}

// ========== ACTUALIZAR ÚLTIMA LECTURA ==========
function actualizarUltimaLectura(datos) {
  if (datos.length === 0) return;
  
  const ultimo = datos[0];
  
  document.getElementById('tempActual').textContent = 
    (ultimo.temperatura ? ultimo.temperatura.toFixed(2) : '--') + ' °C';
  document.getElementById('humActual').textContent = 
    (ultimo.humedad ? ultimo.humedad.toFixed(2) : '--') + ' %';
  document.getElementById('presActual').textContent = 
    (ultimo.presion ? ultimo.presion.toFixed(2) : '--') + ' hPa';
  document.getElementById('estadoConexion').textContent = '🟢 Conectado';
  
  // Actualizar coordenadas GPS
  if (ultimo.lat_sim && ultimo.lon_sim) {
    document.getElementById('mapLat').textContent = ultimo.lat_sim.toFixed(6);
    document.getElementById('mapLon').textContent = ultimo.lon_sim.toFixed(6);
  }
}

// ========== ACTUALIZAR TABLA ==========
function actualizarTabla(datos) {
  const tbody = document.getElementById('tableBody');
  
  if (datos.length === 0) {
    tbody.innerHTML = '<tr><td colspan="6">Sin datos disponibles</td></tr>';
    return;
  }
  
  tbody.innerHTML = datos.map(dato => `
    <tr>
      <td>${new Date(dato.timestamp).toLocaleString('es-ES')}</td>
      <td>${dato.temperatura ? dato.temperatura.toFixed(2) : '--'}</td>
      <td>${dato.humedad ? dato.humedad.toFixed(2) : '--'}</td>
      <td>${dato.presion ? dato.presion.toFixed(2) : '--'}</td>
      <td>${dato.lat_sim ? dato.lat_sim.toFixed(6) : '--'}</td>
      <td>${dato.lon_sim ? dato.lon_sim.toFixed(6) : '--'}</td>
    </tr>
  `).join('');
}

// ========== GRÁFICO ÚLTIMO DÍA ==========
function actualizarChartUltimoDia(datos) {
  const ctx = document.getElementById('chartUltimodia');
  if (!ctx) return;
  
  // Invertir datos para orden cronológico
  const datosOrdenados = [...datos].reverse();
  
  const labels = datosOrdenados.map(d => 
    new Date(d.timestamp).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })
  );
  
  const temperaturas = datosOrdenados.map(d => d.temperatura || null);
  const humedades = datosOrdenados.map(d => d.humedad || null);
  const presiones = datosOrdenados.map(d => d.presion ? d.presion / 10 : null); // Escalar presión
  
  if (charts.ultimodia) {
    charts.ultimodia.data.labels = labels;
    charts.ultimodia.data.datasets[0].data = temperaturas;
    charts.ultimodia.data.datasets[1].data = humedades;
    charts.ultimodia.data.datasets[2].data = presiones;
    charts.ultimodia.update();
  } else {
    charts.ultimodia = new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Temperatura (°C)',
            data: temperaturas,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Humedad (%)',
            data: humedades,
            borderColor: '#3b82f6',
            backgroundColor: 'rgba(59, 130, 246, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2
          },
          {
            label: 'Presión (hPa/10)',
            data: presiones,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.1)',
            tension: 0.4,
            fill: true,
            borderWidth: 2,
            yAxisID: 'y1'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            display: true,
            position: 'top'
          }
        },
        scales: {
          y: {
            type: 'linear',
            display: true,
            position: 'left',
            title: {
              display: true,
              text: 'Temperatura (°C) / Humedad (%)'
            }
          },
          y1: {
            type: 'linear',
            display: true,
            position: 'right',
            title: {
              display: true,
              text: 'Presión'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }
}

// ========== CARGAR DATOS HISTÓRICOS ==========
async function cargarDatosHistoricos() {
  try {
    const response = await fetch(`${API_URL}/api/datos/historicos`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (!response.ok) return;
    
    const datos = await response.json();
    
    if (datos.length === 0) return;
    
    // Ordenar por timestamp
    datos.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
    
    // Crear gráficos
    crearChartTemperatura(datos);
    crearChartHumedad(datos);
    crearChartPresion(datos);
    
    // Calcular estadísticas
    calcularEstadisticas(datos);
    
  } catch (error) {
    console.error('Error cargando datos históricos:', error);
  }
}

// ========== GRÁFICO TEMPERATURA HISTÓRICO ==========
function crearChartTemperatura(datos) {
  const ctx = document.getElementById('chartTemperatura');
  if (!ctx) return;
  
  const labels = datos.map(d => new Date(d.timestamp).toLocaleDateString('es-ES'));
  const data = datos.map(d => d.temperatura || null);
  
  if (charts.temperatura) charts.temperatura.destroy();
  
  charts.temperatura = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Temperatura (°C)',
        data: data,
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#ef4444',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

// ========== GRÁFICO HUMEDAD HISTÓRICO ==========
function crearChartHumedad(datos) {
  const ctx = document.getElementById('chartHumedad');
  if (!ctx) return;
  
  const labels = datos.map(d => new Date(d.timestamp).toLocaleDateString('es-ES'));
  const data = datos.map(d => d.humedad || null);
  
  if (charts.humedad) charts.humedad.destroy();
  
  charts.humedad = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Humedad (%)',
        data: data,
        borderColor: '#3b82f6',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#3b82f6',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          max: 100
        }
      }
    }
  });
}

// ========== GRÁFICO PRESIÓN HISTÓRICO ==========
function crearChartPresion(datos) {
  const ctx = document.getElementById('chartPresion');
  if (!ctx) return;
  
  const labels = datos.map(d => new Date(d.timestamp).toLocaleDateString('es-ES'));
  const data = datos.map(d => d.presion || null);
  
  if (charts.presion) charts.presion.destroy();
  
  charts.presion = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Presión (hPa)',
        data: data,
        borderColor: '#10b981',
        backgroundColor: 'rgba(16, 185, 129, 0.1)',
        tension: 0.3,
        fill: true,
        borderWidth: 2,
        pointRadius: 3,
        pointBackgroundColor: '#10b981',
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      },
      scales: {
        y: {
          beginAtZero: false
        }
      }
    }
  });
}

// ========== CALCULAR ESTADÍSTICAS ==========
function calcularEstadisticas(datos) {
  // Temperatura
  const temperaturas = datos.map(d => d.temperatura).filter(t => t !== null);
  if (temperaturas.length > 0) {
    document.getElementById('tempMin').textContent = 
      Math.min(...temperaturas).toFixed(2) + '°C';
    document.getElementById('tempMax').textContent = 
      Math.max(...temperaturas).toFixed(2) + '°C';
    document.getElementById('tempProm').textContent = 
      (temperaturas.reduce((a, b) => a + b, 0) / temperaturas.length).toFixed(2) + '°C';
  }
  
  // Humedad
  const humedades = datos.map(d => d.humedad).filter(h => h !== null);
  if (humedades.length > 0) {
    document.getElementById('humMin').textContent = 
      Math.min(...humedades).toFixed(2) + '%';
    document.getElementById('humMax').textContent = 
      Math.max(...humedades).toFixed(2) + '%';
    document.getElementById('humProm').textContent = 
      (humedades.reduce((a, b) => a + b, 0) / humedades.length).toFixed(2) + '%';
  }
  
  // Presión
  const presiones = datos.map(d => d.presion).filter(p => p !== null);
  if (presiones.length > 0) {
    document.getElementById('presMin').textContent = 
      Math.min(...presiones).toFixed(2) + 'hPa';
    document.getElementById('presMax').textContent = 
      Math.max(...presiones).toFixed(2) + 'hPa';
    document.getElementById('presProm').textContent = 
      (presiones.reduce((a, b) => a + b, 0) / presiones.length).toFixed(2) + 'hPa';
  }
}
