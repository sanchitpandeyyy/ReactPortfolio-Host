import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getPost } from "@/lib/notes";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Note not found · Sanchit Pandey" };
  return {
    title: `${post.title} · Sanchit Pandey`,
    description: post.excerpt,
  };
}

export default async function NotePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  return (
    <article className="np-article">
      <Link href="/notes" className="np-back" data-reveal>
        <span aria-hidden="true">&larr;</span> All notes
      </Link>

      <header className="np-art-head" data-reveal>
        <div className="np-eyebrow">{post.category}</div>
        <h1 className="np-art-title">{post.title}</h1>
        <div className="np-art-meta">
          <span>
            By <b>{post.author}</b>
          </span>
          <span>{post.date}</span>
          <span>{post.readingMinutes} min read</span>
          <span>{post.views.toLocaleString()} views</span>
        </div>
        {post.tags.length > 0 && (
          <div className="tag-row np-art-tags">
            {post.tags.map((t) => (
              <span className="tag" key={t}>
                {t}
              </span>
            ))}
          </div>
        )}
      </header>

      <div className="np-art-body" data-reveal>
        {post.body.map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      <footer className="np-art-foot" data-reveal>
        <Link href="/notes" className="np-back">
          <span aria-hidden="true">&larr;</span> Back to all notes
        </Link>
      </footer>
    </article>
  );
}
