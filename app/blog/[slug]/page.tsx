import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";
import { Breadcrumbs } from "@/components/blog/Breadcrumbs";
import { CodeCopy } from "@/components/blog/CodeCopy";
import { Toc } from "@/components/blog/Toc";
import { getLatestPosts, getPost, getPosts } from "@/lib/blog/client";
import { BLOG_HOME_LABEL, BLOG_TITLE } from "@/lib/blog/config";
import { renderArticle, shouldShowToc } from "@/lib/blog/content";
import {
  categoryLabel,
  formatDate,
  isoDate,
  readingLabel,
  wasUpdated,
} from "@/lib/blog/format";
import { projectSlugsForArticle } from "@/lib/blog/relations";
import { getProjectBySlug } from "@/lib/content";
import { blogPostingNode, breadcrumbNode, graph } from "@/lib/schema";
import {
  BLOG_ORIGIN,
  PERSON,
  absoluteUrl,
  defaultSocialImage,
} from "@/lib/site";

/**
 * A mirrored article.
 *
 * The body is fetched and rendered on the server, so the first HTML response
 * carries the whole piece: title, dates, prose, code, images and structured
 * data. The canonical always points back to blog.sanchit.pro, because this
 * page is a copy and the original should be the one that ranks.
 */
export const revalidate = 300;

const BODY_ID = "bl-article-body";

/** Pre-render the distributed set at build; new slugs render on first request. */
export async function generateStaticParams() {
  const { posts } = await getPosts({ page: 1, perPage: 50 });
  return posts.map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const result = await getPost(slug);

  if (result.status !== "ok") {
    return {
      title: result.status === "missing" ? "Article not found" : BLOG_TITLE,
      // Neither an error state nor a placeholder belongs in an index.
      robots: { index: false, follow: true },
      alternates: { canonical: absoluteUrl(`/blog/${slug}`) },
    };
  }

  const { post } = result;
  // The article's own art when it has any, the site card when it does not.
  const image = post.featuredImage
    ? [post.featuredImage]
    : [defaultSocialImage().url];

  return {
    title: post.seo.title,
    description: post.seo.description,
    // The original on the central blog, never this copy.
    alternates: { canonical: post.seo.canonical },
    openGraph: {
      type: "article",
      title: post.seo.title,
      description: post.seo.description,
      url: post.seo.canonical,
      siteName: "Sanchit Pandey",
      publishedTime: isoDate(post.publishedAt),
      modifiedTime: isoDate(post.updatedAt),
      authors: [PERSON.name],
      tags: post.tags,
      images: image,
    },
    twitter: {
      card: "summary_large_image",
      title: post.seo.title,
      description: post.seo.description,
      images: image,
    },
    robots: { index: true, follow: true },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const result = await getPost(slug);

  // Unpublished, deleted, or distribution switched off: genuinely gone here.
  if (result.status === "missing") notFound();

  if (result.status === "unavailable") {
    return (
      <article className="np-article bl-article">
        <Breadcrumbs
          items={[
            { name: "Home", href: "/" },
            { name: BLOG_TITLE, href: "/blog" },
            { name: "Unavailable" },
          ]}
        />
        <header className="np-art-head">
          <div className="np-eyebrow">Writing</div>
          <h1 className="np-art-title">
            This copy is <em>catching up.</em>
          </h1>
          <p className="bl-standfirst">
            The article lives on {BLOG_HOME_LABEL} and this mirror could not be
            refreshed just now. The original is always available.
          </p>
        </header>
        <div className="dt-actions">
          <a
            href={`${BLOG_ORIGIN}/blog/${slug}`}
            className="endcap-cta"
            target="_blank"
            rel="noopener"
          >
            Read it on {BLOG_HOME_LABEL} <span aria-hidden="true">↗</span>
          </a>
          <Link href="/blog" className="np-back dt-cta-alt">
            <span aria-hidden="true">&larr;</span> All writing
          </Link>
        </div>
      </article>
    );
  }

  const { post } = result;
  const { html, headings } = renderArticle(post.contentHtml);
  const showToc = shouldShowToc(headings);
  const updated = wasUpdated(post.publishedAt, post.updatedAt);
  const reading = readingLabel(post.readingTime);

  // Curated project links, resolved against this site's own project pages.
  const relatedProjects = (
    await Promise.all(
      projectSlugsForArticle(post.slug).map(async (projectSlug) => {
        try {
          return await getProjectBySlug(projectSlug);
        } catch {
          return null;
        }
      }),
    )
  ).filter((project): project is NonNullable<typeof project> => Boolean(project));

  // Reuses the listing request the site has already cached.
  const more = (await getLatestPosts(4))
    .filter((p) => p.slug !== post.slug)
    .slice(0, 3);

  return (
    <article className="np-article bl-article">
      <JsonLd
        data={graph([
          blogPostingNode({
            title: post.title,
            description: post.seo.description,
            canonical: post.seo.canonical,
            datePublished: isoDate(post.publishedAt),
            dateModified: isoDate(post.updatedAt),
            image: post.featuredImage,
            tags: post.tags,
            section: categoryLabel(post.category),
          }),
          breadcrumbNode([
            { name: "Home", url: absoluteUrl("/") },
            { name: BLOG_TITLE, url: absoluteUrl("/blog") },
            { name: post.title },
          ]),
        ])}
      />

      <Breadcrumbs
        items={[
          { name: "Home", href: "/" },
          { name: BLOG_TITLE, href: "/blog" },
          { name: post.title },
        ]}
      />

      <header className="np-art-head bl-art-head">
        <div className="np-eyebrow">{categoryLabel(post.category)}</div>
        <h1 className="np-art-title">{post.title}</h1>
        {post.excerpt ? <p className="bl-standfirst">{post.excerpt}</p> : null}

        <div className="np-art-meta">
          <span>
            By <b>{PERSON.name}</b>
          </span>
          <time dateTime={isoDate(post.publishedAt)}>
            {formatDate(post.publishedAt)}
          </time>
          {updated ? (
            <span>
              Updated{" "}
              <time dateTime={isoDate(post.updatedAt)}>
                {formatDate(post.updatedAt)}
              </time>
            </span>
          ) : null}
          {reading ? <span>{reading}</span> : null}
        </div>
      </header>

      {post.featuredImage ? (
        <figure className="bl-art-media">
          <Image
            src={post.featuredImage}
            alt={post.imageAlt || ""}
            fill
            sizes="(max-width: 860px) 100vw, 760px"
            className="bl-art-img"
            priority
          />
        </figure>
      ) : null}

      {showToc ? <Toc headings={headings} /> : null}

      <div
        id={BODY_ID}
        className="bl-prose"
        dangerouslySetInnerHTML={{ __html: html }}
      />
      <CodeCopy containerId={BODY_ID} />

      {post.tags.length > 0 ? (
        <div className="tag-row bl-art-tags">
          {post.tags.map((tag) => (
            <span className="tag" key={tag}>
              {tag}
            </span>
          ))}
        </div>
      ) : null}

      <p className="bl-origin">
        Originally published on{" "}
        <a href={post.url} target="_blank" rel="noopener">
          {BLOG_HOME_LABEL}
        </a>
        .
      </p>

      {relatedProjects.length > 0 ? (
        <section className="bl-related" aria-labelledby="bl-related-project">
          <h2 className="bl-related-label" id="bl-related-project">
            The work behind it
          </h2>
          <ul className="bl-related-list">
            {relatedProjects.map((project) => (
              <li key={project.id}>
                <Link href={`/projects/${project.slug}`}>
                  {project.title}
                  {project.titleEm ? ` ${project.titleEm}` : ""}
                </Link>
                <span>{project.category}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {more.length > 0 ? (
        <section className="bl-related" aria-labelledby="bl-related-writing">
          <h2 className="bl-related-label" id="bl-related-writing">
            More writing
          </h2>
          <ul className="bl-related-list">
            {more.map((item) => (
              <li key={item.slug}>
                <Link href={`/blog/${item.slug}`} prefetch={false}>
                  {item.title}
                </Link>
                <span>{formatDate(item.publishedAt)}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <footer className="np-art-foot">
        <Link href="/blog" className="np-back">
          <span aria-hidden="true">&larr;</span> All writing
        </Link>
      </footer>
    </article>
  );
}
