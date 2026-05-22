import Link from "next/link";

export function NotesHeader() {
  return (
    <header className="np-nav">
      <Link href="/" className="np-nav-brand">
        <span className="star" aria-hidden="true">
          &#10022;
        </span>
        Sanchit
      </Link>
      <nav className="np-nav-links">
        <Link href="/notes">Notes</Link>
        <Link href="/#work">Work</Link>
        <Link href="/#terminal" className="np-nav-cta">
          Get in touch
        </Link>
      </nav>
    </header>
  );
}
