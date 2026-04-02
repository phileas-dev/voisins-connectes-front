import { useState } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import useMediaQuery from "../hooks/useMediaQuery";

function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate('/login');
  };

  return (
    <header className="site-header">

      {isMobile ? (
        <div className="mobile-controls">
          <img src="/favicon.svg" alt="Voisins Connectés" className="header-logo" />
          <button
            aria-label="Toggle menu"
            className="burger"
            onClick={() => setOpen((v) => !v)}
          >
            ☰
          </button>
          {open && (
            <nav className="mobile-nav">
              <a href="/">Home</a>
              <a href="/services">Services</a>
              {isAuthenticated ? (
                <>
                  <a href="/profile">Profile</a>
                  <button 
                    onClick={handleLogout}
                    style={{ 
                      background: 'none', 
                      border: 'none', 
                      color: 'inherit',
                      cursor: 'pointer',
                      padding: 0,
                      fontSize: 'inherit'
                    }}
                  >
                    Déconnexion
                  </button>
                </>
              ) : (
                <>
                  <a href="/login">Connexion</a>
                  <a href="/signup">Inscription</a>
                </>
              )}
            </nav>
          )}
        </div>
      ) : (
        <nav className="desktop-nav">
          <img src="/favicon.svg" alt="Voisins Connectés" className="header-logo" />
          <div style={{ display: "flex", gap: "2rem", alignItems: "center" }}>
            <a href="/">Home</a>
            <a href="/services">Services</a>
            {isAuthenticated ? (
              <>
                <a href="/profile">
                  {user ? `${user.firstname} ${user.lastname}` : 'Profile'}
                </a>
                <button 
                  onClick={handleLogout}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    color: 'inherit',
                    cursor: 'pointer',
                    padding: 0,
                    fontSize: 'inherit',
                    textDecoration: 'underline'
                  }}
                >
                  Déconnexion
                </button>
              </>
            ) : (
              <>
                <a href="/login">Connexion</a>
                <a href="/signup">Inscription</a>
              </>
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;