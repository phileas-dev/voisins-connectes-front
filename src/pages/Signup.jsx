import '../index.css'
import Form from '../components/Form.jsx'
import Header from '../components/Header'
import { useNavigate } from 'react-router'

function Signup() {
    const navigate = useNavigate()
    const signupFields = [
        { name: 'first_name', type: 'text', placeholder: 'Prénom', required: true, label: 'Prénom' },
        { name: 'last_name', type: 'text', placeholder: 'Nom', required: true, label: 'Nom' },
        { name: 'email', type: 'email', placeholder: 'email@example.com', required: true, label: 'E-Mail' },
        { name: 'mobile', type:'tel', placeholder: '+33 # ## ## ## ##', required: true, label: "Mobile" },
        { name: 'password', type: 'password', placeholder: '••••••••••••', required: true, label: 'Mot de passe' },
        { name: 'confirm_password', type: 'password', placeholder: '••••••••••••', required: true, label: 'Confirmer le mot de passe' },
        { name: 'profile_picture', type: 'file', accept: 'image/*', required: true, label: 'Photo de profil' }
    ];

    const handleSubmit = (values) => {
        console.log('Signup submitted', values);
        alert('Submitted: ' + JSON.stringify(values));
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
                        <Form fields={signupFields} submitLabel="Confirmer" onSubmit={handleSubmit} />
                        
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