function Footer() {
  const year = new Date().getFullYear()

  return (
    <footer className="site-footer">
      <p>© {year} L&apos;atelier L.E. — Tous droits réservés.</p>
    </footer>
  )
}

export default Footer

