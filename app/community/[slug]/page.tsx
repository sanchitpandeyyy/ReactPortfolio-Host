import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { Gallery } from "@/components/Gallery";
import { getCommunityBySlug } from "@/lib/content";
import { breadcrumbNode, graph, webPageNode } from "@/lib/schema";
import { absoluteUrl, defaultSocialImage, metaDescription } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = await getCommunityBySlug(slug);
  if (!item) {
    return { title: "Not found", robots: { index: false, follow: true } };
  }

  const description = metaDescription(item.body);
  const url = absoluteUrl(`/community/${slug}`);
  const images = item.images.length
    ? [item.images[0]]
    : [defaultSocialImage().url];

  return {
    title: `${item.org} · ${item.role}`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: `${item.org} · Sanchit Pandey`,
      description,
      url,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.org} · Sanchit Pandey`,
      description,
      images,
    },
    robots: { index: true, follow: true },
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

  const url = absoluteUrl(`/community/${slug}`);

  return (
    <article className="np-article dt-page">
      <JsonLd
        data={graph([
          webPageNode({
            url,
            name: `${item.org} · ${item.role}`,
            description: metaDescription(item.body),
          }),
          breadcrumbNode([
            { name: "Home", url: absoluteUrl("/") },
            { name: "Community", url: absoluteUrl("/#community") },
            { name: item.org },
          ]),
        ])}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: "Community", href: "/#community" },
          { name: item.org },
        ]}
      />

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
