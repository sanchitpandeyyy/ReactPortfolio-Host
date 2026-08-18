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
      
    </section>
  );
}
