import { Ambience } from "@/components/Ambience";
import { Cursor } from "@/components/Cursor";
import { TopNav } from "@/components/TopNav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Work } from "@/components/Work";
import { Now } from "@/components/Now";
import { Notes } from "@/components/Notes";
import { Terminal } from "@/components/Terminal";
import { Endcap } from "@/components/Endcap";
import { SiteFooter } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";

const limeMarquee = [
  { text: "Full-Stack" },
  { text: "Next.js", em: true },
  { text: "TypeScript" },
  { text: "Prisma", em: true },
  { text: "WordPress" },
  { text: "E-commerce" },
  { text: "Community", em: true },
  { text: "Postgres" },
];

const neutralMarquee = [
  { text: "Built", em: true },
  { text: "in Nepal" },
  { text: "Shipped to the internet" },
  { text: "Quiet systems" },
  { text: "Small", em: true },
  { text: "teams" },
  { text: "Type-safe" },
  { text: "Well-documented" },
];

export default function Page() {
  return (
    <>
      <Ambience />
      <Cursor />
      <SmoothScroll />

      <TopNav />

      <main>
        <Hero />
        <Marquee items={limeMarquee} variant="lime" />
        <About />
        <Work />
        <Marquee items={neutralMarquee} variant="neutral" reverse />
        <Now />
        <Notes />
        <Terminal />
        <Endcap />
      </main>

      <SiteFooter />
    </>
  );
}
