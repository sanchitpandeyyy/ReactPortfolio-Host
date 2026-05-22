import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/notes";

export const metadata: Metadata = {
  title: "Notes · Sanchit Pandey",
  description:
    "Essays and working notes on building software, running communities, and shipping from Nepal.",
};

export default async function NotesIndex() {
  const posts = await getAllPosts();

  return (
    <section className="np">
      <header className="np-head" data-reveal>
        <div className="np-eyebrow">Field Notes</div>
        <h1 className="np-title">
          Notes &amp; <em>working thoughts.</em>
        </h1>
        <p className="np-sub">
          Short writing on building software, running communities, and shipping
          from a small studio in Butwal, Nepal.
        </p>
      </header>

      <div className="np-list">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/notes/${p.slug}`}
            className="np-row"
            data-reveal
          >
            <div className="np-row-top">
              <span>{p.category}</span>
              <span>{p.date}</span>
              <span>{p.readingMinutes} min read</span>
            </div>
            <h2 className="np-row-title">{p.title}</h2>
            <p className="np-row-excerpt">{p.excerpt}</p>
            <div className="np-row-foot">
              <span className="np-row-author">By {p.author}</span>
              <span className="np-row-arrow" aria-hidden="true">
                &rarr;
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
