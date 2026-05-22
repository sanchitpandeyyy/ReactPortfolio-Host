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
    desc: "A social discovery platform for creating events and enrolling friends. Real-time interactions, host approval workflows, and an invite system designed for the way people actually meet up.",
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
    desc: "A premium WordPress plugin toolkit with a modern React-based admin dashboard and high-performance UI components, built for agencies who ship fast.",
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
    titleSuffix: ", a B2C admissions platform.",
    desc: "An admissions platform built for students seeking education opportunities. Heavy focus on UI/UX, brand consistency, and a flow that respects the applicant's time. Designed and shipped end-to-end.",
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
    desc: "A national-level hackathon platform organized by the CSIT Association of Butwal Multiple Campus. Registration, judging, schedule, and live results, built and operated by the same person who organized the event.",
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
    desc: "An all-in-one e-commerce storefront, your one-stop destination for quality products at affordable prices, with a CMS and POS layer underneath for the merchant side.",
    stackBold: "Next.js · Node.js · MongoDB",
    stackRest: "· launched",
    variant: "strip",
    href: "https://sanchit.pro",
  },
];
