import '../index.css'
import Form from '../components/Form.jsx'
import Header from '../components/Header'

function Login() {
  const loginFields = [
    { name: 'email', type: 'email', placeholder: 'email@example.com', required: true, label: 'E-mail' },
    { name: 'password', type: 'password', placeholder: '**********', required: true, label: 'Mot de passe' },
  ];

  const handleSubmit = (values) => {
    // Replace with real auth call
    console.log('Login submitted', values);
    alert('Submitted: ' + JSON.stringify(values));
  };

  return (
    <>
      <Header />
      <h1>Se Connecter</h1>
      <Form fields={loginFields} submitLabel="Se connecter" onSubmit={handleSubmit} />
    </>
  )
}

export default Login