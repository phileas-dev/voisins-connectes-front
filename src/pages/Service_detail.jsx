import '../index.css'
import { useParams, useNavigate } from "react-router"
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState, useEffect } from 'react'
import {
  getService,
  createProposal,
  acceptProposal,
  rejectProposal,
  completeService,
  archiveService
} from '../services/api'
import { useAuth } from '../contexts/AuthContext'

function Service_detail() {
  const params = useParams()
  const navigate = useNavigate()
  const serviceId = params.id
  const { isAuthenticated, user } = useAuth()
  
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [proposalText, setProposalText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [showProposalForm, setShowProposalForm] = useState(false)
  const [acceptingProposalId, setAcceptingProposalId] = useState(null)
  const [rejectingProposalId, setRejectingProposalId] = useState(null)
  const [statusUpdating, setStatusUpdating] = useState(false)
  const [infoMessage, setInfoMessage] = useState(null)
  const isServiceOpen = service?.status === 'PENDING'
  const isOwner = isAuthenticated && user && service?.author?.id === user?.id
  const statusLabelMap = {
    PENDING: 'En attente',
    IN_PROGRESS: 'En cours',
    COMPLETED: 'Terminé',
    DONE: 'Archivé'
  }
  const statusColorMap = {
    PENDING: { bg: '#e8f8ef', color: '#1e7e34' },
    IN_PROGRESS: { bg: '#fff8e1', color: '#8a6d3b' },
    COMPLETED: { bg: '#e7f3ff', color: '#1d4f91' },
    DONE: { bg: '#f1f3f5', color: '#495057' }
  }

  const fetchService = async () => {
    try {
      const data = await getService(serviceId)
      setService(data)
    } catch (err) {
      setError(err.message || 'Erreur lors du chargement de l\'annonce')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchService()
  }, [serviceId])

  const handleProposalSubmit = async (e) => {
    e.preventDefault()
    
    if (!isAuthenticated) {
      setInfoMessage('Vous devez être connecté pour proposer vos services.')
      navigate('/login')
      return
    }

    setSubmitting(true)
    setError(null)

    try {
      await createProposal(serviceId, { message: proposalText })
      setInfoMessage('Votre proposition a été envoyée avec succès.')
      setProposalText('')
      setShowProposalForm(false)
      await fetchService()
    } catch (err) {
      setError(err.message || 'Erreur lors de l\'envoi de la proposition')
    } finally {
      setSubmitting(false)
    }
  }

  const handleAcceptProposal = async (proposalId) => {
    setError(null)
    setAcceptingProposalId(proposalId)
    try {
      await acceptProposal(proposalId)
      await fetchService()
    } catch (err) {
      setError(err.message || 'Erreur lors de l’acceptation de la proposition')
    } finally {
      setAcceptingProposalId(null)
    }
  }

  const handleRejectProposal = async (proposalId) => {
    setError(null)
    setRejectingProposalId(proposalId)
    try {
      await rejectProposal(proposalId)
      await fetchService()
    } catch (err) {
      setError(err.message || 'Erreur lors du refus de la proposition')
    } finally {
      setRejectingProposalId(null)
    }
  }

  const handleMarkCompleted = async () => {
    setError(null)
    setStatusUpdating(true)
    try {
      await completeService(serviceId)
      await fetchService()
    } catch (err) {
      setError(err.message || 'Erreur lors du passage en terminé')
    } finally {
      setStatusUpdating(false)
    }
  }

  const handleArchiveService = async () => {
    setError(null)
    setStatusUpdating(true)
    try {
      await archiveService(serviceId)
      await fetchService()
    } catch (err) {
      setError(err.message || "Erreur lors de l'archivage")
    } finally {
      setStatusUpdating(false)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <main className="form-page">
          <div className="form-container-single">
            <p style={{ textAlign: 'center', padding: '20px' }}>Chargement...</p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  if (error && !service) {
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
            <button 
              onClick={() => navigate('/services')}
              style={{ 
                marginTop: '20px',
                padding: '10px 20px',
                width: '100%'
              }}
              className="btn btn-secondary"
            >
              Retour aux annonces
            </button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        {infoMessage && (
          <div style={{
            marginBottom: '16px',
            padding: '12px',
            backgroundColor: '#e8f8ef',
            border: '1px solid #b7ebc6',
            borderRadius: '8px',
            color: '#1e7e34'
          }}>
            {infoMessage}
          </div>
        )}

        <button 
          onClick={() => navigate('/services')}
          style={{ 
            marginBottom: '20px',
            padding: '8px 16px',
            border: '1px solid #ddd',
            background: '#fff',
            cursor: 'pointer',
            borderRadius: '4px'
          }}
        >
          ← Retour aux annonces
        </button>

        {service && (
          <div style={{ 
            backgroundColor: '#fff', 
            padding: '30px', 
            borderRadius: '8px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            {service.image && (
              <img 
                src={service.image.startsWith('http') ? service.image : `http://localhost:8000${service.image}`}
                alt={service.title}
                style={{
                  width: '100%',
                  height: '400px',
                  objectFit: 'cover',
                  borderRadius: '8px',
                  marginBottom: '20px'
                }}
                onError={(e) => {
                  e.target.style.display = 'none'
                }}
              />
            )}

            <h1 style={{ marginBottom: '15px' }}>{service.title}</h1>

            <div style={{ marginBottom: '20px' }}>
              <span
                style={{
                  display: 'inline-block',
                  backgroundColor: (statusColorMap[service.status] || statusColorMap.PENDING).bg,
                  color: (statusColorMap[service.status] || statusColorMap.PENDING).color,
                  padding: '6px 12px',
                  borderRadius: '16px',
                  fontSize: '13px',
                  fontWeight: '600',
                  marginRight: '8px'
                }}
              >
                Statut : {statusLabelMap[service.status] || service.status}
              </span>
            </div>
            
            {service.category && (
              <span style={{
                display: 'inline-block',
                backgroundColor: '#e0e0e0',
                padding: '6px 16px',
                borderRadius: '16px',
                fontSize: '14px',
                color: '#555',
                marginBottom: '20px'
              }}>
                {service.category.name}
              </span>
            )}

            <div style={{ 
              borderTop: '1px solid #eee',
              borderBottom: '1px solid #eee',
              padding: '15px 0',
              margin: '20px 0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {service.author?.profile_picture && (
                  <img
                    src={
                      service.author.profile_picture.startsWith('http')
                        ? service.author.profile_picture
                        : `http://localhost:8000${service.author.profile_picture}`
                    }
                    alt="Photo de profil"
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      border: '2px solid #eee'
                    }}
                    onError={(e) => {
                      e.target.style.display = 'none'
                    }}
                  />
                )}
                <div>
                  <strong>Proposé par :</strong> {service.author?.firstname} {service.author?.lastname}
                  <br />
                  {service.createdAt && (
                    <small style={{ color: '#888' }}>
                      Publié le {new Date(service.createdAt).toLocaleDateString('fr-FR')}
                    </small>
                  )}
                </div>
              </div>
            </div>

            <div style={{ 
              fontSize: '16px', 
              lineHeight: '1.6',
              marginBottom: '30px',
              whiteSpace: 'pre-wrap'
            }}>
              {service.description}
            </div>

            {isOwner && (
              <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                {service.status === 'IN_PROGRESS' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={handleMarkCompleted}
                    disabled={statusUpdating}
                  >
                    {statusUpdating ? 'Mise à jour...' : 'Marquer comme terminé'}
                  </button>
                )}
                {service.status === 'COMPLETED' && (
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={handleArchiveService}
                    disabled={statusUpdating}
                  >
                    {statusUpdating ? 'Archivage...' : 'Archiver'}
                  </button>
                )}
              </div>
            )}

            {isOwner && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ marginBottom: '12px' }}>
                  Propositions ({service.proposals?.length || 0})
                </h3>

                {!service.proposals || service.proposals.length === 0 ? (
                  <div style={{ color: '#666' }}>Aucune proposition pour le moment.</div>
                ) : (
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {service.proposals.map((proposal) => (
                      <div
                        key={proposal.id}
                        style={{
                          border: '1px solid #eee',
                          borderRadius: '8px',
                          padding: '12px',
                          backgroundColor: proposal.is_accepted ? '#e8f8ef' : '#fff'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                          <div>
                            <div style={{ fontWeight: 600 }}>
                              {proposal.applicant?.firstname} {proposal.applicant?.lastname}
                            </div>
                            {proposal.createdAt && (
                              <small style={{ color: '#888' }}>
                                Envoyée le {new Date(proposal.createdAt).toLocaleDateString('fr-FR')}
                              </small>
                            )}
                          </div>

                          {proposal.is_accepted ? (
                            <span
                              style={{
                                alignSelf: 'start',
                                fontSize: '12px',
                                fontWeight: 700,
                                color: '#1e7e34',
                                background: '#d1f2dd',
                                padding: '4px 8px',
                                borderRadius: '12px'
                              }}
                            >
                              Acceptée
                            </span>
                          ) : (
                            isServiceOpen && (
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                  type="button"
                                  className="btn btn-primary"
                                  style={{ padding: '8px 12px', fontSize: '13px' }}
                                  disabled={acceptingProposalId === proposal.id || rejectingProposalId === proposal.id}
                                  onClick={() => handleAcceptProposal(proposal.id)}
                                >
                                  {acceptingProposalId === proposal.id ? 'Acceptation...' : 'Accepter'}
                                </button>
                                <button
                                  type="button"
                                  className="btn btn-secondary"
                                  style={{ padding: '8px 12px', fontSize: '13px' }}
                                  disabled={rejectingProposalId === proposal.id || acceptingProposalId === proposal.id}
                                  onClick={() => handleRejectProposal(proposal.id)}
                                >
                                  {rejectingProposalId === proposal.id ? 'Refus...' : 'Refuser'}
                                </button>
                              </div>
                            )
                          )}
                        </div>

                        {proposal.message && (
                          <div style={{ marginTop: '10px', color: '#333', whiteSpace: 'pre-wrap' }}>
                            {proposal.message}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {error && (
              <div style={{ 
                padding: '15px', 
                backgroundColor: '#fee', 
                border: '1px solid #fcc',
                borderRadius: '4px',
                color: '#c00',
                marginBottom: '20px'
              }}>
                {error}
              </div>
            )}

            {!showProposalForm ? (
              <button 
                onClick={() => {
                  if (!isServiceOpen) {
                    return
                  }
                  if (!isAuthenticated) {
                    setInfoMessage('Vous devez être connecté pour répondre à cette annonce.')
                    navigate('/login')
                  } else {
                    setShowProposalForm(true)
                  }
                }}
                className="btn btn-primary"
                style={{ 
                  width: '100%',
                  padding: '15px',
                  fontSize: '16px'
                }}
                disabled={!isServiceOpen}
              >
                {!isServiceOpen
                  ? 'Annonce non active'
                  : isAuthenticated
                    ? 'Proposer mes services'
                    : 'Se connecter pour répondre'}
              </button>
            ) : (
              <form onSubmit={handleProposalSubmit}>
                <h3 style={{ marginBottom: '15px' }}>Votre proposition</h3>
                <textarea
                  value={proposalText}
                  onChange={(e) => setProposalText(e.target.value)}
                  placeholder="Décrivez votre proposition..."
                  required
                  rows={6}
                  style={{
                    width: '100%',
                    padding: '12px',
                    borderRadius: '4px',
                    border: '1px solid #ddd',
                    fontSize: '14px',
                    marginBottom: '15px',
                    fontFamily: 'inherit'
                  }}
                />
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button 
                    type="button"
                    onClick={() => setShowProposalForm(false)}
                    className="btn btn-secondary"
                    style={{ flex: 1 }}
                    disabled={submitting}
                  >
                    Annuler
                  </button>
                  <button 
                    type="submit"
                    className="btn btn-primary"
                    style={{ flex: 1 }}
                    disabled={submitting}
                  >
                    {submitting ? 'Envoi...' : 'Envoyer ma proposition'}
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}

export default Service_detail
