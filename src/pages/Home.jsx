import '../index.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router'
import { useState, useEffect } from 'react'
import { getServices } from '../services/api'

function Home() {
  const { isAuthenticated, user } = useAuth()
  const navigate = useNavigate()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const data = await getServices()
        // Prendre seulement les 4 dernières annonces pour la home
        setServices(data.slice(0, 4))
      } catch (err) {
        console.error('Erreur lors du chargement des annonces:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  return (
    <>
      <Header />
      <main>
        <h1>
          <span className="voisins">Voisins</span> <span className="connectes">Connectés</span>
        </h1>
        <p className="subtitle">Votre site pour toutes les petites offres de [ville]</p>
        <p className="description">Échangez avec 1500+ résidents</p>
        
        {isAuthenticated ? (
          // Boutons pour utilisateur connecté
          <div>
            <p style={{ textAlign: 'center', marginBottom: '20px', fontSize: '18px' }}>
              Bienvenue <strong>{user?.firstname} {user?.lastname}</strong> ! 👋
            </p>
            <div className="button-group">
              <button 
                onClick={() => navigate('/create-service')} 
                className="btn btn-primary"
              >
                Créer une annonce
              </button>
              <button 
                onClick={() => navigate('/my-services')} 
                className="btn btn-secondary"
              >
                Gérer mes annonces
              </button>
            </div>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <a 
                href="/services" 
                style={{ 
                  color: '#666', 
                  textDecoration: 'underline',
                  fontSize: '14px'
                }}
              >
                Voir toutes les annonces
              </a>
            </div>
          </div>
        ) : (
          // Boutons pour visiteur non connecté
          <div className="button-group">
            <a href="/signup" className="btn btn-primary">S'inscrire</a>
            <a href="/login" className="btn btn-secondary">Se connecter</a>
          </div>
        )}

        {/* Annonces récentes */}
        <div style={{ marginTop: '40px' }}>
          <h2 style={{ 
            textAlign: 'center', 
            marginBottom: '30px',
            fontSize: '24px',
            color: '#333'
          }}>
            Annonces récentes
          </h2>

          {loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>
              Chargement des annonces...
            </p>
          ) : services.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#666' }}>
              Aucune annonce disponible pour le moment.
            </p>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '20px',
              maxWidth: '1200px',
              margin: '0 auto',
              padding: '0 20px'
            }}>
              {services.map((service) => (
                <div 
                  key={service.id}
                  onClick={() => navigate(`/service/${service.id}`)}
                  className="annonce"
                  style={{ 
                    cursor: 'pointer',
                    transition: 'transform 0.2s, box-shadow 0.2s',
                    padding: '15px',
                    minHeight: '200px'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 6px 12px rgba(0,0,0,0.15)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = ''
                  }}
                >
                  <div className="annonce-label">{service.category?.name || 'Service'}</div>
                  
                  {service.image && (
                    <img 
                      src={service.image.startsWith('http') ? service.image : `http://localhost:8000${service.image}`}
                      alt={service.title}
                      style={{
                        width: '100%',
                        height: '150px',
                        objectFit: 'cover',
                        borderRadius: '4px',
                        marginBottom: '10px'
                      }}
                      onError={(e) => {
                        e.target.style.display = 'none'
                      }}
                    />
                  )}
                  
                  <h3 style={{ 
                    fontSize: '16px', 
                    marginBottom: '8px',
                    color: '#333'
                  }}>
                    {service.title}
                  </h3>
                  
                  <p style={{
                    fontSize: '13px',
                    color: '#666',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    marginBottom: '8px'
                  }}>
                    {service.description}
                  </p>
                  
                  <div style={{
                    fontSize: '12px',
                    color: '#888',
                    borderTop: '1px solid #eee',
                    paddingTop: '8px',
                    marginTop: '8px'
                  }}>
                    Par {service.author?.firstname} {service.author?.lastname}
                  </div>
                </div>
              ))}
            </div>
          )}

          {services.length > 0 && (
            <div style={{ textAlign: 'center', marginTop: '30px' }}>
              <button 
                onClick={() => navigate('/services')}
                className="btn btn-secondary"
              >
                Voir toutes les annonces →
              </button>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Home
