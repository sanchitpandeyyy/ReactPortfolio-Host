import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { BlogIndexView } from "@/components/blog/BlogIndexView";
import { BLOG_DESCRIPTION, BLOG_TITLE } from "@/lib/blog/config";
import { absoluteUrl, defaultSocialImage } from "@/lib/site";

/**
 * Real, crawlable pagination.
 *
 * Page 1 redirects to /blog so the same listing never exists at two URLs, and
 * every other page self-canonicalises: these are distinct listings of distinct
 * articles, not duplicates of each other.
 */
export const revalidate = 300;

function parsePage(raw: string): number | null {
  if (!/^[1-9][0-9]{0,3}$/.test(raw)) return null;
  return Number(raw);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ page: string }>;
}): Promise<Metadata> {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (page === null) return { title: "Not found" };

  const path = `/blog/page/${page}`;
  return {
    title: `${BLOG_TITLE} · Page ${page}`,
    description: BLOG_DESCRIPTION,
    alternates: { canonical: absoluteUrl(path) },
    openGraph: {
      type: "website",
      title: `${BLOG_TITLE} · Page ${page} · Sanchit Pandey`,
      description: BLOG_DESCRIPTION,
      url: absoluteUrl(path),
      images: [defaultSocialImage()],
    },
    robots: { index: true, follow: true },
  };
}

export default async function BlogPaginatedPage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page: raw } = await params;
  const page = parsePage(raw);
  if (page === null) notFound();
  if (page === 1) redirect("/blog");

  return <BlogIndexView page={page} />;
}
