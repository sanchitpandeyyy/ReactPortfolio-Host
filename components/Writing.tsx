import Image from "next/image";
import Link from "next/link";
import { CalendarIcon, ClockIcon } from "@/components/icons";
import { getLatestPosts } from "@/lib/blog/client";
import { HOME_POSTS } from "@/lib/blog/config";
import { categoryLabel, formatDate, isoDate, readingLabel } from "@/lib/blog/format";

/**
 * Latest writing on the homepage.
 *
 * Reads the same cached feed as /blog, so adding this section costs no extra
 * request. It renders nothing at all when the central blog has not distributed
 * anything: an empty "Latest writing" heading is worse than no section.
 */
export async function Writing() {
  const posts = await getLatestPosts(HOME_POSTS);
  if (posts.length === 0) return null;

  return (
    <section className="notes-sec" id="notes" data-screen-label="08 Writing">
      <div className="sec-head" data-reveal>
        <div className="idx">Latest Writing</div>
        <div className="title">
          Things I&apos;m <em>thinking</em> about.
        </div>
        <Link href="/blog" className="meta sec-head-link">
          View all writing &rarr;
        </Link>
      </div>

      <div className="notes-grid">
        {posts.map((post) => {
          const reading = readingLabel(post.readingTime);
          return (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="note"
              data-reveal
              prefetch={false}
            >
              {post.featuredImage ? (
                <div className="note-media">
                  <Image
                    src={post.featuredImage}
                    alt={post.imageAlt || ""}
                    fill
                    sizes="(max-width: 900px) 100vw, (max-width: 1200px) 33vw, 420px"
                    loading="lazy"
                  />
                </div>
              ) : null}
              <div className="when">
                <span className="when-date">
                  <CalendarIcon />
                  <time dateTime={isoDate(post.publishedAt)}>
                    {formatDate(post.publishedAt)}
                  </time>
                </span>
                <span className="note-cat">
                  {categoryLabel(post.category)}
                </span>
              </div>
              <h3>{post.title}</h3>
              <p>{post.excerpt}</p>
              <div className="foot">
                <span className="when-read">
                  <ClockIcon />
                  {reading || "Read"}
                </span>
                <span className="arr">&#8599;</span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
