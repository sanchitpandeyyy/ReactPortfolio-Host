import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectBySlug } from "@/lib/content";
import { Gallery } from "@/components/Gallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return { title: "Project not found · Sanchit Pandey" };
  return {
    title: `${project.title} · Sanchit Pandey`,
    description: project.desc,
    openGraph: {
      title: `${project.title} · Sanchit Pandey`,
      description: project.desc,
      images: project.images.length ? [project.images[0]] : undefined,
    },
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

  return (
    <article className="np-article dt-page">
      <Link href="/#work" className="np-back" data-reveal>
        <span aria-hidden="true">&larr;</span> All work
      </Link>

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

      <Gallery images={project.images} alt={project.title} />

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
