import { cache } from "react";
import { POSTS_PER_PAGE } from "./config";
import type {
  PageMeta,
  PostDetail,
  PostListResult,
  PostResult,
  PostSummary,
} from "./types";

/**
 * The only place in this codebase that talks to blog.sanchit.pro.
 *
 * Nothing else may fetch the blog: every page, the homepage section and the
 * webhook health check go through here, so caching, timeouts, validation and
 * failure behaviour are defined once.
 *
 * Caching has three layers:
 *   1. React cache()   deduplicates repeated reads inside a single render.
 *   2. Next data cache is tagged, so a webhook can invalidate exactly one post.
 *   3. A last-known-good snapshot, only consulted when the API is unreachable,
 *      never used to keep serving a post the API says is gone.
 */

const DEFAULT_BASE = "https://blog.sanchit.pro/api/v1";
const TIMEOUT_MS = 8000;

/** How long a page may serve blog data before Next revalidates in the
 *  background. Webhooks make this a ceiling rather than the norm. */
export const BLOG_REVALIDATE_SECONDS = 300;

/** Hard ceiling on the emergency snapshot, so an outage cannot freeze this
 *  site's content indefinitely. */
const MAX_SNAPSHOT_AGE_MS = 12 * 60 * 60 * 1000;

/** Cache tags. The webhook route revalidates exactly these. */
export const LIST_TAG = "blog-posts";
export const postTag = (slug: string) => `blog-post:${slug}`;

/** Hosts allowed to serve blog imagery. Must stay in sync with the
 *  images.remotePatterns allowlist in next.config.mjs. */
const IMAGE_HOSTS = new Set(["res.cloudinary.com", "blog.sanchit.pro"]);

/** CMS slugs are lowercase kebab-case; anything else is a bad request, not a
 *  lookup. Validating here keeps odd input out of the upstream URL entirely. */
const SLUG_RE = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;

export function isValidSlug(slug: string): boolean {
  return slug.length > 0 && slug.length <= 200 && SLUG_RE.test(slug);
}

function apiBase(): string {
  return (process.env.BLOG_API_URL?.trim() || DEFAULT_BASE).replace(/\/+$/, "");
}

function log(level: "warn" | "error", message: string, detail?: unknown) {
  // Deliberately terse and secret-free: path plus reason, nothing else.
  console[level](`[blog] ${message}`, detail ?? "");
}

/* ── last-known-good snapshots ──────────────────────────────────────────── */

const snapshots = new Map<string, { value: unknown; at: number }>();

function remember(key: string, value: unknown) {
  snapshots.set(key, { value, at: Date.now() });
}

function recall<T>(key: string): T | null {
  const hit = snapshots.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > MAX_SNAPSHOT_AGE_MS) {
    snapshots.delete(key);
    return null;
  }
  return hit.value as T;
}

/* ── transport ──────────────────────────────────────────────────────────── */

type Fetched =
  | { ok: true; data: unknown }
  | { ok: false; kind: "missing" | "unavailable" };

async function get(path: string, tags: string[]): Promise<Fetched> {
  const url = `${apiBase()}${path}`;
  try {
    const res = await fetch(url, {
      headers: { accept: "application/json" },
      signal: AbortSignal.timeout(TIMEOUT_MS),
      next: { revalidate: BLOG_REVALIDATE_SECONDS, tags },
    });

    if (res.status === 404 || res.status === 410) {
      return { ok: false, kind: "missing" };
    }
    if (!res.ok) {
      log("warn", `GET ${path} responded ${res.status}`);
      return { ok: false, kind: "unavailable" };
    }

    const contentType = res.headers.get("content-type") ?? "";
    if (!contentType.includes("json")) {
      log("warn", `GET ${path} returned non-JSON content-type`, contentType);
      return { ok: false, kind: "unavailable" };
    }

    return { ok: true, data: await res.json() };
  } catch (err) {
    const reason =
      err instanceof Error && err.name === "TimeoutError"
        ? `timed out after ${TIMEOUT_MS}ms`
        : err instanceof Error
          ? err.message
          : "request failed";
    log("warn", `GET ${path} failed: ${reason}`);
    return { ok: false, kind: "unavailable" };
  }
}

/* ── validation ─────────────────────────────────────────────────────────── */

function str(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

function isoDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  return Number.isFinite(Date.parse(value)) ? value : null;
}

/** Absolute, https, and from a host trusted to serve article imagery. */
export function safeImageUrl(value: unknown): string | null {
  if (typeof value !== "string" || value.trim() === "") return null;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return null;
    if (!IMAGE_HOSTS.has(url.hostname)) return null;
    return url.toString();
  } catch {
    return null;
  }
}

/** Only accept an origin URL that really points at the central blog. */
function safeBlogUrl(value: unknown, fallbackSlug: string): string {
  const fallback = `https://blog.sanchit.pro/blog/${fallbackSlug}`;
  if (typeof value !== "string") return fallback;
  try {
    const url = new URL(value);
    if (url.protocol !== "https:") return fallback;
    if (url.hostname !== "blog.sanchit.pro") return fallback;
    return url.toString();
  } catch {
    return fallback;
  }
}

function toSummary(raw: unknown): PostSummary | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const slug = str(r.slug).trim();
  const title = str(r.title).trim();
  const publishedAt = isoDate(r.publishedAt);
  if (!isValidSlug(slug) || !title || !publishedAt) return null;

  return {
    slug,
    title,
    url: safeBlogUrl(r.url, slug),
    excerpt: str(r.excerpt).trim(),
    category: str(r.category, "uncategorized").trim() || "uncategorized",
    tags: Array.isArray(r.tags)
      ? r.tags.filter(
          (t): t is string => typeof t === "string" && t.trim() !== "",
        )
      : [],
    readingTime: str(r.readingTime).trim(),
    featured: r.featured === true,
    featuredImage: safeImageUrl(r.featuredImage),
    imageAlt: str(r.imageAlt).trim(),
    publishedAt,
    updatedAt: isoDate(r.updatedAt) ?? publishedAt,
  };
}

function toDetail(raw: unknown): PostDetail | null {
  const summary = toSummary(raw);
  if (!summary) return null;
  const r = raw as Record<string, unknown>;
  const seo = (r.seo ?? {}) as Record<string, unknown>;

  return {
    ...summary,
    contentHtml: str(r.contentHtml),
    seo: {
      title: str(seo.title).trim() || summary.title,
      description: str(seo.description).trim() || summary.excerpt,
      // The original is the canonical, always. A missing or foreign value
      // falls back to the blog's URL rather than self-canonicalising a mirror.
      canonical: safeBlogUrl(seo.canonical, summary.slug),
    },
  };
}

function toMeta(raw: unknown, fallback: PageMeta): PageMeta {
  if (!raw || typeof raw !== "object") return fallback;
  const r = raw as Record<string, unknown>;
  const num = (v: unknown, d: number) =>
    typeof v === "number" && Number.isFinite(v) && v >= 0 ? Math.floor(v) : d;

  const page = Math.max(1, num(r.page, fallback.page));
  const perPage = Math.max(1, num(r.perPage, fallback.perPage));
  const total = num(r.total, fallback.total);
  return {
    page,
    perPage,
    total,
    totalPages: Math.max(1, num(r.totalPages, Math.ceil(total / perPage) || 1)),
    hasMore: r.hasMore === true,
  };
}

/* ── reads ──────────────────────────────────────────────────────────────── */

export interface ListOptions {
  page?: number;
  perPage?: number;
  category?: string;
  tag?: string;
}

/** Articles the central blog has distributed to the portfolios. */
export const getPosts = cache(async function getPosts({
  page = 1,
  perPage = 12,
  category,
  tag,
}: ListOptions = {}): Promise<PostListResult> {
  const query = new URLSearchParams({
    page: String(Math.max(1, Math.floor(page))),
    // The API clamps perPage to 50; clamp here too so the URL stays honest.
    perPage: String(Math.min(50, Math.max(1, Math.floor(perPage)))),
  });
  if (category) query.set("category", category);
  if (tag) query.set("tag", tag);

  const path = `/portfolio/posts?${query.toString()}`;
  const empty: PageMeta = {
    page,
    perPage,
    total: 0,
    totalPages: 1,
    hasMore: false,
  };

  const result = await get(path, [LIST_TAG]);

  if (result.ok) {
    const body = result.data as Record<string, unknown>;
    const rawPosts = Array.isArray(body?.posts) ? body.posts : null;
    if (!rawPosts) {
      log("error", `GET ${path} returned a malformed body`);
    } else {
      const posts = rawPosts
        .map(toSummary)
        .filter((p): p is PostSummary => p !== null);
      const dropped = rawPosts.length - posts.length;
      if (dropped > 0) {
        log("error", `GET ${path} contained ${dropped} invalid post entries`);
      }
      const payload: PostListResult = {
        posts,
        meta: toMeta(body.meta, { ...empty, total: posts.length }),
        degraded: false,
        stale: false,
      };
      remember(path, payload);
      return payload;
    }
  }

  // Unreachable or malformed: fall back to the last good copy of this query.
  const snapshot = recall<PostListResult>(path);
  if (snapshot) {
    log("warn", `serving last-known-good listing for ${path}`);
    return { ...snapshot, degraded: true, stale: true };
  }
  return { posts: [], meta: empty, degraded: true, stale: false };
});

/** One distributed article, by its central slug. */
export const getPost = cache(async function getPost(
  slug: string,
): Promise<PostResult> {
  if (!isValidSlug(slug)) return { status: "missing" };

  const path = `/portfolio/posts/${encodeURIComponent(slug)}`;
  const result = await get(path, [LIST_TAG, postTag(slug)]);

  if (result.ok) {
    const body = result.data as Record<string, unknown>;
    const post = toDetail(body?.post);
    if (!post) {
      log("error", `GET ${path} returned a malformed post`);
    } else {
      remember(path, post);
      return { status: "ok", post, stale: false };
    }
  } else if (result.kind === "missing") {
    // Authoritative: unpublished, deleted, or distribution switched off. Drop
    // the snapshot so a later outage cannot resurrect withdrawn content.
    snapshots.delete(path);
    return { status: "missing" };
  }

  const snapshot = recall<PostDetail>(path);
  if (snapshot) {
    log("warn", `serving last-known-good article for ${slug}`);
    return { status: "ok", post: snapshot, stale: true };
  }
  return { status: "unavailable" };
});

/**
 * Convenience read for the homepage and related-article blocks.
 *
 * Always asks for the standard page size and slices locally, so the homepage,
 * an article's "more writing" list and the sitemap all share one cached
 * response instead of creating a cache entry per caller.
 */
export async function getLatestPosts(limit: number): Promise<PostSummary[]> {
  const { posts } = await getPosts({ page: 1, perPage: POSTS_PER_PAGE });
  return posts.slice(0, limit);
}
