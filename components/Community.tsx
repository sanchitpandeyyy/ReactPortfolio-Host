import Link from "next/link";
import { getCommunityItems } from "@/lib/content";

export async function Community() {
  const community = await getCommunityItems();
  if (community.length === 0) return null;

  return (
    <section className="comm-sec" id="community" data-screen-label="06 Community">
      <div className="sec-head" data-reveal>
        <div className="idx">
          Community
        </div>
        <div className="title">
          Building the <em>scene</em> at home.
        </div>
        <div className="meta">Butwal · Nepal</div>
      </div>

      <div className="bento">
        {community.map((c, i) => (
          <div
            className={i === 0 ? "b-cell b-col7 b-row2" : "b-cell b-col5"}
            data-reveal
            style={{ transitionDelay: `${i * 0.08}s` }}
            key={c.id}
          >
            <article
              className={i === 0 ? "b-tile b-lime comm-feature" : "b-tile"}
            >
              <div className="b-top">
                <span className="b-kicker">{c.role}</span>
                <span className="b-count">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <div className="comm-main">
                <h3 className="comm-org">{c.org}</h3>
                <div className="comm-place">{c.place}</div>
                <p className="comm-body">{c.body}</p>
                {c.slug && (
                  <Link
                    href={`/community/${c.slug}`}
                    className="comm-view"
                    aria-label={`View ${c.org} in detail`}
                  >
                    View <span aria-hidden="true">→</span>
                  </Link>
                )}
              </div>
            </article>
          </div>
        ))}
      </div>
    </section>
  );
}
