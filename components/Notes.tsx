import Link from "next/link";
import { getAllPosts } from "@/lib/notes";

export async function Notes() {
  const posts = (await getAllPosts()).slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="notes-sec" id="notes" data-screen-label="08 Notes">
      <div className="sec-head" data-reveal>
        <div className="idx">
          <b>§07</b> &middot; Field Notes
        </div>
        <div className="title">
          Things I&apos;m <em>thinking</em> about.
        </div>
        <Link href="/notes" className="meta sec-head-link">
          All notes &rarr;
        </Link>
      </div>

      <div className="notes-grid">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/notes/${p.slug}`}
            className="note"
            data-reveal
          >
            <div className="when">{p.date}</div>
            <h3>{p.title}</h3>
            <p>{p.excerpt}</p>
            <div className="foot">
              <span>
                <b>{p.readingMinutes} min</b> read
              </span>
              <span className="arr">&#8599;</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
