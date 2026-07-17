import { getExperiences } from "@/lib/content";

export async function Experience() {
  const experience = await getExperiences();
  if (experience.length === 0) return null;

  return (
    <section
      className="xp-sec"
      id="experience"
      data-screen-label="03 Experience"
    >
      <div className="sec-head" data-reveal>
        <div className="idx">
          Experience
        </div>
        <div className="title">
          Where I&apos;ve <em>worked</em>.
        </div>
        <div className="meta">recent first</div>
      </div>

      <div className="xp-stack">
        {experience.map((x, i) => (
          <article
            className="xp-card"
            style={{ top: `${96 + i * 24}px` }}
            key={x.id}
          >
            <div className="xp-card-in" data-reveal>
              <span className="xp-index" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <div className="xp-period">{x.period}</div>
              <h3 className="xp-role">{x.role}</h3>
              <div className="xp-org">
                {x.org} <span>· {x.place}</span>
              </div>
              <p className="xp-summary">{x.summary}</p>
              {x.tags.length > 0 && (
                <div className="tag-row">
                  {x.tags.map((t) => (
                    <span className="tag" key={t}>
                      {t}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
