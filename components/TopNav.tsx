"use client";

import { useEffect, useRef, useState } from "react";

const links = [
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#work", label: "Work" },
  { href: "#community", label: "Community" },
  { href: "#notes", label: "Writing" },
];

/**
 * Fixed pill nav. On mobile the links collapse into a full-screen white
 * overlay opened by the hamburger. The overlay is a SIBLING of the pill,
 * not a child: the pill's backdrop-filter would otherwise turn the
 * overlay's fixed positioning into a pill-sized box.
 */
export function TopNav() {
  const [open, setOpen] = useState(false);
  const pillRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  // Close on Escape or when tapping outside the pill and overlay.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onPointer = (e: PointerEvent) => {
      const t = e.target as Node;
      if (!pillRef.current?.contains(t) && !overlayRef.current?.contains(t)) {
        setOpen(false);
      }
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [open]);

  // Lock the page behind the overlay while it is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const close = () => setOpen(false);

  return (
    <>
      <nav
        ref={pillRef}
        className={open ? "topnav open" : "topnav"}
        aria-label="Primary"
      >
        <a href="#hero" className="brand-mark" onClick={close}>
          <span className="star">✦</span> Sanchit
        </a>

        <div className="topnav-links">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="link"
              onClick={close}
            >
              {link.label}
            </a>
          ))}
          <a href="/contact" className="cta" onClick={close}>
            Get in touch <span className="arr">↗</span>
          </a>
        </div>

        <button
          type="button"
          className="nav-toggle"
          aria-expanded={open}
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>
      </nav>

      <div
        ref={overlayRef}
        className={open ? "topnav-overlay open" : "topnav-overlay"}
        aria-hidden={!open}
      >
        {links.map((link) => (
          <a
            key={link.href}
            href={link.href}
            className="link"
            onClick={close}
          >
            {link.label}
          </a>
        ))}
        <a href="/contact" className="cta" onClick={close}>
          Get in touch <span className="arr">↗</span>
        </a>
      </div>
    </>
  );
}