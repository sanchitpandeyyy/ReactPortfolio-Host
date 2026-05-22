"use client";

import { useEffect, useRef } from "react";

function dayOfYear() {
  const d = new Date();
  const start = new Date(d.getFullYear(), 0, 0);
  return Math.floor((d.valueOf() - start.valueOf()) / 86_400_000);
}

function mulberry32(seedInput: number) {
  let seed = seedInput;
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = seed;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4_294_967_296;
  };
}

function CommitBars() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const host = ref.current;
    if (!host) return;
    const rng = mulberry32(dayOfYear() * 17 + 31);
    const vals: number[] = [];
    let peakIdx = 0;
    let peakVal = 0;
    for (let i = 0; i < 28; i++) {
      let v = 0.2 + rng() * 0.7;
      const dow = (i + dayOfYear()) % 7;
      if (dow === 0 || dow === 6) v *= 0.55;
      if (rng() < 0.07) v = 0.05;
      vals.push(v);
      if (v > peakVal) {
        peakVal = v;
        peakIdx = i;
      }
    }
    host.innerHTML = "";
    vals.forEach((v, i) => {
      const b = document.createElement("b");
      b.style.height = `${Math.max(6, v * 100)}%`;
      if (i === peakIdx) b.classList.add("peak");
      host.appendChild(b);
    });
  }, []);

  return <div className="bars" ref={ref} />;
}

function Counter({ to }: { to: number }) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          const start = performance.now();
          const dur = 1500;
          const tick = (t: number) => {
            const p = Math.min(1, (t - start) / dur);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.round(eased * to).toString();
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
          io.disconnect();
        });
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [to]);

  return <span ref={ref}>0</span>;
}

export function Now() {
  return (
    <section className="now-sec" id="now" data-screen-label="04 Now">
      <div className="sec-head" data-reveal>
        <div className="idx">
          <b>§03</b> &middot; Now / Activity
        </div>
        <div className="title">
          What I&apos;m <em>doing</em> this week.
        </div>
        <div className="meta">live · updated daily</div>
      </div>

      <div className="now-grid">
        <div className="panel p-shipping" data-reveal>
          <div className="p-head">
            <span>Shipping</span>
            <b>Hamro Admission v2</b>
          </div>
          <div className="p-title">Reviewer dashboard, behind a flag.</div>
          <div className="bar-track">
            <div className="bar-fill" style={{ width: "62%" }} />
            <div className="bar-handle" style={{ left: "62%" }} />
          </div>
          <div className="milestones">
            <div className="ms done">
              Spec<b>Wk 14</b>
            </div>
            <div className="ms done">
              Build<b>Wk 16</b>
            </div>
            <div className="ms now">
              Cut<b>Wk 18</b>
            </div>
            <div className="ms">
              Ship<b>Wk 20</b>
            </div>
          </div>
        </div>

        <div className="panel p-commits" data-reveal>
          <div className="p-head">
            <span>Commits</span>
            <b>last 28 days</b>
          </div>
          <div className="p-title">Steady hum.</div>
          <CommitBars />
          <div className="scale">
            <span>28d ago</span>
            <span>now</span>
          </div>
        </div>

        <div className="panel p-reading" data-reveal>
          <div className="p-head">
            <span>Reading</span>
            <b>p.214</b>
          </div>
          <div className="cover">
            <div className="title-on">
              Designing Data-Intensive Applications
            </div>
            <div className="author">M. Kleppmann · 2017</div>
          </div>
          <div className="pages">
            on chapter <b>9 — Consistency &amp; Consensus</b>
          </div>
        </div>

        <div className="panel p-listening" data-reveal>
          <div className="p-head">
            <span>Listening</span>
            <b>now</b>
          </div>
          <div className="cover">
            <div className="title-on">Late-night Tabla &amp; Bass</div>
            <div className="artist">Sanchit&apos;s focus mix · 4h 18m</div>
          </div>
          <div className="eq" aria-hidden="true">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
        </div>

        <div className="panel p-vitals" data-reveal>
          <div className="p-head">
            <span>Vitals</span>
            <b>this page</b>
          </div>
          <div className="p-title">It&apos;s fast on purpose.</div>
          <div className="vt-grid">
            <div className="vt">
              <label>TTFB</label>
              <b>
                <Counter to={86} />
                <span className="unit">ms</span>
              </b>
              <div className="sub">edge cache · vercel</div>
            </div>
            <div className="vt">
              <label>LCP</label>
              <b>
                <Counter to={1} />.<Counter to={2} />
                <span className="unit">s</span>
              </b>
              <div className="sub">target &lt; 1.5s</div>
            </div>
            <div className="vt">
              <label>Bundle</label>
              <b>
                <Counter to={42} />
                <span className="unit">kB</span>
              </b>
              <div className="sub">gz · App Router</div>
            </div>
          </div>
        </div>

        <div className="panel p-activity" data-reveal>
          <div className="p-head">
            <span>● Live</span>
            <b>updated 14m ago</b>
          </div>
          <div className="p-title">
            Pushing reviewer-dashboard polish to{" "}
            <span style={{ color: "var(--lime)" }}>
              hamro-admission/web
            </span>
            .
          </div>
          <div className="pulse-row">
            <span className="pulse" aria-hidden="true" />
            <span>42 files changed · +1,204 / -312</span>
          </div>
        </div>
      </div>
    </section>
  );
}
