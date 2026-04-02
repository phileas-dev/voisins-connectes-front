import '../index.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import { getMyServices, deleteService } from '../services/api'
import { useNavigate } from 'react-router'
import useMediaQuery from '../hooks/useMediaQuery'

function MyServices() {
  const navigate = useNavigate()
  const isMobile = useMediaQuery('(max-width: 768px)')
  const isTablet = useMediaQuery('(max-width: 1024px)')
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)
  const [pendingDeleteService, setPendingDeleteService] = useState(null)

  useEffect(() => {
    fetchMyServices()
  }, [])

  const fetchMyServices = async () => {
    try {
      setLoading(true)
      const data = await getMyServices()
      setServices(data)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement de vos annonces')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await deleteService(id)
      setServices(services.filter(s => s.id !== id))
      setSuccessMessage('Annonce supprimée avec succès.')
      setPendingDeleteService(null)
    } catch (err) {
      setError(err.message || 'Erreur lors de la suppression')
    }
  }

  const getServicesByStatus = (status) => {
    return services.filter(s => s.status === status)
  }

  const statusConfig = {
    PENDING: {
      label: 'En attente',
      color: '#3b82f6',
      bg: '#eff6ff'
    },
    IN_PROGRESS: {
      label: 'En cours',
      color: '#f59e0b',
      bg: '#fffbeb'
    },
    COMPLETED: {
      label: 'Terminé',
      color: '#10b981',
      bg: '#f0fdf4'
    },
    DONE: {
      label: 'Archivé',
      color: '#6b7280',
      bg: '#f3f4f6'
    }
  }

  const ServiceCard = ({ service }) => {
    const config = statusConfig[service.status] || statusConfig.PENDING

    return (
      <div style={{
        backgroundColor: '#fff',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '12px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        border: '1px solid #e5e7eb',
        cursor: 'pointer',
        transition: 'all 0.2s'
      }}
      onMouseEnter={(e) => e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)'}
      onMouseLeave={(e) => e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'}
      >
        <div onClick={() => navigate(`/service/${service.id}`)}>
          <h3 style={{ 
            margin: '0 0 8px 0',
            fontSize: '16px',
            fontWeight: '600',
            color: '#111'
          }}>
            {service.title}
          </h3>

          {service.category && (
            <span style={{
              display: 'inline-block',
              fontSize: '12px',
              padding: '4px 10px',
              borderRadius: '12px',
              backgroundColor: '#f3f4f6',
              color: '#6b7280',
              marginBottom: '8px'
            }}>
              {service.category.name}
            </span>
          )}

          <p style={{
            fontSize: '14px',
            color: '#6b7280',
            margin: '8px 0',
            lineHeight: '1.4',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {service.description}
          </p>

          <div style={{
            fontSize: '12px',
            color: '#9ca3af',
            marginTop: '8px'
          }}>
            📍 {service.location} • {new Date(service.createdAt).toLocaleDateString('fr-FR')}
          </div>

          {service.proposals && service.proposals.length > 0 && (
            <div style={{
              marginTop: '8px',
              fontSize: '13px',
              color: '#059669',
              fontWeight: '500'
            }}>
              💬 {service.proposals.length} proposition{service.proposals.length > 1 ? 's' : ''}
            </div>
          )}
        </div>

        <div style={{
          marginTop: '12px',
          paddingTop: '12px',
          borderTop: '1px solid #f3f4f6',
          display: 'flex',
          gap: '8px'
        }}>
          <button
            onClick={() => navigate(`/service/${service.id}`)}
            style={{
              flex: 1,
              padding: '8px 12px',
              fontSize: '13px',
              backgroundColor: config.bg,
              color: config.color,
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            Voir
          </button>
          <button
            onClick={() => {
              setSuccessMessage(null)
              setPendingDeleteService({ id: service.id, title: service.title })
            }}
            style={{
              padding: '8px 12px',
              fontSize: '13px',
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '500'
            }}
          >
            🗑️ Supprimer
          </button>
        </div>
      </div>
    )
  }

  const KanbanColumn = ({ status, label, color, bg }) => {
    const columnServices = getServicesByStatus(status)

    return (
      <div style={{
        flex: 1,
        minWidth: isMobile ? '100%' : '280px',
        backgroundColor: '#f9fafb',
        borderRadius: '12px',
        padding: '16px',
        maxHeight: isMobile ? 'none' : '80vh',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
          paddingBottom: '12px',
          borderBottom: `3px solid ${color}`
        }}>
          <h2 style={{
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: '#111'
          }}>
            {label}
          </h2>
          <span style={{
            backgroundColor: color,
            color: '#fff',
            padding: '4px 12px',
            borderRadius: '16px',
            fontSize: '13px',
            fontWeight: '600'
          }}>
            {columnServices.length}
          </span>
        </div>

        <div style={{
          overflowY: isMobile ? 'visible' : 'auto',
          flex: 1
        }}>
          {columnServices.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              color: '#9ca3af',
              fontSize: '14px'
            }}>
              Aucune annonce
            </div>
          ) : (
            columnServices.map(service => (
              <ServiceCard key={service.id} service={service} />
            ))
          )}
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <>
        <Header />
        <main style={{ padding: '20px', textAlign: 'center' }}>
          <p>Chargement de vos annonces...</p>
        </main>
        <Footer />
      </>
    )
  }

  if (error) {
    return (
      <>
        <Header />
        <main style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{
            backgroundColor: '#fef2f2',
            border: '1px solid #fecaca',
            borderRadius: '8px',
            padding: '16px',
            color: '#dc2626'
          }}>
            {error}
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Header />
      <main style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
        {successMessage && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#e8f8ef',
            border: '1px solid #b7ebc6',
            borderRadius: '8px',
            color: '#1e7e34'
          }}>
            {successMessage}
          </div>
        )}

        {pendingDeleteService && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#fff7ed',
            border: '1px solid #fed7aa',
            borderRadius: '8px',
            color: '#9a3412',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: '12px',
            flexWrap: 'wrap'
          }}>
            <span>
              Confirmer la suppression de l'annonce "{pendingDeleteService.title}" ?
            </span>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button
                className="btn btn-secondary"
                onClick={() => setPendingDeleteService(null)}
                style={{ padding: '8px 12px' }}
              >
                Annuler
              </button>
              <button
                className="btn btn-primary"
                onClick={() => handleDelete(pendingDeleteService.id)}
                style={{ padding: '8px 12px' }}
              >
                Supprimer
              </button>
            </div>
          </div>
        )}

        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'stretch' : 'center',
          marginBottom: '24px',
          gap: '12px'
        }}>
          <h1 style={{ margin: 0 }}>Mes annonces</h1>
          <button
            onClick={() => navigate('/create-service')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '15px',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            ➕ Nouvelle annonce
          </button>
        </div>

        {services.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '60px 20px',
            backgroundColor: '#f9fafb',
            borderRadius: '12px'
          }}>
            <h2 style={{ color: '#6b7280', fontWeight: '500' }}>Vous n'avez pas encore d'annonces</h2>
            <p style={{ color: '#9ca3af', marginBottom: '24px' }}>
              Créez votre première annonce pour commencer !
            </p>
            <button
              onClick={() => navigate('/create-service')}
              style={{
                padding: '12px 32px',
                backgroundColor: '#3b82f6',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontSize: '15px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Créer une annonce
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: isMobile ? '1fr' : isTablet ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
            gap: '16px',
            paddingBottom: '20px'
          }}>
            <KanbanColumn 
              status="PENDING" 
              label="En attente" 
              color={statusConfig.PENDING.color}
              bg={statusConfig.PENDING.bg}
            />
            <KanbanColumn 
              status="IN_PROGRESS" 
              label="En cours" 
              color={statusConfig.IN_PROGRESS.color}
              bg={statusConfig.IN_PROGRESS.bg}
            />
            <KanbanColumn 
              status="COMPLETED" 
              label="Terminé" 
              color={statusConfig.COMPLETED.color}
              bg={statusConfig.COMPLETED.bg}
            />
            <KanbanColumn 
              status="DONE" 
              label="Archivé" 
              color={statusConfig.DONE.color}
              bg={statusConfig.DONE.bg}
            />
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default MyServices
