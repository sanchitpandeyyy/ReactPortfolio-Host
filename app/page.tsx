import { Ambience } from "@/components/Ambience";
import { Cursor } from "@/components/Cursor";
import { TopNav } from "@/components/TopNav";
import { Hero } from "@/components/Hero";
import { Marquee } from "@/components/Marquee";
import { About } from "@/components/About";
import { Experience } from "@/components/Experience";
import { Skills } from "@/components/Skills";
import { Work } from "@/components/Work";
import { Community } from "@/components/Community";
import { Now } from "@/components/Now";
import { Writing } from "@/components/Writing";
import { Terminal } from "@/components/Terminal";
import { Endcap } from "@/components/Endcap";
import { SiteFooter } from "@/components/Footer";
import { SmoothScroll } from "@/components/SmoothScroll";
import { JsonLd } from "@/components/JsonLd";
import { graph, personNode, webPageNode, websiteNode } from "@/lib/schema";
import { absoluteUrl } from "@/lib/site";
import type { Metadata } from "next";

// Sections read from the database, so render this page per request.
export const dynamic = "force-dynamic";

/**
 * The homepage is this site's profile page: it introduces the person the
 * projects, community work and writing all belong to, so it carries the
 * Person entity every other page references by id.
 */
export const metadata: Metadata = {
  alternates: { canonical: absoluteUrl("/") },
};

const limeMarquee = [
  { text: "Software Engineer" },
  { text: "Full-Stack" },
  { text: "React", em: true },
  { text: "Node.js", em: true },
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
      <JsonLd
        data={graph([
          websiteNode(),
          webPageNode({
            type: "ProfilePage",
            url: absoluteUrl("/"),
            name: "Sanchit Pandey · Full-Stack Developer",
          }),
          personNode(),
        ])}
      />
      <Ambience />
      <Cursor />
      <SmoothScroll />

      <TopNav />

      <main>
        <Hero />
        <Marquee items={limeMarquee} variant="lime" />
        <About />
        <Experience />
        <Skills />
        <Work />
        <Marquee items={neutralMarquee} variant="neutral" reverse />
        <Community />
        <Now />
        <Writing />
        <Terminal />
        <Endcap />
      </main>

      <SiteFooter />
    </>
  );
}
