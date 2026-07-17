import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/notes";
import { prisma } from "@/lib/db";

const BASE = "https://sanchitpandey.com.np";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const posts = await getAllPosts();

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
      url: BASE,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${BASE}/contact`,
      lastModified: new Date(),
      changeFrequency: "yearly",
      priority: 0.7,
    },
    {
      url: `${BASE}/notes`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    ...posts.map((p) => ({
      url: `${BASE}/notes/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...projects
      .filter((p) => p.slug)
      .map((p) => ({
        url: `${BASE}/projects/${p.slug}`,
        lastModified: p.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.7,
      })),
    ...community
      .filter((c) => c.slug)
      .map((c) => ({
        url: `${BASE}/community/${c.slug}`,
        lastModified: c.updatedAt,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      })),
  ];
}
