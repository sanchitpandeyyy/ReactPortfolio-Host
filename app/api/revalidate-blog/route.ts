import { createHmac, timingSafeEqual } from "crypto";
import { NextResponse } from "next/server";
import { revalidatePath, revalidateTag } from "next/cache";
import { LIST_TAG, getPost, isValidSlug, postTag } from "@/lib/blog/client";

/**
 * Revalidation endpoint for blog.sanchit.pro.
 *
 * The central blog signs every notification with a shared secret; this route
 * verifies it and then invalidates exactly the caches the change affects.
 * Nothing here trusts the payload for anything except which slugs to purge, so
 * the worst a forged-but-valid request could do is make this site re-fetch.
 *
 * Contract (fixed by the sender in lib/portfolio/webhooks.ts on the blog):
 *   X-Blog-Event      the event name
 *   X-Blog-Timestamp  unix seconds
 *   X-Blog-Signature  hex HMAC-SHA256 of `${timestamp}.${rawBody}`
 */

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Requests older than this are refused, so a captured one cannot be replayed. */
const TOLERANCE_SECONDS = 300;

const EVENTS = new Set([
  "POST_PUBLISHED",
  "POST_UPDATED",
  "POST_UNPUBLISHED",
  "POST_DELETED",
  "POST_SLUG_CHANGED",
  "POST_DISTRIBUTION_ENABLED",
  "POST_DISTRIBUTION_DISABLED",
  "POST_FEATURED_IMAGE_CHANGED",
  "POST_SEO_UPDATED",
]);

/** Events after which the article should exist on this site. */
const EXPECT_PRESENT = new Set([
  "POST_PUBLISHED",
  "POST_UPDATED",
  "POST_DISTRIBUTION_ENABLED",
  "POST_FEATURED_IMAGE_CHANGED",
  "POST_SEO_UPDATED",
]);

/** Signatures already accepted, so the same request cannot be replayed twice. */
const seen = new Map<string, number>();

function rememberSignature(signature: string): boolean {
  const now = Date.now();
  for (const [key, at] of seen) {
    if (now - at > TOLERANCE_SECONDS * 1000) seen.delete(key);
  }
  if (seen.has(signature)) return false;
  seen.set(signature, now);
  return true;
}

function verify(timestamp: string, body: string, signature: string, key: string) {
  const expected = createHmac("sha256", key)
    .update(`${timestamp}.${body}`)
    .digest("hex");
  const given = Buffer.from(signature);
  const want = Buffer.from(expected);
  if (given.length !== want.length) return false;
  return timingSafeEqual(given, want);
}

function slugOf(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const slug = (value as Record<string, unknown>).slug;
  return typeof slug === "string" && isValidSlug(slug) ? slug : null;
}

/**
 * Confirms the invalidation actually achieved what the event described.
 *
 * One cheap read against the API this site just purged: after a publish the
 * article must resolve with a title and a canonical, and after a withdrawal it
 * must be gone. Failures are logged rather than thrown, because a delivery
 * that revalidated correctly should not be retried over a health warning.
 */
async function checkHealth(event: string, slug: string | null) {
  if (!slug) return null;
  const shouldExist = EXPECT_PRESENT.has(event);

  try {
    const result = await getPost(slug);

    if (shouldExist) {
      if (result.status !== "ok") {
        console.error(
          `[blog-webhook] health: ${slug} still missing after ${event}`,
        );
        return { slug, expected: "present", actual: result.status, ok: false };
      }
      const ok =
        Boolean(result.post.title) &&
        result.post.seo.canonical.startsWith("https://blog.sanchit.pro/");
      if (!ok) {
        console.error(`[blog-webhook] health: ${slug} resolved but incomplete`);
      }
      return {
        slug,
        expected: "present",
        actual: "ok",
        ok,
        canonical: result.post.seo.canonical,
        hasImage: Boolean(result.post.featuredImage),
      };
    }

    if (result.status === "ok") {
      console.error(
        `[blog-webhook] health: ${slug} still distributed after ${event}`,
      );
      return { slug, expected: "absent", actual: "ok", ok: false };
    }
    return { slug, expected: "absent", actual: result.status, ok: true };
  } catch (err) {
    console.error("[blog-webhook] health check failed", err);
    return { slug, ok: false, error: "health check failed" };
  }
}

export async function POST(request: Request) {
  const secret = process.env.BLOG_WEBHOOK_SECRET?.trim();
  if (!secret) {
    console.error("[blog-webhook] BLOG_WEBHOOK_SECRET is not configured");
    return NextResponse.json({ error: "Not configured" }, { status: 503 });
  }

  const signature = request.headers.get("x-blog-signature") ?? "";
  const timestamp = request.headers.get("x-blog-timestamp") ?? "";
  if (!signature || !timestamp) {
    return NextResponse.json({ error: "Unsigned request" }, { status: 401 });
  }

  const age = Math.abs(Date.now() - Number(timestamp) * 1000);
  if (!Number.isFinite(age) || age > TOLERANCE_SECONDS * 1000) {
    console.warn("[blog-webhook] rejected: timestamp outside tolerance");
    return NextResponse.json({ error: "Stale timestamp" }, { status: 401 });
  }

  // The raw text, not the parsed object: re-serialising would change the bytes.
  const raw = await request.text();
  if (raw.length > 1_000_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  if (!verify(timestamp, raw, signature, secret)) {
    console.warn("[blog-webhook] rejected: bad signature");
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
  }

  if (!rememberSignature(signature)) {
    console.warn("[blog-webhook] rejected: replayed signature");
    return NextResponse.json({ error: "Replay detected" }, { status: 409 });
  }

  let payload: Record<string, unknown>;
  try {
    payload = JSON.parse(raw) as Record<string, unknown>;
  } catch {
    console.error("[blog-webhook] payload was not valid JSON");
    return NextResponse.json({ error: "Malformed payload" }, { status: 400 });
  }

  const event = String(payload.event ?? request.headers.get("x-blog-event") ?? "");
  if (!EVENTS.has(event)) {
    console.warn(`[blog-webhook] unknown event: ${event.slice(0, 40)}`);
    return NextResponse.json({ error: "Unknown event" }, { status: 400 });
  }

  const slug = slugOf(payload.post);
  // A rename must clear the old route too, or it lingers as a stale copy.
  const previousSlug = slugOf(payload.previous);

  const tags = [LIST_TAG];
  const paths = ["/blog", "/"];

  for (const affected of [slug, previousSlug]) {
    if (!affected) continue;
    tags.push(postTag(affected));
    paths.push(`/blog/${affected}`);
  }
  // The listing's lastmod moves with the feed.
  paths.push("/sitemap.xml");

  try {
    for (const tag of new Set(tags)) revalidateTag(tag);
    for (const path of new Set(paths)) revalidatePath(path);
  } catch (err) {
    console.error("[blog-webhook] revalidation failed", err);
    return NextResponse.json({ error: "Revalidation failed" }, { status: 500 });
  }

  console.info(
    `[blog-webhook] ${event} -> revalidated ${[...new Set(paths)].join(", ")}`,
  );

  return NextResponse.json({
    ok: true,
    event,
    revalidated: {
      tags: [...new Set(tags)],
      paths: [...new Set(paths)],
    },
    health: await checkHealth(event, slug),
    receivedAt: new Date().toISOString(),
  });
}

/** Anything other than a signed POST is a mistake worth naming. */
export function GET() {
  return NextResponse.json(
    { error: "Send a signed POST from blog.sanchit.pro" },
    { status: 405, headers: { Allow: "POST" } },
  );
}
