import { highlightArticleHtml } from "./highlight";
import { sanitizeArticleHtml, stripHtml } from "./sanitize";

/**
 * Turns the CMS's HTML into the exact markup this site renders.
 *
 * Order matters: sanitize first, so highlighting and heading rewriting only
 * ever operate on markup that is already known-good.
 */

export interface Heading {
  id: string;
  text: string;
  level: 2 | 3;
}

export interface RenderedArticle {
  html: string;
  headings: Heading[];
}

/** Enough sections that a reader benefits from an overview. */
const TOC_MIN_HEADINGS = 3;

const HEADING_RE = /<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g;

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

/**
 * Collects h2/h3 anchors, guaranteeing every heading has a unique id.
 *
 * The blog already emits ids derived from the heading text; this keeps them
 * (so links shared from the original still land in the right place) and only
 * invents one when it is missing or has been used twice on the same page.
 */
function withHeadingAnchors(html: string): RenderedArticle {
  const headings: Heading[] = [];
  const used = new Set<string>();

  const out = html.replace(
    HEADING_RE,
    (full, level: string, attrs: string, inner: string) => {
      const text = stripHtml(inner);
      if (!text) return full;

      const existing = attrs.match(/\sid="([^"]*)"/);
      let id = existing?.[1] || slugify(text) || `section-${headings.length + 1}`;
      if (used.has(id)) {
        let n = 2;
        while (used.has(`${id}-${n}`)) n += 1;
        id = `${id}-${n}`;
      }
      used.add(id);

      headings.push({ id, text, level: level === "3" ? 3 : 2 });
      const rest = attrs.replace(/\sid="[^"]*"/, "");
      return `<h${level} id="${id}"${rest}>${inner}</h${level}>`;
    },
  );

  return { html: out, headings };
}

/** Sanitize, highlight, anchor. The only function pages should call. */
export function renderArticle(contentHtml: string): RenderedArticle {
  const safe = sanitizeArticleHtml(contentHtml);
  const highlighted = highlightArticleHtml(safe);
  return withHeadingAnchors(highlighted);
}

/** A table of contents is noise on a short post, so it is opt-in by length. */
export function shouldShowToc(headings: Heading[]): boolean {
  return headings.filter((h) => h.level === 2).length >= TOC_MIN_HEADINGS;
}
