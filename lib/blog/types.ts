/**
 * The public contract of the central blog's portfolio API.
 *
 * Mirrors https://blog.sanchit.pro/api/v1/portfolio/* — that endpoint already
 * returns only posts that are published AND have showOnPortfolios = true, so
 * this site never filters distribution itself. There is deliberately no
 * per-portfolio variant: both portfolios consume the identical feed.
 */

export interface PostSummary {
  title: string;
  slug: string;
  /** Absolute URL of the original article on the central blog. */
  url: string;
  excerpt: string;
  category: string;
  tags: string[];
  /** Human string from the CMS, e.g. "6 min". */
  readingTime: string;
  featured: boolean;
  featuredImage: string | null;
  imageAlt: string;
  /** ISO 8601. */
  publishedAt: string;
  /** ISO 8601. */
  updatedAt: string;
}

export interface PostDetail extends PostSummary {
  /** Server-rendered HTML from the CMS. Never trusted; always sanitized. */
  contentHtml: string;
  seo: {
    title: string;
    description: string;
    /** Canonical URL of the original. Mirrored pages point here. */
    canonical: string;
  };
}

export interface PageMeta {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  hasMore: boolean;
}

/** A list read. `degraded` means the API could not be reached and this is a
 *  best-effort answer (last known good snapshot, or empty). */
export interface PostListResult {
  posts: PostSummary[];
  meta: PageMeta;
  degraded: boolean;
  stale: boolean;
}

/**
 * A single-article read.
 *
 * "missing" is an authoritative answer from the API (unpublished, deleted or
 * distribution switched off) and must render a 404. "unavailable" means we
 * could not ask, which must never be turned into a 404.
 */
export type PostResult =
  | { status: "ok"; post: PostDetail; stale: boolean }
  | { status: "missing" }
  | { status: "unavailable" };
