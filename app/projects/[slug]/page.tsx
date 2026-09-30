import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Gallery } from "@/components/Gallery";
import { getProjectBySlug } from "@/lib/content";
import {
  breadcrumbNode,
  creativeWorkNode,
  graph,
  webPageNode,
} from "@/lib/schema";
import { absoluteUrl, defaultSocialImage, metaDescription } from "@/lib/site";

// Rendered on first visit, then cached; admin saves revalidate it.
export const revalidate = 86400;

// An empty list opts the route into on-demand static generation, so each
// page is built on its first request and served from cache after that.
export function generateStaticParams() {
  return [];
}

/** Full project title, matching the visible H1. */
function fullTitle(project: {
  title: string;
  titleEm: string | null;
  titleSuffix: string | null;
}): string {
  return [project.title, project.titleEm, project.titleSuffix]
    .filter(Boolean)
    .join(" ")
    .replace(/\s+([.,])/g, "$1")
    .trim();
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) {
    return { title: "Project not found", robots: { index: false, follow: true } };
  }

  const name = fullTitle(project);
  const description = metaDescription(project.desc);
  const url = absoluteUrl(`/projects/${slug}`);
  const images = project.images.length
    ? [project.images[0]]
    : [defaultSocialImage().url];

  return {
    title: `${name} · ${project.category}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${name} · Sanchit Pandey`,
      description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${name} · Sanchit Pandey`,
      description,
      images,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ProjectPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  const name = fullTitle(project);
  const url = absoluteUrl(`/projects/${slug}`);
  // Curated writing about this project, if any is distributed to the site.

  return (
    <article className="np-article dt-page">
      <JsonLd
        data={graph([
          webPageNode({
            url,
            name: `${name} · Sanchit Pandey`,
            description: metaDescription(project.desc),
          }),
          creativeWorkNode({
            url,
            name,
            description: project.desc,
            images: project.images,
            keywords: [project.stackBold, project.stackRest]
              .filter(Boolean)
              .join(" · "),
          }),
          breadcrumbNode([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Work", url: absoluteUrl("/#work") },
            { name },
          ]),
        ])}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Work", href: "/#work" },
          { name },
        ]}
      />

      <header className="np-art-head" data-reveal>
        <div className="np-eyebrow">{project.category}</div>
        <h1 className="np-art-title">
          {project.title}
          {project.titleEm && (
            <>
              {" "}
              <em>{project.titleEm}</em>
            </>
          )}
          {project.titleSuffix}
        </h1>
        <div className="np-art-meta">
          <span>{project.year}</span>
          <span>
            <b>{project.stackBold}</b>
            {project.stackRest && <> · {project.stackRest}</>}
          </span>
        </div>
      </header>

      <Gallery images={project.images} alt={name} />

      <div className="np-art-body" data-reveal>
        <p>{project.desc}</p>
      </div>

      <div className="dt-actions" data-reveal>
        {project.href && (
          <a
            href={project.href}
            target="_blank"
            rel="noopener noreferrer"
            className="endcap-cta"
          >
            Visit live site <span aria-hidden="true">↗</span>
          </a>
        )}
        <Link href="/contact" className="np-back dt-cta-alt">
          Want something like this? Say hi{" "}
          <span aria-hidden="true">&rarr;</span>
        </Link>
      </div>

      <footer className="np-art-foot" data-reveal>
        <Link href="/#work" className="np-back">
          <span aria-hidden="true">&larr;</span> Back to all work
        </Link>
      </footer>
    </article>
  );
}
