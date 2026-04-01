import { useState } from "react";
import useMediaQuery from "../hooks/useMediaQuery";

function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);

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
              <a href="/profile">Profile</a>
            </nav>
          )}
        </div>
      ) : (
        <nav className="desktop-nav">
          <img src="/favicon.svg" alt="Voisins Connectés" className="header-logo" />
          <div style={{ display: "flex", gap: "2rem" }}>
            <a href="/">Home</a>
            <a href="/services">Services</a>
            <a href="/profile">Profile</a>
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;