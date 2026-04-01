import { useState } from "react";
import useMediaQuery from "../hooks/useMediaQuery";

function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  const [open, setOpen] = useState(false);

  return (
    <header className="site-header">

      {isMobile ? (
        <div className="mobile-controls">
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
          <a href="/">Home</a>
          <a href="/services">Services</a>
          <a href="/profile">Profile</a>
        </nav>
      )}
    </header>
  );
}

export default Header;