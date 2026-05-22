import { prisma } from "./db";

export async function getProjects() {
  return prisma.project.findMany({ orderBy: { order: "asc" } });
}

export async function getExperiences() {
  return prisma.experience.findMany({ orderBy: { order: "asc" } });
}

export async function getCommunityItems() {
  return prisma.community.findMany({ orderBy: { order: "asc" } });
}

export async function getWeekItems() {
  return prisma.weekItem.findMany({ orderBy: { order: "asc" } });
}
