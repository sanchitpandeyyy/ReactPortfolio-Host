const languages = [
  "TypeScript",
  "JavaScript",
  "Next.js",
  "React",
  "Node.js",
  "PHP",
  "React Native",
];
const backend = [
  "PostgreSQL",
  "Prisma",
  "MongoDB",
  "REST APIs",
  "WordPress",
  "Auth.js",
];
const tooling = [
  "Tailwind CSS",
  "Figma",
  "Photoshop",
  "Vercel",
  "Cloudflare",
  "Docker",
  "Git",
];

function Tags({ items }: { items: string[] }) {
  return (
    <div className="tag-row">
      {items.map((s) => (
        <span className="tag" key={s}>
          {s}
        </span>
      ))}
    </div>
  );
}

export function Skills() {
  return (
    <section className="skills-sec" id="skills" data-screen-label="04 Skills">
      <div className="sec-head" data-reveal>
        <div className="idx">
          <b>§03</b> &middot; Toolkit
        </div>
        <div className="title">
          What I <em>build</em> with.
        </div>
        <div className="meta">stack · 2026</div>
      </div>

      <div className="bento">
        <div className="b-cell b-col7 b-row2" data-reveal>
          <article className="b-tile b-ink">
            <div className="b-top">
              <span className="b-kicker">A / Languages &amp; Frameworks</span>
              <span className="b-count">
                {String(languages.length).padStart(2, "0")}
              </span>
            </div>
            <div className="b-fill">
              <Tags items={languages} />
            </div>
            <p className="b-note">
              The day to day. Typed front to back, with React on both ends of
              the wire.
            </p>
          </article>
        </div>

        <div
          className="b-cell b-col5"
          data-reveal
          style={{ transitionDelay: "0.08s" }}
        >
          <article className="b-tile">
            <div className="b-top">
              <span className="b-kicker">B / Data &amp; Backend</span>
              <span className="b-count">
                {String(backend.length).padStart(2, "0")}
              </span>
            </div>
            <div className="b-fill">
              <Tags items={backend} />
            </div>
            <p className="b-note">
              Where the data lives. Relational by default, documents when they
              earn it.
            </p>
          </article>
        </div>

        <div
          className="b-cell b-col5"
          data-reveal
          style={{ transitionDelay: "0.16s" }}
        >
          <article className="b-tile b-lime">
            <div className="b-top">
              <span className="b-kicker">C / Design &amp; Tooling</span>
              <span className="b-count">
                {String(tooling.length).padStart(2, "0")}
              </span>
            </div>
            <div className="b-fill">
              <Tags items={tooling} />
            </div>
            <p className="b-note">
              Shaping and shipping. Designed in Figma, deployed on the edge.
            </p>
          </article>
        </div>

        <div
          className="b-cell b-col12"
          data-reveal
          style={{ transitionDelay: "0.24s" }}
        >
          <article className="b-tile b-statement">
            <p className="b-big">
              Small stack. <em>Strict types.</em> Infrastructure that stays
              boring.
            </p>
            <span className="b-kicker">Operating principle</span>
          </article>
        </div>
      </div>
    </section>
  );
}
