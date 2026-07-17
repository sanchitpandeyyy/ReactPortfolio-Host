import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCommunityBySlug } from "@/lib/content";
import { Gallery } from "@/components/Gallery";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCommunityBySlug(slug);
  if (!item) return { title: "Not found · Sanchit Pandey" };
  return {
    title: `${item.org} · Sanchit Pandey`,
    description: item.body,
    openGraph: {
      title: `${item.org} · Sanchit Pandey`,
      description: item.body,
      images: item.images.length ? [item.images[0]] : undefined,
    },
  };
}

export default async function CommunityPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = await getCommunityBySlug(slug);
  if (!item) notFound();

  return (
    <article className="np-article dt-page">
      <Link href="/#community" className="np-back" data-reveal>
        <span aria-hidden="true">&larr;</span> All community work
      </Link>

      <header className="np-art-head" data-reveal>
        <div className="np-eyebrow">{item.role}</div>
        <h1 className="np-art-title">{item.org}</h1>
        <div className="np-art-meta">
          <span>{item.place}</span>
        </div>
      </header>

      <Gallery images={item.images} alt={item.org} />

      <div className="np-art-body" data-reveal>
        <p>{item.body}</p>
      </div>

      <footer className="np-art-foot" data-reveal>
        <Link href="/#community" className="np-back">
          <span aria-hidden="true">&larr;</span> Back to community
        </Link>
      </footer>
    </article>
  );
}
