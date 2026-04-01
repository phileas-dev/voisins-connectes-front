import '../index.css'
import Header from '../components/Header'

function Home() {
  return (
    <>
      <Header />
      <main>
        <h1>
          <span className="voisins">Voisins</span> <span className="connectes">Connectés</span>
        </h1>
        <p className="subtitle">Votre site pour toutes les petites offre de [ville]</p>
        <p className="description">Échangez avec 1500+ résidents</p>
        
        <div className="button-group">
          <button className="btn btn-primary">S'inscrire</button>
          <button className="btn btn-secondary">Se connecter</button>
        </div>

        <div className="annonce">
          <div style={{ textAlign: 'center' }}>
            <div className="annonce-label">Annonce exemple</div>
            <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              [Image/Contenu]
            </div>
          </div>
        </div>

        <div className="annonce">
          <div style={{ textAlign: 'center' }}>
            <div className="annonce-label">Annonce exemple</div>
            <div style={{ height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              [Image/Contenu]
            </div>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home