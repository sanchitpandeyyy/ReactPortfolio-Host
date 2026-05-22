import { PrismaClient } from "@prisma/client";
import { projects } from "../lib/projects";

const prisma = new PrismaClient();

// Experience starts as placeholders — edit these in /admin/experience.
const experiences = [
  {
    period: "20XX → Present",
    role: "Your Role Title",
    org: "Company or Organization",
    place: "Butwal, Nepal · Full-time",
    summary:
      "One or two lines on what you owned here, what you shipped, and the impact you had. Replace this placeholder in the admin panel.",
    tags: ["Next.js", "TypeScript", "PostgreSQL"],
  },
  {
    period: "20XX → 20XX",
    role: "Your Role Title",
    org: "Company or Organization",
    place: "Location · Contract",
    summary:
      "Placeholder summary. Swap in the real responsibilities and results for this role from /admin/experience.",
    tags: ["React", "Node.js"],
  },
  {
    period: "20XX → 20XX",
    role: "Your Role Title",
    org: "Company or Organization",
    place: "Location · Freelance",
    summary:
      "Placeholder summary. Swap in the real responsibilities and results for this role from /admin/experience.",
    tags: ["WordPress", "PHP"],
  },
];

const community = [
  {
    role: "President",
    org: "CSIT Association of BMC",
    place: "Butwal Multiple Campus",
    body: "Leading the CSIT Association at Butwal Multiple Campus: running events, mentoring students, and building the tooling that keeps the community moving.",
  },
  {
    role: "Organizer",
    org: "WordCamp Nepal",
    place: "WordPress community",
    body: "Helping organize WordCamp Nepal, the country's largest gathering of the WordPress community, alongside a team of volunteers.",
  },
  {
    role: "Lead Organizer",
    org: "BMC InnovateX",
    place: "National hackathon",
    body: "Organized BMC InnovateX, a national-level hackathon, and built the platform that ran registration, judging, and live results.",
  },
];

const week = [
  {
    label: "Shipping",
    title: "Hamro Admission v2",
    detail: "Reviewer dashboard, behind a feature flag.",
  },
  {
    label: "Reading",
    title: "Designing Data-Intensive Applications",
    detail: "Chapter 9, on consistency and consensus.",
  },
  {
    label: "Organizing",
    title: "WordCamp Nepal",
    detail: "Planning the next event with the volunteer team.",
  },
];

async function main() {
  await prisma.weekItem.deleteMany();
  await prisma.community.deleteMany();
  await prisma.experience.deleteMany();
  await prisma.project.deleteMany();

  await prisma.project.createMany({
    data: projects.map((p, i) => ({
      num: p.num,
      year: p.year,
      category: p.category,
      title: p.title,
      titleEm: p.titleEm ?? null,
      titleSuffix: p.titleSuffix ?? null,
      desc: p.desc,
      stackBold: p.stackBold,
      stackRest: p.stackRest ?? null,
      variant: p.variant,
      href: p.href,
      order: i,
    })),
  });
  await prisma.experience.createMany({
    data: experiences.map((e, i) => ({ ...e, order: i })),
  });
  await prisma.community.createMany({
    data: community.map((c, i) => ({ ...c, order: i })),
  });
  await prisma.weekItem.createMany({
    data: week.map((w, i) => ({ ...w, order: i })),
  });

  console.log(
    `Seeded ${projects.length} projects, ${experiences.length} experience, ` +
      `${community.length} community, ${week.length} week items.`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
