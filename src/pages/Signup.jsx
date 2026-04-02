import '../index.css'
import Form from '../components/Form.jsx'
import Header from '../components/Header'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { register } from '../services/api'

function Signup() {
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)
    
    const signupFields = [
        { name: 'firstname', type: 'text', placeholder: 'Prénom', required: true, label: 'Prénom' },
        { name: 'lastname', type: 'text', placeholder: 'Nom', required: true, label: 'Nom' },
        { name: 'email', type: 'email', placeholder: 'email@example.com', required: true, label: 'E-Mail' },
        { name: 'phone_number', type:'tel', placeholder: '+33 # ## ## ## ##', required: true, label: "Mobile" },
        { name: 'password', type: 'password', placeholder: '••••••••••••', required: true, label: 'Mot de passe' },
        { name: 'confirm_password', type: 'password', placeholder: '••••••••••••', required: true, label: 'Confirmer le mot de passe' }
        // Photo de profil temporairement désactivée - sera gérée plus tard
        // { name: 'profile_picture', type: 'file', accept: 'image/*', required: true, label: 'Photo de profil' }
    ];

    const handleSubmit = async (values) => {
        setError(null);
        
        if (values.password !== values.confirm_password) {
            setError('Les mots de passe ne correspondent pas');
            return;
        }
        
        setLoading(true);
        
        try {
            await register(values);
            alert('Inscription réussie ! Vous pouvez maintenant vous connecter.');
            navigate('/login');
        } catch (err) {
            setError(err.message || 'Erreur lors de l\'inscription');
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
                        <h1>Inscription</h1>
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
                        <Form fields={signupFields} submitLabel={loading ? 'Inscription...' : 'Confirmer'} onSubmit={handleSubmit} />
                        
                        <div className="form-divider">Déjà membre ?</div>

                        <button 
                            className="btn btn-secondary btn-block"
                            onClick={() => navigate('/login')}
                        >
                            Se connecter
                        </button>
                    </div>
                </div>
            </main>
        </>
    )
}

export default Signup