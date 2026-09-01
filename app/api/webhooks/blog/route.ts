import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

import { LIST_TAG, forgetBlogSnapshots, isValidSlug, postTag } from "@/lib/blog/client";
import { validateBlogWebhook } from "@/lib/blog/webhook";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function payloadSlug(value: unknown): string | null {
  if (!value || typeof value !== "object") return null;
  const slug = (value as { slug?: unknown }).slug;
  return typeof slug === "string" && isValidSlug(slug) ? slug : null;
}

export async function POST(request: Request) {
  const rawBody = await request.text();
  const result = validateBlogWebhook(
    rawBody,
    request.headers.get("x-blog-timestamp"),
    request.headers.get("x-blog-signature"),
    process.env.PORTFOLIO_WEBHOOK_SECRET,
  );
  if (!result.ok) {
    return NextResponse.json({ ok: false, error: result.error }, { status: result.status });
  }

  const currentSlug = payloadSlug(result.payload.post);
  const previousSlug = payloadSlug(result.payload.previous);
  const slugs = [...new Set([currentSlug, previousSlug].filter((slug): slug is string => Boolean(slug)))];
  const tags = [...new Set([LIST_TAG, ...slugs.map(postTag)])];
  const paths = [...new Set(["/", "/blog", "/sitemap.xml", ...slugs.map((slug) => `/blog/${slug}`)])];

  forgetBlogSnapshots(slugs);
  for (const tag of tags) revalidateTag(tag);
  for (const path of paths) revalidatePath(path);
  return NextResponse.json({ ok: true, event: result.payload.event, revalidated: { tags, paths } });
}

export function GET() {
  return NextResponse.json({
    configured: Boolean(process.env.PORTFOLIO_WEBHOOK_SECRET?.trim()),
    endpoint: "/api/webhooks/blog",
  });
}

export function OPTIONS() {
  return new Response(null, { status: 204, headers: { Allow: "GET, OPTIONS, POST" } });
}
