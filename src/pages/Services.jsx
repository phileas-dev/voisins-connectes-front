import '../index.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { getServices, getCategories } from '../services/api'
import { useNavigate } from 'react-router'

function Services() {
  const [services, setServices] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('PENDING')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const [categoriesData, servicesData] = await Promise.all([
          getCategories(),
          getServices({ status: 'PENDING' })
        ])
        setCategories(Array.isArray(categoriesData) ? categoriesData : [])
        setServices(Array.isArray(servicesData) ? servicesData : [])
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des annonces')
      } finally {
        setLoading(false)
      }
    }

    fetchInitialData()
  }, [])

  useEffect(() => {
    if (loading) return

    const fetchFilteredServices = async () => {
      try {
        setError(null)
        const data = await getServices({
          categoryId: selectedCategory || null,
          status: selectedStatus || null
        })
        setServices(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Erreur lors du filtrage des annonces')
      }
    }

    fetchFilteredServices()
  }, [selectedCategory, selectedStatus])

  if (loading) {
    return (
      <>
        <Header />
        <main className="form-page">
          <div className="form-container-single">
            <p style={{ textAlign: 'center', padding: '20px' }}>Chargement des annonces...</p>
          </div>
        </main>
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="form-page">
          <div className="form-container-single">
            <div style={{ 
              padding: '20px', 
              backgroundColor: '#fee', 
              border: '1px solid #fcc',
              borderRadius: '4px',
              color: '#c00',
              textAlign: 'center'
            }}>
              {error}
            </div>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>Annonces de services</h1>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            marginBottom: '24px',
            alignItems: 'center'
          }}
        >
          <div style={{ minWidth: '220px' }}>
            <label htmlFor="status-filter" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Statut
            </label>
            <select
              id="status-filter"
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              <option value="PENDING">En attente</option>
              <option value="IN_PROGRESS">En cours</option>
              <option value="COMPLETED">Terminé</option>
              <option value="DONE">Archivé</option>
              <option value="">Tous</option>
            </select>
          </div>

          <div style={{ minWidth: '220px' }}>
            <label htmlFor="category-filter" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Catégorie
            </label>
            <select
              id="category-filter"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
            >
              <option value="">Toutes les catégories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        {services.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#666' }}>
            Aucune annonce disponible pour le moment.
          </p>
        ) : (
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', 
            gap: '20px' 
          }}>
            {services.map((service) => (
              <div 
                key={service.id}
                onClick={() => navigate(`/service/${service.id}`)}
                style={{
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  padding: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: '#fff',
                  boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)'
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)'
                }}
              >
                {service.image && (
                  <img 
                    src={service.image.startsWith('http') ? service.image : `http://localhost:8000${service.image}`}
                    alt={service.title}
                    style={{
                      width: '100%',
                      height: '200px',
                      objectFit: 'cover',
                      borderRadius: '4px',
                      marginBottom: '15px'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
                
                <h3 style={{ marginBottom: '10px', color: '#333' }}>
                  {service.title}
                </h3>
                
                <p style={{ 
                  color: '#666', 
                  fontSize: '14px',
                  marginBottom: '10px',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {service.description}
                </p>
                
                {service.category && (
                  <span style={{
                    display: 'inline-block',
                    backgroundColor: '#e0e0e0',
                    padding: '4px 12px',
                    borderRadius: '12px',
                    fontSize: '12px',
                    color: '#555'
                  }}>
                    {service.category.name}
                  </span>
                )}
                
                <div style={{ 
                  marginTop: '15px', 
                  paddingTop: '15px', 
                  borderTop: '1px solid #eee',
                  fontSize: '13px',
                  color: '#888'
                }}>
                  Par {service.author?.firstname} {service.author?.lastname}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Services
