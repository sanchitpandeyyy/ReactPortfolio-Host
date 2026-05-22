"use client";

import { useEffect, useRef } from "react";
import type { Project } from "@prisma/client";

export function WorkRail({ projects }: { projects: Project[] }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    const head = section.querySelector<HTMLElement>(".work-head");
    const inner = section.querySelector<HTMLElement>(".work");
    const cardCount = rail.querySelectorAll(".card").length || 1;

    // Reduced motion: skip the pinned scrub, let the rail scroll horizontally.
    if (reduced) {
      if (inner) inner.style.overflowX = "auto";
      return;
    }

    if (inner) {
      inner.style.position = "sticky";
      inner.style.top = "0";
    }

    let distance = 0;
    let headH = 0;
    let rafId = 0;

    const calc = () => {
      distance = Math.max(0, rail.scrollWidth - window.innerWidth);
      headH = head ? head.offsetHeight : 0;
      section.style.height = `${headH + distance + window.innerHeight}px`;
    };

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const top = section.getBoundingClientRect().top;
        const scrolled = Math.min(Math.max(-top - headH, 0), distance);
        const progress = distance > 0 ? scrolled / distance : 0;
        rail.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }
        if (numRef.current) {
          const n = Math.min(
            cardCount,
            Math.max(1, Math.ceil(progress * cardCount)),
          );
          numRef.current.textContent = String(n).padStart(2, "0");
        }
      });
    };

    const onResize = () => {
      calc();
      onScroll();
    };

    calc();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    onScroll();

    document.fonts?.ready.then(() => {
      calc();
      onScroll();
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, [projects.length]);

  const count = String(projects.length).padStart(2, "0");

  return (
    <section
      className="work-sec"
      id="work"
      data-screen-label="05 Work"
      ref={sectionRef}
    >
      <div className="work-head" data-reveal>
        <div className="sec-head">
          <div className="idx">
            <b>§04</b> &middot; Selected Work
          </div>
          <div className="title">
            Things I&apos;ve <em>shipped</em>, recent first.
          </div>
          <div className="meta">{count} on file</div>
        </div>
      </div>

      <div className="work">
        <div className="work-rail" ref={railRef}>
          {projects.map((p) => (
            <article key={p.id} className={`card k-${p.variant}`}>
              {(p.variant === "feat" || p.variant === "sq") && (
                <div className="blob" aria-hidden="true" />
              )}
              <div className="num-row">
                <b>{p.num}</b>
                <span>{p.year}</span>
              </div>
              <h3 className="title">
                {p.title}
                {p.titleEm && (
                  <>
                    {" "}
                    <em>{p.titleEm}</em>
                  </>
                )}
                {p.titleSuffix}
              </h3>
              <p className="desc">{p.desc}</p>
              <div className="foot">
                <div className="stack">
                  <b>{p.stackBold}</b>
                  {p.stackRest && (
                    <>
                      <br />
                      {p.stackRest}
                    </>
                  )}
                </div>
                <a
                  href={p.href || "#"}
                  className="arr"
                  aria-label={`Open ${p.title} case study`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ↗
                </a>
              </div>
            </article>
          ))}
        </div>

        <div className="pin-progress" aria-hidden="true">
          <span>
            <b>§04</b> · Work
          </span>
          <div className="track">
            <i ref={progressRef} />
          </div>
          <span>
            <span ref={numRef}>01</span> / {count}
          </span>
        </div>
      </div>
    </section>
  );
}
