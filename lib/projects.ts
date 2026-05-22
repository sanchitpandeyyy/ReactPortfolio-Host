export type CardVariant = "feat" | "tall" | "wide" | "sq" | "strip";

export interface Project {
  num: string;
  year: string;
  category: string;
  title: string;
  titleEm?: string;
  titleSuffix?: string;
  desc: string;
  stackBold: string;
  stackRest?: string;
  variant: CardVariant;
  href: string;
}

export const projects: Project[] = [
  {
    num: "N° 001",
    year: "2025 · Social",
    category: "Social",
    title: "Find Your",
    titleEm: "Fellow",
    desc: "A social discovery platform for creating events and enrolling friends — real-time interactions, host approval workflows, and an invite system designed for the way people actually meet up.",
    stackBold: "Next.js · TypeScript · Prisma",
    stackRest: "PostgreSQL · Tailwind",
    variant: "feat",
    href: "https://sanchit.pro",
  },
  {
    num: "N° 002",
    year: "2025 · WordPress",
    category: "Plugin Toolkit",
    title: "Surface",
    titleEm: "Kit.",
    desc: "A premium WordPress plugin toolkit with a modern React-based admin dashboard and high-performance UI components — built for agencies who ship fast.",
    stackBold: "React · WordPress · PHP",
    stackRest: "TypeScript · Vite",
    variant: "tall",
    href: "https://sanchit.pro",
  },
  {
    num: "N° 003",
    year: "2024 · EdTech",
    category: "Admissions",
    title: "Hamro",
    titleEm: "—",
    titleSuffix: " a B2C admissions platform.",
    desc: "An admissions platform built for students seeking education opportunities — heavy focus on UI/UX, brand consistency, and a flow that respects the applicant's time. Designed and shipped end-to-end.",
    stackBold: "Next.js · TypeScript · Node.js",
    stackRest: "PostgreSQL · Figma",
    variant: "wide",
    href: "https://sanchit.pro",
  },
  {
    num: "N° 004",
    year: "2024 · Hackathon",
    category: "Community",
    title: "BMC",
    titleEm: "InnovateX.",
    desc: "A national-level hackathon platform organized by the CSIT Association of Butwal Multiple Campus. Registration, judging, schedule, and live results — built and operated by the same person who organized the event.",
    stackBold: "Next.js · Prisma · Tailwind",
    variant: "sq",
    href: "https://sanchit.pro",
  },
  {
    num: "N° 005",
    year: "2023 · E-commerce",
    category: "Storefront",
    title: "Kinmel",
    titleEm: "Bakas.",
    desc: "An all-in-one e-commerce storefront — your one-stop destination for quality products at affordable prices, with a CMS and POS layer underneath for the merchant side.",
    stackBold: "Next.js · Node.js · MongoDB",
    stackRest: "· launched",
    variant: "strip",
    href: "https://sanchit.pro",
  },
];

export interface Note {
  when: string;
  title: string;
  titleEm?: string;
  titleSuffix?: string;
  body: string;
  minutes: number;
}

export const notes: Note[] = [
  {
    when: "May 12, 2026",
    title: "On building",
    titleEm: "quiet",
    titleSuffix: " interfaces.",
    body: "A short defense of interfaces that don't talk back unless asked. The best features I've shipped were the ones users didn't notice — they just made the slow thing fast, or the imprecise thing precise.",
    minutes: 5,
  },
  {
    when: "Apr 04, 2026",
    title: "Organizing",
    titleEm: "InnovateX,",
    titleSuffix: " end-to-end.",
    body: "What I learned running BMC InnovateX as Lead Organizer at the CSIT Association — the registration pipeline, judging dashboard, and on-site ops. Most of the hard parts were not software.",
    minutes: 9,
  },
  {
    when: "Feb 18, 2026",
    title: "The",
    titleEm: "weekly",
    titleSuffix: " demo.",
    body: "Why I make every small team I work with ship a 10-minute Friday demo — even when there's \"nothing to show.\" Especially then.",
    minutes: 4,
  },
];
