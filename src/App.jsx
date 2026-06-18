// src/App.jsx
import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false);

  // --- CONFIGURACIÓN DE CONEXIÓN A LA API ---
  const API_URL = 'http://localhost:3001/api';

  // Estados originales
  const [featuredWeather, setFeaturedWeather] = useState([]);
  const [globalWeather, setGlobalWeather] = useState([]);
  
  // NUEVOS ESTADOS PARA EL BUSCADOR
  const [listaPaises, setListaPaises] = useState([]); // Guarda la lista del backend
  const [busqueda, setBusqueda] = useState(''); // Lo que escribe el usuario
  const [paisSeleccionado, setPaisSeleccionado] = useState(null); // Los datos del país buscado
  const [cargandoBusqueda, setCargandoBusqueda] = useState(false); // Estado de carga

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. Petición para el Hero
        const featuredRes = await fetch(`${API_URL}/clima/featured`);
        if (featuredRes.ok) setFeaturedWeather(await featuredRes.json());

        // 2. Petición para la sección inferior
        const globalRes = await fetch(`${API_URL}/clima/global`);
        if (globalRes.ok) setGlobalWeather(await globalRes.json());

        // 3. NUEVA: Petición para alimentar el buscador
        const listRes = await fetch(`${API_URL}/clima/list`);
        if (listRes.ok) setListaPaises(await listRes.json());

      } catch (error) {
        console.error("⚠️ Error conectando con el backend Skycast:", error);
      }
    };
    fetchData();
  }, []);

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  // NUEVA FUNCIÓN: Maneja la búsqueda del país a prueba de errores de traducción
  const buscarPais = async (e) => {
    e.preventDefault();
    if (!busqueda.trim()) return;

    // Buscamos el país. Usamos (p.nombre || p.Nombre) por si SQL Server lo manda con mayúscula
    const paisEncontrado = listaPaises.find(p => {
      const nombrePais = p.nombre || p.Nombre || ''; 
      return nombrePais.toLowerCase().includes(busqueda.toLowerCase());
    });

    if (paisEncontrado) {
      setCargandoBusqueda(true);
      try {
        const paisId = paisEncontrado.id || paisEncontrado.Id;
        
        const [climaRes, tiempoRes] = await Promise.all([
          fetch(`${API_URL}/clima/${paisId}`),
          fetch(`${API_URL}/tiempo/${paisId}`)
        ]);

        if (climaRes.ok && tiempoRes.ok) {
          const climaData = await climaRes.json();
          const tiempoData = await tiempoRes.json();
          
          // 🕵️‍♂️ DEBUG: Esto imprimirá en tu consola (F12) exactamente qué palabras usa tu backend
          console.log("🌤️ Datos del Clima:", climaData);
          console.log("⏰ Datos del Tiempo:", tiempoData);
          
          const tempLimpia = String(climaData.temperatura || climaData.temp || '--').replace('°C', '');
          const humLimpia = String(climaData.humedad || climaData.humidity || '--').replace('%', '');

          setPaisSeleccionado({
            city: climaData.ciudad || climaData.city || paisEncontrado.nombre || paisEncontrado.Nombre,
            temp: tempLimpia,
            icon: climaData.icono || climaData.icon || '🌍',
            desc: climaData.descripcion || climaData.desc || 'Despejado',
            humidity: humLimpia,
            // Agregamos más opciones comunes para el tiempo por si viene en inglés o en otro formato
            horaLocal: tiempoData.hora_local || tiempoData.horaLocal || tiempoData.time || tiempoData.hora || '--:--',
            zonaHoraria: tiempoData.zona_horaria || tiempoData.Zona_horaria || tiempoData.timezone || '--'
          });
        }
      } catch (error) {
        console.error("Error al buscar detalles del país:", error);
      } finally {
        setCargandoBusqueda(false);
      }
    } else {
      alert(`El país "${busqueda}" no está registrado en la base de datos.`);
    }
  };

  return (
    <>
      {/* MENÚ LATERAL (Igual) */}
      <div className={`side-menu ${menuAbierto ? 'open' : ''}`}>
        <div className="menu-header">
          <h2 className="menu-brand">SKYCAST</h2>
          <button className="close-btn" onClick={toggleMenu}>&times;</button>
        </div>
        <div className="menu-content">
          <ul className="menu-links">
            <li className="active"><a href="#inicio" onClick={toggleMenu}><span className="panel-icon"></span><span className="panel-text">Inicio</span></a></li>
            <li><a href="#radar" onClick={toggleMenu}><span className="panel-icon"></span><span className="panel-text">Mapa de Radar</span></a></li>
            <li><a href="#pronostico" onClick={toggleMenu}><span className="panel-icon"></span><span className="panel-text">Pronóstico 7 días</span></a></li>
            <li><a href="#alertas" onClick={toggleMenu}><span className="panel-icon"></span><span className="panel-text">Alertas Locales</span></a></li>
            <li><a href="#guardados" onClick={toggleMenu}><span className="panel-icon"></span><span className="panel-text">Mis Ciudades</span></a></li>
            <hr className="menu-divider" />
            <li><a href="#ajustes" onClick={toggleMenu}><span className="panel-icon">⚙️</span><span className="panel-text">Configuración</span></a></li>
            <li><a href="#ayuda" onClick={toggleMenu}><span className="panel-icon">?</span><span className="panel-text">Ayuda y Soporte</span></a></li>
          </ul>
        </div>
      </div>
      {menuAbierto && <div className="overlay" onClick={toggleMenu}></div>}

      {/* HERO SECTION (Igual) */}
      <div className="hero-section">
        <div className="earth-bg"></div>
        <div className="hero-content-wrapper">
          <nav className="navbar">
            <div className="logo-container">
              <h1 style={{ fontSize: '3rem', margin: 0 }}>🌩️</h1>
              <div className="logo-text"><h2>SKYCAST</h2><p>TU CLIMA AL INSTANTE</p></div>
            </div>
            <div className="menu-icon" onClick={toggleMenu}>☰</div>
          </nav>
          <main className="hero-main">
            <h1 className="hero-title">CLIMA DE UN VISTAZO</h1>
            <p className="hero-subtitle">Manténgase informado y a salvo con nuestros pronósticos precisos.</p>
            <button className="subscribe-btn">SUSCRÍBETE</button>
          </main>

          <div className="featured-cities-container">
            <div className="featured-cities-grid">
              {featuredWeather.length === 0 && <p style={{textAlign: 'center', width: '100%'}}>Conectando con API Skycast...</p>}
              {featuredWeather.map(city => (
                <div className="featured-city-card" key={city.id}>
                  <span className="featured-emoji">{city.icon}</span>
                  <div className="featured-info">
                    <h4>{city.city}</h4>
                    <p className="desc">{city.desc}</p>
                    <p className="temp">{city.temp}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* NUEVA SECCIÓN: BUSCADOR INTERACTIVO */}
      {/* ========================================================= */}
      <div className="search-section" style={{ padding: '40px 20px', backgroundColor: '#f4f6f9', textAlign: 'center' }}>
        <h3 style={{ color: '#1a365d', marginBottom: '20px' }}>BUSCA TU CIUDAD</h3>
        
        <form onSubmit={buscarPais} style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '30px' }}>
          <input 
            type="text" 
            placeholder="Ej. Japón, Canadá, España..." 
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            style={{ padding: '12px 20px', borderRadius: '25px', border: '1px solid #ccc', width: '300px', fontSize: '1rem' }}
          />
          <button type="submit" className="subscribe-btn" style={{ padding: '12px 25px', borderRadius: '25px' }}>
            {cargandoBusqueda ? 'Buscando...' : 'Buscar'}
          </button>
        </form>

        {/* Tarjeta de resultado de búsqueda (CORREGIDA E INTEGRADA) */}
        {paisSeleccionado && (
          <div className="search-result-card" style={{ 
            backgroundColor: 'white', padding: '30px', borderRadius: '15px', 
            boxShadow: '0 10px 25px rgba(0,0,0,0.1)', maxWidth: '400px', margin: '0 auto', display: 'flex', flexDirection: 'column', alignItems: 'center' 
          }}>
            
            {/* Si el icono contiene 'http', se renderiza como imagen legítima. Si no, como texto/emoji */}
            {paisSeleccionado.icon.includes('http') ? (
              <img src={paisSeleccionado.icon} alt="Icono del clima" style={{ width: '100px', height: '100px' }} />
            ) : (
              <span style={{ fontSize: '4rem' }}>{paisSeleccionado.icon}</span>
            )}

            <h2 style={{ color: '#1a365d', margin: '10px 0 5px 0' }}>{paisSeleccionado.city}</h2>
            
            {/* Agregados los símbolos visuales correctos de manera estática */}
            <h1 style={{ fontSize: '3.5rem', margin: '0', color: '#ff6b6b' }}>{paisSeleccionado.temp}°C</h1>
            <p style={{ color: '#666', fontSize: '1.2rem', textTransform: 'capitalize' }}>{paisSeleccionado.desc}</p>
            
            <div style={{ width: '100%', height: '1px', backgroundColor: '#eee', margin: '20px 0' }}></div>
            
            <p style={{ color: '#444', margin: '5px 0' }}><strong>Humedad:</strong> {paisSeleccionado.humidity}%</p>
            <p style={{ color: '#444', margin: '5px 0' }}><strong>Hora Local:</strong> {paisSeleccionado.horaLocal}</p>
            <p style={{ color: '#888', fontSize: '0.9rem' }}>{paisSeleccionado.zonaHoraria}</p>
          </div>
        )}
      </div>

      {/* GLOBAL SECTION (Igual) */}
      <div className="global-section">
        <h3 className="global-title">CONDICIONES METEOROLÓGICAS GLOBALES</h3>
        <div className="weather-grid">
          {globalWeather.length === 0 && <p style={{textAlign: 'center', gridColumn: '1 / -1', color: '#666'}}>Cargando datos globales...</p>}
          {globalWeather.map((weather) => (
            <div className="weather-list-item" key={weather.id}>
              <span className="weather-emoji">{weather.icon}</span>
              <div className="weather-details">
                <h4 className="weather-city">{weather.city}</h4>
                <p className="weather-temp">{weather.temp}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER (Igual) */}
      <footer className="footer-section">
        <div className="footer-content">
          <div className="logo-container">
            <h1 style={{ fontSize: '2rem', margin: 0 }}>🌩️</h1>
            <div className="logo-text"><h2>SKYCAST</h2><p>TU CLIMA AL INSTANTE</p></div>
          </div>
          <p className="footer-copy">© 2026. Todos los derechos reservados.</p>
          <div className="social-links"><span>FB</span><span>IG</span><span>TW</span></div>
        </div>
      </footer>
    </>
  );
}

export default App;