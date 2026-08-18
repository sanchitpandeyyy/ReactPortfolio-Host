"use client";

import { useEffect, useState } from "react";

/** Floating "back to top" button, shown once the page is scrolled. */
export function BackToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const go = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <button
      type="button"
      className={`btt${visible ? " btt-show" : ""}`}
      onClick={go}
      aria-label="Back to top"
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M8 13.5v-11M3.5 7 8 2.5 12.5 7" />
      </svg>
    </button>
  );
}