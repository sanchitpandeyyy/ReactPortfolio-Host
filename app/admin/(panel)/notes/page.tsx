import Link from "next/link";
import { getAllPosts } from "@/lib/notes";

export const dynamic = "force-dynamic";

export default async function NotesAdmin() {
  const posts = await getAllPosts();
  const totalViews = posts.reduce((sum, p) => sum + p.views, 0);

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Field Notes</div>
        <h1 className="adm-title">
          Notes &amp; <em>blog.</em>
        </h1>
        <p className="adm-sub">
          A read-only view of the blog. Posts are placeholder content for now
          and will be served from an external API later.
        </p>
      </header>

      <div className="adm-section">
        {posts.length} posts · {totalViews.toLocaleString()} total views
      </div>

      <div className="space-y-4">
        {posts.length === 0 && <p className="adm-empty">No posts yet.</p>}
        {posts.map((p) => (
          <div key={p.slug} className="adm-card">
            <div className="adm-card-head">
              <span className="adm-card-title">{p.title}</span>
              <Link
                href={`/notes/${p.slug}`}
                target="_blank"
                className="adm-ghost"
              >
                View &#8599;
              </Link>
            </div>

            <div className="adm-note-row">
              <div className="adm-note-meta">
                <span>
                  <i>Author</i>
                  {p.author}
                </span>
                <span>
                  <i>Published</i>
                  {p.date}
                </span>
                <span>
                  <i>Reading</i>
                  {p.readingMinutes} min
                </span>
                <span>
                  <i>Category</i>
                  {p.category}
                </span>
              </div>
              <span className="adm-views">
                <b>{p.views.toLocaleString()}</b> views
              </span>
            </div>

            {p.tags.length > 0 && (
              <div className="tag-row">
                {p.tags.map((t) => (
                  <span className="tag" key={t}>
                    {t}
                  </span>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
