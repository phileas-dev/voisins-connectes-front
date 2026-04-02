import '../index.css'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useAuth } from '../contexts/AuthContext'
import { useEffect, useState } from 'react'
import { updateCurrentUser, uploadCurrentUserAvatar } from '../services/api'

function Profile() {
  const { user, loading, refreshUser } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [error, setError] = useState(null)
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    phone_number: ''
  })

  useEffect(() => {
    if (!user) return
    setFormData({
      firstname: user.firstname || '',
      lastname: user.lastname || '',
      phone_number: user.phone_number || ''
    })
  }, [user])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    setError(null)
    setSaving(true)
    try {
      await updateCurrentUser({
        firstname: formData.firstname.trim(),
        lastname: formData.lastname.trim(),
        phone_number: formData.phone_number.trim()
      })
      await refreshUser()
      setIsEditing(false)
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour du profil')
    } finally {
      setSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setFormData({
      firstname: user?.firstname || '',
      lastname: user?.lastname || '',
      phone_number: user?.phone_number || ''
    })
    setError(null)
    setIsEditing(false)
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)
    setUploadingAvatar(true)
    try {
      await uploadCurrentUserAvatar(file)
      await refreshUser()
    } catch (err) {
      setError(err.message || 'Erreur lors de la mise à jour de la photo de profil')
    } finally {
      setUploadingAvatar(false)
      e.target.value = ''
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

  if (!user) {
    return (
      <>
        <Header />
        <main className="form-page">
          <div className="form-container-single">
            <p style={{ textAlign: 'center', padding: '20px' }}>Aucun utilisateur trouvé</p>
          </div>
        </main>
        <Footer />
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
                {error && (
                  <div style={{
                    padding: '10px',
                    marginBottom: '15px',
                    backgroundColor: '#fee',
                    border: '1px solid #fcc',
                    borderRadius: '4px',
                    color: '#c00'
                  }}>
                    {error}
                  </div>
                )}

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
                    <div style={{ marginTop: '12px' }}>
                      <label
                        htmlFor="avatar-upload"
                        className="btn btn-secondary"
                        style={{
                          display: 'inline-block',
                          cursor: uploadingAvatar ? 'not-allowed' : 'pointer',
                          opacity: uploadingAvatar ? 0.7 : 1
                        }}
                      >
                        {uploadingAvatar ? 'Envoi...' : 'Changer la photo'}
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        disabled={uploadingAvatar}
                        style={{ display: 'none' }}
                      />
                    </div>
                  </div>
                )}
                
                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                    Prénom
                  </label>
                  {isEditing ? (
                    <input
                      name="firstname"
                      value={formData.firstname}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  ) : (
                    <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                      {user.firstname || '-'}
                    </div>
                  )}
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ fontWeight: 'bold', display: 'block', marginBottom: '5px' }}>
                    Nom
                  </label>
                  {isEditing ? (
                    <input
                      name="lastname"
                      value={formData.lastname}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  ) : (
                    <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                      {user.lastname || '-'}
                    </div>
                  )}
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
                  {isEditing ? (
                    <input
                      name="phone_number"
                      value={formData.phone_number}
                      onChange={handleChange}
                      style={{ width: '100%', padding: '10px', borderRadius: '4px', border: '1px solid #ccc' }}
                    />
                  ) : (
                    <div style={{ padding: '10px', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                      {user.phone_number || user.mobile || '-'}
                    </div>
                  )}
                </div>

                <div style={{ marginTop: '30px', display: 'flex', gap: '10px' }}>
                  {isEditing ? (
                    <>
                      <button
                        className="btn btn-secondary"
                        onClick={handleCancelEdit}
                        style={{ flex: 1 }}
                        disabled={saving}
                      >
                        Annuler
                      </button>
                      <button
                        className="btn btn-primary"
                        onClick={handleSave}
                        style={{ flex: 1 }}
                        disabled={saving}
                      >
                        {saving ? 'Enregistrement...' : 'Enregistrer'}
                      </button>
                    </>
                  ) : (
                    <button
                      className="btn btn-secondary"
                      onClick={() => setIsEditing(true)}
                      style={{ flex: 1 }}
                    >
                      Modifier mon profil
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Profile
