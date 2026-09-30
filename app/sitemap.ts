import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { absoluteUrl } from "@/lib/site";

/**
 * Only this site's own canonical URLs.
 * Writing lives on sanchit.pro/blog and is listed in that site's sitemap.
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

  return [
    {
      url: absoluteUrl("/"),
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
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
