import Link from "next/link";

/** Sticky header for every page outside the homepage. */
export function SubpageHeader() {
  return (
    <header className="np-nav">
      <Link href="/" className="np-nav-brand">
        <span className="star" aria-hidden="true">
          &#10022;
        </span>
        Sanchit
      </Link>
      <nav className="np-nav-links" aria-label="Primary">
        <a href="https://sanchit.pro/blog">Writing</a>
        <Link href="/#work">Work</Link>
        <Link href="/contact" className="np-nav-cta">
          Get in touch
        </Link>
      </nav>
    </header>
  );
}
