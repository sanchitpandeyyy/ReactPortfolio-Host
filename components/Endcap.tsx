import Link from "next/link";

export function Endcap() {
  return (
    <section className="endcap" data-screen-label="10 Endcap">
      <h2 data-reveal>
        Let&apos;s
        <br />
        <em>build</em>
        <br />
        something good.
        <br />
        <Link href="/contact" className="hl">
          <span className="arr">→</span> Say hi
        </Link>
      </h2>
      <div className="endcap-row" data-reveal>
        <div>
          <div style={{ color: "var(--mute)", marginBottom: 6 }}>
            Or take the short route
          </div>
          <b>mail@sanchit.pro</b> &middot;{" "}
          <span style={{ color: "var(--mute)" }}>
            replies within 24h on weekdays
          </span>
        </div>
        <Link className="endcap-cta" href="/contact">
          Get in touch <span>↗</span>
        </Link>
      </div>
    </section>
  );
}
