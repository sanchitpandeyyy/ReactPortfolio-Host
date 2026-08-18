"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blog/content";

/**
 * In-page navigation for longer articles, rendered as a sticky rail.
 * The active section is tracked with a scroll-spy; the plain anchors
 * still work without JavaScript.
 */
export function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = headings
      .map((heading) => document.getElementById(heading.id))
      .filter((el): el is HTMLElement => Boolean(el));
    if (els.length === 0) return;

    let frame = 0;
    const pick = () => {
      const marker = window.scrollY + window.innerHeight * 0.32;
      let current: string | null = null;
      for (const el of els) {
        if (el.getBoundingClientRect().top + window.scrollY <= marker) {
          current = el.id;
        } else {
          break;
        }
      }
      setActive(current);
    };
    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(pick);
    };

    pick();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, [headings]);

  return (
    <nav className="bl-toc" aria-labelledby="bl-toc-label">
      <h2 className="bl-toc-label" id="bl-toc-label">
        On this page
      </h2>
      <ol className="bl-toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "bl-toc-sub" : undefined}
          >
            <a
              href={`#${heading.id}`}
              className={active === heading.id ? "active" : undefined}
              aria-current={active === heading.id ? "true" : undefined}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}