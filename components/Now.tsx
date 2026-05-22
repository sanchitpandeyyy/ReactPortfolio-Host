import { getWeekItems } from "@/lib/content";

export async function Now() {
  const items = await getWeekItems();
  // Optional section: only renders when there is something to show.
  if (items.length === 0) return null;

  return (
    <section className="now-sec" id="now" data-screen-label="07 Now">
      <div className="sec-head" data-reveal>
        <div className="idx">
          <b>§06</b> &middot; Now
        </div>
        <div className="title">
          What I&apos;m <em>doing</em> this week.
        </div>
        <div className="meta">updated weekly</div>
      </div>

      <div className="bento">
        {items.map((it, i) => (
          <div
            className="b-cell b-col4"
            data-reveal
            style={{ transitionDelay: `${i * 0.07}s` }}
            key={it.id}
          >
            <article className="b-tile">
              <div className="b-top">
                <span className="b-kicker">{it.label}</span>
                <span className="b-count">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="comm-main">
                <h3 className="comm-org">{it.title}</h3>
                {it.detail && <p className="comm-body">{it.detail}</p>}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
