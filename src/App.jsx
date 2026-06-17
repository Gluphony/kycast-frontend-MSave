import { useState } from 'react'
import './App.css'

function App() {
  const [menuAbierto, setMenuAbierto] = useState(false)

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto)
  }

  const featuredWeather = [
    { id: 1, city: "MANILA,\nFILIPINAS", desc: "Soleado", temp: "30°C", icon: "☀️" },
    { id: 2, city: "NUEVA YORK,\nEE.UU.", desc: "Tormentoso", temp: "22°C", icon: "⛈️" },
    { id: 3, city: "TOKIO,\nJAPÓN", desc: "Parcialmente nublado", temp: "28°C", icon: "🌤️" },
    { id: 4, city: "SÍDNEY,\nAUSTRALIA", desc: "Nublado", temp: "25°C", icon: "☁️" }
  ];

  const globalWeather = [
    { id: 1, city: "PEKÍN, CHINA", temp: "28°C", icon: "☁️" },
    { id: 2, city: "BUENOS AIRES, ARGENTINA", temp: "23°C", icon: "🌧️" },
    { id: 3, city: "VICTORIA, HONG KONG", temp: "32°C", icon: "☀️" },
    { id: 4, city: "INGLATERRA, REINO UNIDO", temp: "25°C", icon: "🌤️" },
    { id: 5, city: "ESTAMBUL, TURQUÍA", temp: "22°C", icon: "🌦️" },
    { id: 6, city: "MOSCÚ, RUSIA", temp: "24°C", icon: "⛈️" },
    { id: 7, city: "MADRID, ESPAÑA", temp: "30°C", icon: "☀️" },
    { id: 8, city: "MUMBAI, INDIA", temp: "29°C", icon: "☁️" }
  ];
  
  return (
    <>
      {/* MENÚ LATERAL RESTAURADO */}
      <div className={`side-menu ${menuAbierto ? 'open' : ''}`}>
        <div className="menu-header">
          <h2 className="menu-brand">SKYCAST</h2>
          <button className="close-btn" onClick={toggleMenu}>&times;</button>
        </div>
        
        <div className="menu-content">
          <ul className="menu-links">
            <li className="active">
              <a href="#inicio" onClick={toggleMenu}>
                <span className="panel-icon"></span>
                <span className="panel-text">Inicio</span>
              </a>
            </li>
            <li>
              <a href="#radar" onClick={toggleMenu}>
                <span className="panel-icon"></span>
                <span className="panel-text">Mapa de Radar</span>
              </a>
            </li>
            <li>
              <a href="#pronostico" onClick={toggleMenu}>
                <span className="panel-icon"></span>
                <span className="panel-text">Pronóstico 7 días</span>
              </a>
            </li>
            <li>
              <a href="#alertas" onClick={toggleMenu}>
                <span className="panel-icon"></span>
                <span className="panel-text">Alertas Locales</span>
              </a>
            </li>
            <li>
              <a href="#guardados" onClick={toggleMenu}>
                <span className="panel-icon"></span>
                <span className="panel-text">Mis Ciudades</span>
              </a>
            </li>
            
            <hr className="menu-divider" />
            
            <li>
              <a href="#ajustes" onClick={toggleMenu}>
                <span className="panel-icon">⚙️</span>
                <span className="panel-text">Configuración</span>
              </a>
            </li>
            <li>
              <a href="#ayuda" onClick={toggleMenu}>
                <span className="panel-icon">❓</span>
                <span className="panel-text">Ayuda y Soporte</span>
              </a>
            </li>
          </ul>
        </div>
      </div>

      {menuAbierto && <div className="overlay" onClick={toggleMenu}></div>}

      <div className="hero-section">
        <div className="earth-bg"></div>

        <div className="hero-content-wrapper">
          <nav className="navbar">
            <div className="logo-container">
              <h1 style={{ fontSize: '3rem', margin: 0 }}>🌩️</h1>
              <div className="logo-text">
                <h2>SKYCAST</h2>
                <p>TU CLIMA AL INSTANTE</p>
              </div>
            </div>
            <div className="menu-icon" onClick={toggleMenu}>☰</div>
          </nav>

          <main className="hero-main">
            <h1 className="hero-title">CLIMA DE UN VISTAZO</h1>
            <p className="hero-subtitle">
              Manténgase informado y a salvo con nuestros pronósticos del tiempo precisos y confiables.
            </p>
            <button className="subscribe-btn">SUSCRÍBETE</button>
          </main>

          <div className="featured-cities-container">
            <div className="featured-cities-grid">
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

      <div className="global-section">
        <h3 className="global-title">CONDICIONES METEOROLÓGICAS GLOBALES</h3>
        
        <div className="weather-grid">
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

      <footer className="footer-section">
        <div className="footer-content">
          <div className="logo-container">
            <h1 style={{ fontSize: '2rem', margin: 0 }}>🌩️</h1>
            <div className="logo-text">
              <h2>SKYCAST</h2>
              <p>TU CLIMA AL INSTANTE</p>
            </div>
          </div>
          <p className="footer-copy">© 2025. Todos los derechos reservados.</p>
          <div className="social-links">
            <span>FB</span>
            <span>IG</span>
            <span>TW</span>
          </div>
        </div>
      </footer>
    </>
  )
}

export default App