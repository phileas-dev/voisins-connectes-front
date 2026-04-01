import '../index.css'
import Form from '../components/Form.jsx'
import Header from '../components/Header'

function Signup() {
    const loginFields = [
        { name: 'last_name', type: 'text', placeholder: 'DUPONT', required: true, label: 'Nom' },
        { name: 'first_name', type: 'text', placeholder: 'Jean', required: true, label: 'Prénom' },
        { name: 'email', type: 'email', placeholder: 'email@example.com', required: true, label: 'E-mail' },
        { name: 'mobile', type:'tel', placeholder: '## ## ## ## ##', required: true, label: "Mobile" },
        { name: 'password', type: 'password', placeholder: '**********', required: true, label: 'Mot de passe' },
        { name: 'profile_picture', type: 'file', accept: 'image/*', required: true, label: 'Photo de profil' }
    ];

    const handleSubmit = (values) => {
        // Replace with real auth call
        console.log('Signup submitted', values);
        alert('Submitted: ' + JSON.stringify(values));
    };
    return (
    <>
        <Header />
        <h1>Créer un Compte</h1>
        <Form fields={loginFields} submitLabel="Confirmer" onSubmit={handleSubmit} />
    </>
    )
}

export default Signup