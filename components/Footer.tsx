export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="col">
        <label>Direct</label>
        <a href="mailto:admin@sanchitpandey.com.np">
          admin@sanchitpandey.com.np <span className="arr">↗</span>
        </a>
        <a href="tel:+9779841148149">
          +977 9841148149 <span className="arr">↗</span>
        </a>
        <a href="https://sanchit.pro" target="_blank" rel="noopener noreferrer">
          sanchit.pro <span className="arr">↗</span>
        </a>
      </div>
      <div className="col">
        <label>Elsewhere</label>
        <a
          href="https://github.com/sanchitpandeyyy"
          target="_blank"
          rel="noopener noreferrer"
        >
          github.com/sanchitpandeyyy <span className="arr">↗</span>
        </a>
        <a
          href="https://www.linkedin.com/in/sanchitpandeyyy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          linkedin.com/in/sanchitpandeyyy <span className="arr">↗</span>
        </a>
        <a
          href="https://www.instagram.com/sanchitpandeyyy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          instagram.com/sanchitpandeyyy <span className="arr">↗</span>
        </a>
        <a
          href="https://www.facebook.com/sanchitpandeyyy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          facebook.com/sanchitpandeyyy <span className="arr">↗</span>
        </a>
      </div>
      <div className="col">
        <label>Colophon</label>
        <span>
          Set in <b style={{ color: "var(--ink)" }}>Bricolage Grotesque</b>,
          Geist &amp; JetBrains Mono.
        </span>
        <br />
        <br />
        <span>Built with Next.js 15, React 19, GSAP, Lenis and quiet kitchens.</span>
        <br />
        <br />
        <span>
          © <b style={{ color: "var(--ink)" }}>MMXXVI</b> — Sanchit Pandey ·
          Butwal, Rupandehi (UTC+5:45).
        </span>
      </div>
    </footer>
  );
}
