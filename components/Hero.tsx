"use client";

import { useEffect, useRef, useState } from "react";

const VERBS = ["ships", "designs", "writes", "teaches", "organises"];

export function Hero() {
  const verbRef = useRef<HTMLSpanElement>(null);
  const [verbIndex, setVerbIndex] = useState(0);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = verbRef.current;
    if (!el) return;

    const paint = (word: string) => {
      el.innerHTML = "";
      [...word].forEach((c, idx) => {
        const span = document.createElement("span");
        span.className = "ch";
        span.style.transitionDelay = `${idx * 22}ms`;
        span.textContent = c;
        el.appendChild(span);
      });
      requestAnimationFrame(() =>
        requestAnimationFrame(() => el.classList.add("in")),
      );
    };

    paint(VERBS[verbIndex]);
    el.classList.add("in");

    if (reduced) return;

    const timer = setTimeout(() => {
      el.classList.remove("in");
      el.classList.add("out");
      setTimeout(() => {
        el.classList.remove("out");
        setVerbIndex((i) => (i + 1) % VERBS.length);
      }, 500);
    }, 1900);

    return () => clearTimeout(timer);
  }, [verbIndex]);

  return (
    <section className="hero" id="hero" data-screen-label="01 Hero">
      <h1
        className="hero-headline"
        aria-label="Sanchit, a one-person studio that ships software."
      >
        <span className="row" data-hero-line>
          <span className="word" data-word>
            Sanchit<em>.</em>
          </span>
        </span>
        <span className="row row-2" data-hero-line>
          <span className="word" data-word>
            a one-person studio that
          </span>
        </span>
        <span className="row" data-hero-line>
          <span className="word" data-word>
            <span className="verb-wrap">
              <span className="bracket">[</span>
              <span className="verb" id="verb" ref={verbRef} aria-live="polite">
                ships
              </span>
              <span className="bracket">]</span>
            </span>
            &nbsp;software<em>.</em>
          </span>
        </span>
      </h1>

      <div className="hero-foot" data-reveal>
        <p className="hero-blurb">
          <b>Full-stack developer</b> from Butwal, Nepal. I build{" "}
          <span className="mark">web apps</span>, e-commerce stores, and
          community tools. Currently president of the CSIT Association at BMC,
          and helping organize WordCamp Nepal.
        </p>

        <div className="meta-block" aria-label="Now">
          <div className="row">
            <span className="label">Now</span>
            <b>
              Shipping <span style={{ color: "var(--lime-deep)" }}>●</span>{" "}
              Hamro Admission
            </b>
          </div>
          <div className="row">
            <span className="label">Stack</span>
            <b>Next.js · TypeScript · Prisma · Postgres</b>
          </div>
          <div className="row">
            <span className="label">Based</span>
            <b>Butwal · Rupandehi, NP</b>
          </div>
        </div>
      </div>
    </section>
  );
}
