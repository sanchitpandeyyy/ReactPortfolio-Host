import Image from "next/image";
import Link from "next/link";
import {
  CalendarIcon,
  ClockIcon,
} from "@/components/icons";
import { categoryLabel, formatDate, isoDate, readingLabel } from "@/lib/blog/format";
import type { PostSummary } from "@/lib/blog/types";

/**
 * One article on the blog index.
 *
 * The whole card is a real anchor to /blog/<slug>, so the listing is crawlable
 * without running any JavaScript. Prefetch is off: a listing of twenty cards
 * would otherwise fetch twenty payloads nobody asked for.
 */
export function PostCard({
  post,
  priority = false,
}: {
  post: PostSummary;
  /** Set on the first card only: it is the likely LCP element. */
  priority?: boolean;
}) {
  const reading = readingLabel(post.readingTime);

  return (
    <Link href={`/blog/${post.slug}`} className="bl-card" prefetch={false}>
      {post.featuredImage ? (
        <div className="bl-card-media">
          <Image
            src={post.featuredImage}
            alt={post.imageAlt || ""}
            fill
            sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 460px"
            className="bl-card-img"
            priority={priority}
            loading={priority ? "eager" : "lazy"}
          />
        </div>
      ) : null}

      <div className="bl-card-body">
        <div className="bl-card-top">
          <span className="bl-card-cat">
            {categoryLabel(post.category)}
          </span>
          <span className="bl-card-meta">
            <CalendarIcon />
            <time dateTime={isoDate(post.publishedAt)}>
              {formatDate(post.publishedAt)}
            </time>
          </span>
          {reading ? (
            <span className="bl-card-meta">
              <ClockIcon />
              <span>{reading}</span>
            </span>
          ) : null}
        </div>

        <h2 className="bl-card-title">{post.title}</h2>
        {post.excerpt ? <p className="bl-card-excerpt">{post.excerpt}</p> : null}

        <div className="bl-card-foot">
          {post.tags.length > 0 ? (
            <span className="bl-card-tags">
              {post.tags.slice(0, 3).join(" · ")}
            </span>
          ) : (
            <span />
          )}
          <span className="bl-card-arrow" aria-hidden="true">
            &#8599;
          </span>
        </div>
      </div>
    </Link>
  );
}
