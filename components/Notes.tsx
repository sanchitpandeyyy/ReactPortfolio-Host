import { notes } from "@/lib/projects";

export function Notes() {
  return (
    <section className="notes-sec" id="notes" data-screen-label="05 Notes">
      <div className="sec-head" data-reveal>
        <div className="idx">
          <b>§04</b> &middot; Field Notes
        </div>
        <div className="title">
          Things I&apos;m <em>thinking</em> about.
        </div>
        <div className="meta">prose · monthly-ish</div>
      </div>

      <div className="notes-grid">
        {notes.map((n) => (
          <article key={n.when} className="note" data-reveal>
            <div className="when">{n.when}</div>
            <h3>
              {n.title}
              {n.titleEm && (
                <>
                  {" "}
                  <em>{n.titleEm}</em>
                </>
              )}
              {n.titleSuffix}
            </h3>
            <p>{n.body}</p>
            <div className="foot">
              <span>
                <b>{n.minutes} min</b> read
              </span>
              <span className="arr">↗</span>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
