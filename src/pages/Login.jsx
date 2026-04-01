import '../index.css'
import Form from '../components/Form.jsx'
import Header from '../components/Header'
import { useState } from 'react'
import { useNavigate } from 'react-router'

function Login() {
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const loginFields = [
    { name: 'email', type: 'email', placeholder: 'email@example.com', required: true, label: 'E-Mail' },
    { name: 'password', type: showPassword ? 'text' : 'password', placeholder: '••••••••••••', required: true, label: 'Mot de passe' },
  ];

  const handleSubmit = (values) => {
    console.log('Login submitted', values);
    alert('Submitted: ' + JSON.stringify(values));
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
            <Form fields={loginFields} submitLabel="Se connecter" onSubmit={handleSubmit} />
            
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
    </>
  )
}

export default Login