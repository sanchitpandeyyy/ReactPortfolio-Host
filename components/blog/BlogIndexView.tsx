import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { PostCard } from "@/components/blog/PostCard";
import { getPosts } from "@/lib/blog/client";
import {
  BLOG_DESCRIPTION,
  BLOG_HOME_LABEL,
  BLOG_TITLE,
  POSTS_PER_PAGE,
} from "@/lib/blog/config";
import { isoDate } from "@/lib/blog/format";
import { BLOG_ORIGIN, absoluteUrl } from "@/lib/site";
import {
  blogPostingNode,
  breadcrumbNode,
  graph,
  webPageNode,
} from "@/lib/schema";

/** Page 1 lives at /blog; later pages get their own crawlable URL. */
export function blogPagePath(page: number): string {
  return page <= 1 ? "/blog" : `/blog/page/${page}`;
}

/**
 * The blog index, shared by /blog and /blog/page/[page].
 *
 * Everything is server-rendered from the central feed: the cards, the
 * pagination and the structured data all exist in the first HTML response.
 */
export async function BlogIndexView({ page }: { page: number }) {
  const { posts, meta, degraded } = await getPosts({
    page,
    perPage: POSTS_PER_PAGE,
  });

  // An out-of-range page is a 404, not an empty listing to be indexed.
  if (page > 1 && posts.length === 0 && !degraded) notFound();

  const url = absoluteUrl(blogPagePath(page));
  const heading =
    page > 1 ? `${BLOG_TITLE}, page ${page}` : "Writing & technical notes.";

  return (
    <section className="np bl-index">
      <JsonLd
        data={graph([
          webPageNode({
            type: "CollectionPage",
            url,
            name: page > 1 ? `${BLOG_TITLE} · Page ${page}` : BLOG_TITLE,
            description: BLOG_DESCRIPTION,
          }),
          breadcrumbNode([
            { name: "Home", url: absoluteUrl("/") },
            ...(page > 1
              ? [
                  { name: BLOG_TITLE, url: absoluteUrl("/blog") },
                  { name: `Page ${page}` },
                ]
              : [{ name: BLOG_TITLE }]),
          ]),
          // Each entry points at the original article, matching the canonical.
          ...posts.slice(0, 10).map((post) =>
            blogPostingNode({
              title: post.title,
              description: post.excerpt,
              canonical: post.url,
              datePublished: isoDate(post.publishedAt),
              dateModified: isoDate(post.updatedAt),
              image: post.featuredImage,
              tags: post.tags,
            }),
          ),
        ])}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          ...(page > 1
            ? [{ name: BLOG_TITLE, href: "/blog" }, { name: `Page ${page}` }]
            : [{ name: BLOG_TITLE }]),
        ]}
      />

      <header className="np-head bl-head" data-reveal>
        <div className="np-eyebrow">Writing</div>
        <h1 className="np-title">
          {page > 1 ? (
            heading
          ) : (
            <>
              Writing &amp; <em>technical notes.</em>
            </>
          )}
        </h1>
        <p className="np-sub">
          Articles on building and shipping software, written and published on{" "}
          <a
            className="bl-origin-link"
            href={BLOG_ORIGIN}
            target="_blank"
            rel="noopener"
          >
            {BLOG_HOME_LABEL}
          </a>
          . The pieces below are the ones I keep close to the work on this site.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="bl-grid">
          {posts.map((post, index) => (
            <PostCard
              key={post.slug}
              post={post}
              priority={page === 1 && index === 0}
            />
          ))}
        </div>
      ) : (
        <div className="bl-empty" data-reveal>
          <p>
            {degraded
              ? "Writing is taking a moment to load right now."
              : "No articles have been published to this site yet."}
          </p>
          <a
            className="np-back bl-empty-link"
            href={BLOG_ORIGIN}
            target="_blank"
            rel="noopener"
          >
            Read everything on {BLOG_HOME_LABEL}{" "}
            <span aria-hidden="true">&#8599;</span>
          </a>
        </div>
      )}

      {meta.totalPages > 1 ? (
        <nav className="bl-pager" aria-label="Pagination">
          {page > 1 ? (
            <Link href={blogPagePath(page - 1)} className="bl-pager-link">
              <span aria-hidden="true">&larr;</span> Newer
            </Link>
          ) : (
            <span />
          )}
          <span className="bl-pager-count">
            Page {meta.page} of {meta.totalPages}
          </span>
          {meta.hasMore ? (
            <Link href={blogPagePath(page + 1)} className="bl-pager-link">
              Older <span aria-hidden="true">&rarr;</span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      ) : null}
    </section>
  );
}
