export function Endcap() {
  return (
    <section className="endcap" data-screen-label="07 Endcap">
      <h2 data-reveal>
        Let&apos;s
        <br />
        <em>build</em>
        <br />
        something good.
        <br />
        <span className="hl">
          <span className="arr">→</span> Say hi
        </span>
      </h2>
      <div className="endcap-row" data-reveal>
        <div>
          <div style={{ color: "var(--mute)", marginBottom: 6 }}>
            Or take the short route
          </div>
          <b>admin@sanchitpandey.com.np</b> &middot;{" "}
          <span style={{ color: "var(--mute)" }}>
            replies within 24h on weekdays
          </span>
        </div>
        <a className="endcap-cta" href="mailto:admin@sanchitpandey.com.np">
          Get in touch <span>↗</span>
        </a>
      </div>
    </section>
  );
}
