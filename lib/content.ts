import { prisma } from "./db";

export async function getProjects() {
  return prisma.project.findMany({ orderBy: { order: "asc" } });
}

export async function getProject(id: string) {
  return prisma.project.findUnique({ where: { id } });
}

export async function getExperiences() {
  return prisma.experience.findMany({ orderBy: { order: "asc" } });
}

export async function getExperience(id: string) {
  return prisma.experience.findUnique({ where: { id } });
}

export async function getCommunityItems() {
  return prisma.community.findMany({ orderBy: { order: "asc" } });
}

export async function getCommunityItem(id: string) {
  return prisma.community.findUnique({ where: { id } });
}

export async function getWeekItems() {
  return prisma.weekItem.findMany({ orderBy: { order: "asc" } });
}

export async function getWeekItem(id: string) {
  return prisma.weekItem.findUnique({ where: { id } });
}

export async function getSiteSeo() {
  return prisma.siteSeo.findUnique({ where: { id: "main" } });
}

export async function getAnalytics() {
  const today = new Date().toISOString().slice(0, 10);
  const weekAgo = new Date(Date.now() - 6 * 24 * 60 * 60 * 1000)
    .toISOString()
    .slice(0, 10);

  const [todayRow, week, allTime, topClicks] = await Promise.all([
    prisma.dailyStat.findUnique({ where: { day: today } }),
    prisma.dailyStat.aggregate({
      _sum: { views: true, visitors: true },
      where: { day: { gte: weekAgo } },
    }),
    prisma.dailyStat.aggregate({ _sum: { views: true, visitors: true } }),
    prisma.clickStat.findMany({ orderBy: { count: "desc" }, take: 6 }),
  ]);

  const totalClicks = await prisma.clickStat.aggregate({
    _sum: { count: true },
  });

  return {
    today: { views: todayRow?.views ?? 0, visitors: todayRow?.visitors ?? 0 },
    week: {
      views: week._sum.views ?? 0,
      visitors: week._sum.visitors ?? 0,
    },
    allTime: {
      views: allTime._sum.views ?? 0,
      visitors: allTime._sum.visitors ?? 0,
    },
    clicks: totalClicks._sum.count ?? 0,
    topClicks,
  };
}
