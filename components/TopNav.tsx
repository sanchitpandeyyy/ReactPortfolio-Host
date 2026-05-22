export function TopNav() {
  return (
    <nav className="topnav" aria-label="Primary">
      <a href="#hero" className="brand-mark">
        <span className="star">✦</span> Sanchit
      </a>
      <a href="#about" className="link">
        About
      </a>
      <a href="#work" className="link">
        Work
      </a>
      <a href="#now" className="link">
        Now
      </a>
      <a href="#notes" className="link">
        Notes
      </a>
      <a href="#terminal" className="cta">
        Get in touch <span className="arr">↗</span>
      </a>
    </nav>
  );
}
