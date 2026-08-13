import { getPosts } from "./client";
import type { PostSummary } from "./types";

/**
 * Curated links between portfolio projects and central articles.
 *
 * Deliberately explicit. Matching on overlapping tags would happily claim that
 * an article about Postgres indexes is "related" to every project that touches
 * a database, which is the kind of automatic internal linking that reads as
 * spam to a human and to a crawler.
 *
 * Keys are project slugs from this site's database; values are article slugs
 * from blog.sanchit.pro. Adding a pair here is the only step needed: the
 * project page and the article page both pick it up, and if the article is not
 * distributed to the portfolios the link simply does not render.
 *
 * If the central API ever exposes related-project ids, replace the lookup in
 * relatedArticles() with that data; nothing else here has to change.
 */
export const PROJECT_ARTICLES: Record<string, string[]> = {
  // "all-due": ["react-native-encryption"],
};

/** Articles curated for a project, in the order they were listed. */
export function articleSlugsForProject(projectSlug: string): string[] {
  return PROJECT_ARTICLES[projectSlug] ?? [];
}

/** Projects curated for an article. */
export function projectSlugsForArticle(articleSlug: string): string[] {
  return Object.entries(PROJECT_ARTICLES)
    .filter(([, articles]) => articles.includes(articleSlug))
    .map(([project]) => project);
}

/**
 * Resolves curated article slugs against the distributed feed.
 *
 * Costs nothing when no relation is configured, and one already-cached list
 * request otherwise, rather than one detail request per article.
 */
export async function relatedArticles(
  projectSlug: string,
): Promise<PostSummary[]> {
  const wanted = articleSlugsForProject(projectSlug);
  if (wanted.length === 0) return [];

  const { posts } = await getPosts({ page: 1, perPage: 50 });
  const bySlug = new Map(posts.map((p) => [p.slug, p]));
  return wanted
    .map((slug) => bySlug.get(slug))
    .filter((p): p is PostSummary => p !== undefined);
}
