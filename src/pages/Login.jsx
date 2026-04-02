import '../index.css'
import Form from '../components/Form.jsx'
import Header from '../components/Header'
import Footer from '../components/Footer'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { useAuth } from '../contexts/AuthContext'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuth()

  const loginFields = [
    { name: 'email', type: 'email', placeholder: 'email@example.com', required: true, label: 'E-Mail' },
    { name: 'password', type: showPassword ? 'text' : 'password', placeholder: '••••••••••••', required: true, label: 'Mot de passe' },
  ];

  const handleSubmit = async (values) => {
    setError(null);
    setLoading(true);
    
    try {
      await login(values.email, values.password);
      navigate('/profile');
    } catch (err) {
      setError(err.message || 'Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="form-page">
        <div className="form-container-single">
          <div className="form-header">
            <h1>Connexion</h1>
          </div>
          <div className="form-box">
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
            <Form fields={loginFields} submitLabel={loading ? 'Connexion...' : 'Se connecter'} onSubmit={handleSubmit} />
            
            <div className="form-footer">
              <a href="#" className="forgot-link">Mot de passe oublié?</a>
            </div>

            <div className="form-divider">Nouveau voisin ?</div>

            <button 
              className="btn btn-secondary btn-block"
              onClick={() => navigate('/signup')}
            >
              S'inscrire
            </button>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Login
