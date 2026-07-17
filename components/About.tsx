"use client";

import { useEffect, useRef } from "react";

function useCounter(target: number) {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const start = performance.now();
          const dur = 1800;
          const step = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * target).toLocaleString();
            if (p < 1) requestAnimationFrame(step);
          };
          requestAnimationFrame(step);
          io.disconnect();
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [target]);

  return ref;
}

function Counter({ value }: { value: number }) {
  const ref = useCounter(value);
  return <b ref={ref}>0</b>;
}

export function About() {
  return (
    <section className="about" id="about" data-screen-label="02 About">
      <div className="sec-head" data-reveal>
        <div className="idx">
          Operating Theory
        </div>
        <div className="title">
          About <em>in three breaths.</em>
        </div>
        <div className="meta">2021 → ongoing</div>
      </div>

      <div className="about-grid">
        <aside className="about-side" data-reveal>
          <div className="big">
            5<em>yrs</em>
          </div>
          shipping software
          <br />
          from a small desk
          <br />
          in Nepal.
        </aside>

        <div>
          <p className="about-body" data-reveal>
            I write software the way a <em>monk</em> stacks stones, one
            careful, <span className="strike">over-engineered</span> deliberate
            decision at a time, until a system feels{" "}
            <span className="mark">inevitable</span>.
          </p>

          <div className="about-foot">
            <div className="col" data-reveal>
              <label>What I do</label>
              <b>Full-stack web apps</b>, modern e-commerce platforms,
              WordPress plugin toolkits, community tooling, and infrastructure
              that doesn&apos;t fall over at 03:00.
            </div>
            <div className="col" data-reveal>
              <label>How I work</label>
              Tiny teams, sharp briefs, weekly demos.{" "}
              <b>Type-safe end-to-end</b>. Tests that read like prose.
              Documentation as a first-class deliverable, not a chore.
            </div>
            <div className="col" data-reveal>
              <label>Currently</label>
              President at <b>CSIT Association · BMC</b>. Organizer at{" "}
              <b>WordCamp Nepal</b>. Open to selected contracts and full-time
              roles across APAC.
            </div>
          </div>

          <div className="about-stats">
            <div className="stat" data-reveal>
              <label>Projects shipped</label>
              <Counter value={24} />
              <span className="unit">+</span>
            </div>
            <div className="stat" data-reveal>
              <label>Events organized</label>
              <Counter value={12} />
              <span className="unit">/yr</span>
            </div>
            <div className="stat" data-reveal>
              <label>Talks given</label>
              <Counter value={11} />
              <span className="unit">/yr</span>
            </div>
            <div className="stat" data-reveal>
              <label>Coffee/day</label>
              <Counter value={3} />
              <span className="unit">cups</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
