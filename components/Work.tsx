"use client";

import { useEffect, useRef } from "react";
import { projects } from "@/lib/projects";

export function Work() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const railRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLSpanElement>(null);
  const numRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const rail = railRef.current;
    if (!section || !rail) return;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const cards = rail.querySelectorAll(".card").length || 5;
    let distance = 0;
    let rafId = 0;

    const calc = () => {
      distance = Math.max(0, rail.scrollWidth - window.innerWidth);
    };
    calc();

    const onScroll = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        const rect = section.getBoundingClientRect();
        const total = rect.height - window.innerHeight;
        const traveled = Math.min(Math.max(-rect.top, 0), total);
        const progress = total > 0 ? traveled / total : 0;
        rail.style.transform = `translate3d(${-progress * distance}px, 0, 0)`;
        if (progressRef.current) {
          progressRef.current.style.transform = `scaleX(${progress})`;
        }
        if (numRef.current) {
          const n = Math.min(cards, Math.max(1, Math.ceil(progress * cards)));
          numRef.current.textContent = String(n).padStart(2, "0");
        }
      });
    };

    if (!reduced) {
      // make section tall enough to scrub through the rail
      section.style.height = `${distance + window.innerHeight}px`;
      const inner = section.querySelector(".work") as HTMLElement | null;
      if (inner) {
        inner.style.position = "sticky";
        inner.style.top = "0";
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", () => {
      calc();
      if (!reduced) section.style.height = `${distance + window.innerHeight}px`;
      onScroll();
    });
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      className="work-sec"
      id="work"
      data-screen-label="03 Work"
      ref={sectionRef}
    >
      <div className="work-head" data-reveal>
        <div className="sec-head">
          <div className="idx">
            <b>§02</b> &middot; Selected Work
          </div>
          <div className="title">
            Things I&apos;ve <em>shipped</em>, recent first.
          </div>
          <div className="meta">
            05 of 12 on file · 2023 → 2026
          </div>
        </div>
      </div>

      <div className="work">
        <div className="work-rail" ref={railRef}>
          {projects.map((p) => (
            <article key={p.num} className={`card k-${p.variant}`}>
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
                  href={p.href}
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
            <b>§02</b> · Work
          </span>
          <div className="track">
            <i ref={progressRef} />
          </div>
          <span>
            <span ref={numRef}>01</span> / 05
          </span>
        </div>
      </div>
    </section>
  );
}
