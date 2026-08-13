import Link from "next/link";
import { getPosts } from "@/lib/blog/client";
import { BLOG_HOME_LABEL } from "@/lib/blog/config";
import { categoryLabel, formatDate, readingLabel } from "@/lib/blog/format";
import { BLOG_ORIGIN } from "@/lib/site";

export const dynamic = "force-dynamic";

/**
 * Read-only view of what the central blog has distributed to this site.
 *
 * Articles are written, edited and published on blog.sanchit.pro and appear
 * here the moment "Show on portfolios" is switched on there. There is
 * deliberately no editor in this panel: one article, one place to change it.
 */
export default async function WritingAdmin() {
  const { posts, degraded } = await getPosts({ page: 1, perPage: 50 });

  return (
    <div className="space-y-6">
      <header className="adm-head">
        <div className="adm-eyebrow">Writing</div>
        <h1 className="adm-title">
          Distributed <em>articles.</em>
        </h1>
        <p className="adm-sub">
          Everything below is published on {BLOG_HOME_LABEL} with &ldquo;Show on
          portfolios&rdquo; enabled. Turn that switch off there and the article
          disappears from this site within seconds.
        </p>
      </header>

      <div className="adm-section">
        {degraded
          ? "The blog API could not be reached — this list may be incomplete."
          : `${posts.length} article${posts.length === 1 ? "" : "s"} distributed to this portfolio`}
      </div>

      <div className="adm-quick">
        <a
          className="adm-quick-link"
          href={`${BLOG_ORIGIN}/admin/posts`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Open the blog editor &#8599;
        </a>
        <Link className="adm-quick-link" href="/blog" target="_blank">
          View /blog on the site &#8599;
        </Link>
      </div>

      <div className="space-y-4">
        {posts.length === 0 && (
          <p className="adm-empty">
            No articles are distributed to this portfolio yet.
          </p>
        )}
        {posts.map((post) => (
          <div key={post.slug} className="adm-card">
            <div className="adm-card-head">
              <span className="adm-card-title">{post.title}</span>
              <Link
                href={`/blog/${post.slug}`}
                target="_blank"
                className="adm-ghost"
              >
                View &#8599;
              </Link>
            </div>

            <div className="adm-note-row">
              <div className="adm-note-meta">
                <span>
                  <i>Published</i>
                  {formatDate(post.publishedAt)}
                </span>
                <span>
                  <i>Updated</i>
                  {formatDate(post.updatedAt)}
                </span>
                <span>
                  <i>Reading</i>
                  {readingLabel(post.readingTime) || "—"}
                </span>
                <span>
                  <i>Category</i>
                  {categoryLabel(post.category)}
                </span>
              </div>
              <a
                className="adm-ghost"
                href={post.url}
                target="_blank"
                rel="noopener noreferrer"
              >
                Original &#8599;
              </a>
            </div>

            {post.tags.length > 0 && (
              <div className="tag-row">
                {post.tags.map((tag) => (
                  <span className="tag" key={tag}>
                    {tag}
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
