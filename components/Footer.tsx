export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="sf-top">
        <div className="sf-brand">
          <span className="star" aria-hidden="true">
            &#10022;
          </span>
          Sanchit Pandey
        </div>
        <a
          className="endcap-cta sf-cta"
          href="mailto:mail@sanchit.pro"
        >
          Get in touch <span aria-hidden="true">&#8599;</span>
        </a>
        <h2 className="sf-line">
          Thanks for <em>stopping by.</em>
        </h2>
      </div>

      <div className="sf-cols">
        <div className="col">
          <label>Direct</label>
          <a href="mailto:mail@sanchit.pro">
            mail@sanchit.pro <span className="arr">↗</span>
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
      </div>

      <div className="sf-bottom">
        <span>&copy; {new Date().getFullYear()} Sanchit Pandey</span>
      </div>
    </footer>
  );
}