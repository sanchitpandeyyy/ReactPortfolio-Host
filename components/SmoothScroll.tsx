"use client";

import { useEffect } from "react";

/**
 * Reveal-on-scroll animations.
 *
 * Scrolling itself is left to the browser: native smooth scrolling (set on
 * `html` in the stylesheet) always works, respects `scroll-margin-top` on
 * headings, and never swallows wheel events — unlike a JS scroll engine.
 */
export function SmoothScroll() {
  useEffect(() => {
    // Reveal animations via IntersectionObserver
    const revealEls = document.querySelectorAll<HTMLElement>("[data-reveal]");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("in");
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" },
    );
    revealEls.forEach((el) => io.observe(el));

    // Safety: force reveal after 3.5s if anything fails
    const safety = setTimeout(() => {
      revealEls.forEach((el) => el.classList.add("in"));
    }, 3500);

    return () => {
      io.disconnect();
      clearTimeout(safety);
    };
  }, []);

  return null;
}