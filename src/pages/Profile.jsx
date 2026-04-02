import '../index.css'
import Header from '../components/Header'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

function Profile() {
  const navigate = useNavigate()
  const { user, logout, loading } = useAuth()

  const handleLogout = () => {
    logout()
    navigate('/login')
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
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Header />
        <main className="form-page">
          <div className="form-container-single">
            <p style={{ textAlign: 'center', padding: '20px' }}>Aucun utilisateur trouvé</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Header />
      <main className="form-page">
        <div className="form-container-single">
          <div className="form-header">
            <h1>Votre Profil</h1>
          </div>
          <div className="form-box">
            {user && (
              <div style={{ padding: '20px' }}>
                {user.profile_picture && (
                  <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <img 
                      src={user.profile_picture.startsWith('http') ? user.profile_picture : `http://localhost:8000${user.profile_picture}`}
                      alt="Photo de profil" 
                      style={{ 
                        width: '120px', 
                        height: '120px', 
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid #ddd'
                      }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/120?text=Avatar'
                      }}
                    />
                  </div>
                )}
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                    Prénom
                  </label>
                  <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    {user.firstname || '-'}
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                    Nom
                  </label>
                  <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    {user.lastname || '-'}
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                    Email
                  </label>
                  <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    {user.email || '-'}
                  </div>
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                    Mobile
                  </label>
                  <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                    {user.phone_number || user.mobile || '-'}
                  </div>
                </div>

                <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => navigate('/')}
                    style={{ flex: 1 }}
                  >
                    Retour à l'accueil
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={handleLogout}
                    style={{ flex: 1 }}
                  >
                    Se déconnecter
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}

export default Profile