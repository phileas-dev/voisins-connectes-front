import '../index.css'
import Header from '../components/Header'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router'
import { createService, getCategories } from '../services/api'

function CreateService() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    category: ''
  })
  const [submitting, setSubmitting] = useState(false)
  const [loadingCategories, setLoadingCategories] = useState(true)
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const data = await getCategories()
        setCategories(Array.isArray(data) ? data : [])
      } catch (err) {
        setError(err.message || 'Erreur lors du chargement des catégories')
      } finally {
        setLoadingCategories(false)
      }
    }

    fetchCategories()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setSubmitting(true)

    try {
      const payload = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        location: formData.location.trim(),
        category: Number(formData.category),
        is_urgent: false
      }

      const created = await createService(payload)
      navigate(`/service/${created.id}`)
    } catch (err) {
      setError(err.message || "Erreur lors de la création de l'annonce")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <>
      <Header />
      <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ marginBottom: '20px' }}>Créer une annonce</h1>

        {error && (
          <div
            style={{
              padding: '12px',
              backgroundColor: '#fee',
              border: '1px solid #fcc',
              borderRadius: '6px',
              color: '#b00020',
              marginBottom: '16px',
              textAlign: 'left'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ textAlign: 'left' }}>
          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="title" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Titre
            </label>
            <input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              placeholder="Ex: Tonte de pelouse"
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="description" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              required
              rows={6}
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              placeholder="Décrivez votre besoin..."
            />
          </div>

          <div style={{ marginBottom: '12px' }}>
            <label htmlFor="location" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Localisation
            </label>
            <input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              placeholder="Ex: Paris 15"
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label htmlFor="category" style={{ display: 'block', marginBottom: '6px', fontWeight: 600 }}>
              Catégorie
            </label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              required
              style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ccc' }}
              disabled={loadingCategories || categories.length === 0}
            >
              <option value="">
                {loadingCategories
                  ? 'Chargement des catégories...'
                  : categories.length === 0
                    ? 'Aucune catégorie disponible'
                    : 'Sélectionnez une catégorie'}
              </option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => navigate('/my-services')}
              disabled={submitting}
              style={{ flex: 1 }}
            >
              Annuler
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting} style={{ flex: 1 }}>
              {submitting ? 'Création...' : "Créer l'annonce"}
            </button>
          </div>
        </form>
      </main>
    </>
  )
}

export default CreateService
