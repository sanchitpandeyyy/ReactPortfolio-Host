import type { MetadataRoute } from "next";
import { getPosts } from "@/lib/blog/client";
import { POSTS_PER_PAGE } from "@/lib/blog/config";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

/**
 * Only this site's own canonical URLs.
 *
 * Mirrored article pages (/blog/<slug>) are deliberately absent: their
 * canonical points at blog.sanchit.pro, and listing a URL here while telling
 * search engines the real one lives elsewhere is a contradiction. The blog's
 * own sitemap covers the articles; this one covers the portfolio.
 */
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let projects: { slug: string | null; updatedAt: Date }[] = [];
  let community: { slug: string | null; updatedAt: Date }[] = [];
  try {
    [projects, community] = await Promise.all([
      prisma.project.findMany({ select: { slug: true, updatedAt: true } }),
      prisma.community.findMany({ select: { slug: true, updatedAt: true } }),
    ]);
  } catch {
    // DB unavailable at build time — ship the static entries.
  }

  // lastmod for /blog tracks the newest distributed article, not the crawl.
  const { posts, meta } = await getPosts({ page: 1, perPage: POSTS_PER_PAGE });
  const blogUpdated = posts.reduce<Date | null>((newest, post) => {
    const updated = new Date(post.updatedAt);
    return !newest || updated > newest ? updated : newest;
  }, null);

  const paginated = Array.from(
    { length: Math.max(0, meta.totalPages - 1) },
    (_, index) => ({
      url: absoluteUrl(`/blog/page/${index + 2}`),
      lastModified: blogUpdated ?? undefined,
      changeFrequency: "weekly" as const,
      priority: 0.4,
    }),
  );

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: absoluteUrl("/blog"),
      lastModified: blogUpdated ?? undefined,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...paginated,
    {
      url: absoluteUrl("/contact"),
      lastModified: undefined,
      changeFrequency: "yearly",
      priority: 0.6,
    },
    ...projects
      .filter((project) => project.slug)
      .map((project) => ({
        url: absoluteUrl(`/projects/${project.slug}`),
        lastModified: project.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ...community
      .filter((item) => item.slug)
      .map((item) => ({
        url: absoluteUrl(`/community/${item.slug}`),
        lastModified: item.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
  ];
}
