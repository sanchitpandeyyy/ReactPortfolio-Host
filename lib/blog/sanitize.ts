import { BLOG_ORIGIN } from "@/lib/site";

/**
 * Allowlist sanitizer for mirrored article HTML.
 *
 * The central blog already escapes text and allowlists link protocols when it
 * renders TipTap documents to HTML, but this site must not depend on that: the
 * HTML crosses a network boundary before it is injected into the page. So the
 * document is re-tokenised here and rebuilt from scratch. Unknown tags are
 * unwrapped (their text survives), script-like tags are dropped with their
 * contents, and every attribute is re-derived from an allowlist, so nothing an
 * editor pastes, and nothing a compromised response could add, can execute.
 *
 * It is deliberately conservative about structure and generous about content:
 * headings, code, tables, figures and lists all survive intact, because
 * breaking a technical article is its own kind of failure.
 */

/** tag -> attributes that may survive on it. */
const ALLOWED: Record<string, readonly string[]> = {
  p: ["style"],
  h1: ["id", "style"],
  h2: ["id", "style"],
  h3: ["id", "style"],
  h4: ["id", "style"],
  h5: ["id", "style"],
  h6: ["id", "style"],
  ul: ["class"],
  ol: ["start"],
  li: [],
  blockquote: [],
  pre: ["data-language"],
  code: ["class"],
  hr: [],
  br: [],
  figure: [],
  figcaption: [],
  img: ["src", "alt", "width", "height", "loading", "decoding"],
  a: ["href", "target", "rel"],
  strong: [],
  b: [],
  em: [],
  i: [],
  s: [],
  del: [],
  u: [],
  mark: [],
  sub: [],
  sup: [],
  small: [],
  div: ["class"],
  span: ["class"],
  table: [],
  thead: [],
  tbody: [],
  tfoot: [],
  caption: [],
  tr: [],
  th: ["colspan", "rowspan", "scope"],
  td: ["colspan", "rowspan"],
  iframe: ["src", "title", "loading", "allow", "allowfullscreen", "width", "height"],
};

/** Dropped together with everything inside them. */
const DROP_CONTENT = new Set([
  "script",
  "style",
  "noscript",
  "template",
  "object",
  "embed",
  "applet",
  "form",
  "input",
  "button",
  "select",
  "textarea",
  "svg",
  "math",
]);

const VOID = new Set(["br", "hr", "img", "source", "col", "wbr"]);

/** Classes the blog's renderer emits, plus language-* on code elements. */
const CLASS_ALLOWED = new Set(["task-list", "table-scroll", "video-embed"]);

/** Embeds are limited to hosts whose players are known and safe to frame. */
const IFRAME_HOSTS = new Set([
  "www.youtube.com",
  "youtube.com",
  "www.youtube-nocookie.com",
  "youtube-nocookie.com",
  "player.vimeo.com",
]);

export function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/** Undo the escaping the blog applies, so code can be re-tokenised safely. */
export function decodeEntities(value: string): string {
  return value
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#0?39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/&nbsp;/g, "\u00a0")
    .replace(/&amp;/g, "&");
}

/* ── attribute values ───────────────────────────────────────────────────── */

/**
 * Links inside mirrored content are the original author's links. A relative
 * one means "somewhere on the blog", so it is resolved against the blog rather
 * than silently pointing at a portfolio path that does not exist.
 */
function safeHref(raw: string): string | null {
  const value = raw.trim();
  if (value === "") return null;
  if (value.startsWith("#")) return value;
  if (/^(\/|\.\.?\/)/.test(value)) {
    try {
      return new URL(value, `${BLOG_ORIGIN}/`).toString();
    } catch {
      return null;
    }
  }
  if (/^(https?:|mailto:|tel:)/i.test(value)) {
    try {
      return new URL(value).toString();
    } catch {
      return null;
    }
  }
  // javascript:, data:, vbscript: and anything else unknown.
  return null;
}

/** Images must be absolute https by the time they reach the page. */
function safeImgSrc(raw: string): string | null {
  const value = raw.trim();
  if (value === "") return null;
  try {
    const url = /^https?:\/\//i.test(value)
      ? new URL(value)
      : new URL(value, `${BLOG_ORIGIN}/`);
    return url.protocol === "https:" ? url.toString() : null;
  } catch {
    return null;
  }
}

function safeIframeSrc(raw: string): string | null {
  try {
    const url = new URL(raw.trim());
    if (url.protocol !== "https:") return null;
    return IFRAME_HOSTS.has(url.hostname) ? url.toString() : null;
  } catch {
    return null;
  }
}

/** The single inline style the editor can set. */
function safeStyle(raw: string): string | null {
  const match = raw.match(/text-align\s*:\s*(left|right|center|justify)/i);
  return match ? `text-align:${match[1].toLowerCase()}` : null;
}

function safeClass(raw: string, tag: string): string | null {
  const kept = raw
    .split(/\s+/)
    .filter(
      (c) =>
        CLASS_ALLOWED.has(c) ||
        ((tag === "code" || tag === "pre") && /^language-[\w+#.-]{1,24}$/.test(c)),
    );
  return kept.length ? kept.join(" ") : null;
}

function safeInt(raw: string): string | null {
  const n = Number.parseInt(raw, 10);
  return Number.isFinite(n) && n > 0 && n <= 10000 ? String(n) : null;
}

function safeToken(raw: string, allowed: readonly string[]): string | null {
  const value = raw.trim().toLowerCase();
  return allowed.includes(value) ? value : null;
}

/* ── tokenizer ──────────────────────────────────────────────────────────── */

const TOKEN_RE =
  /<!--[\s\S]*?-->|<\/?([a-zA-Z][a-zA-Z0-9-]*)((?:\s+[^\s"'>/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s"'=<>`]+))?)*)\s*\/?>/g;

const ATTR_RE =
  /([^\s"'>/=]+)(?:\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s"'=<>`]+)))?/g;

function parseAttributes(raw: string): Map<string, string> {
  const found = new Map<string, string>();
  for (const match of raw.matchAll(ATTR_RE)) {
    const name = match[1].toLowerCase();
    const value = match[2] ?? match[3] ?? match[4] ?? "";
    if (!found.has(name)) found.set(name, value);
  }
  return found;
}

/** Rebuilds the attribute list for one tag from the allowlist. */
function buildAttributes(tag: string, raw: string): string {
  const allowed = ALLOWED[tag] ?? [];
  const given = parseAttributes(raw);
  const out: string[] = [];

  const push = (name: string, value: string | null) => {
    if (value !== null) out.push(`${name}="${escapeHtml(value)}"`);
  };

  for (const name of allowed) {
    if (!given.has(name)) continue;
    const value = given.get(name) ?? "";

    switch (name) {
      case "href":
        push("href", safeHref(value));
        break;
      case "src":
        push("src", tag === "iframe" ? safeIframeSrc(value) : safeImgSrc(value));
        break;
      case "style":
        push("style", safeStyle(value));
        break;
      case "class":
        push("class", safeClass(value, tag));
        break;
      case "width":
      case "height":
      case "colspan":
      case "rowspan":
      case "start":
        push(name, safeInt(value));
        break;
      case "target":
        push("target", safeToken(value, ["_blank", "_self"]));
        break;
      case "loading":
        push("loading", safeToken(value, ["lazy", "eager"]));
        break;
      case "decoding":
        push("decoding", safeToken(value, ["async", "sync", "auto"]));
        break;
      case "scope":
        push("scope", safeToken(value, ["row", "col", "rowgroup", "colgroup"]));
        break;
      case "allowfullscreen":
        out.push("allowfullscreen");
        break;
      case "rel":
        // Recomputed below for links; never trusted verbatim.
        break;
      case "allow":
        push(
          "allow",
          /^[a-z0-9;\-\s*()'":/.]{0,200}$/i.test(value) ? value.trim() : null,
        );
        break;
      case "id":
        push("id", /^[\w-]{1,120}$/.test(value) ? value : null);
        break;
      case "alt":
        push("alt", value.slice(0, 500));
        break;
      case "title":
        push("title", value.slice(0, 300));
        break;
      case "data-language":
        push(
          "data-language",
          /^[\w+#.-]{1,24}$/.test(value) ? value.toLowerCase() : null,
        );
        break;
      default:
        break;
    }
  }

  let attrs = out.join(" ");
  if (tag === "a" && attrs.includes('target="_blank"')) {
    attrs += ' rel="noopener noreferrer"';
  }
  if (tag === "img") {
    // An image with no alt at all is worse than one marked decorative.
    if (!attrs.includes("alt=")) attrs += ' alt=""';
    // Content images are below the fold by definition.
    if (!attrs.includes("loading=")) attrs += ' loading="lazy" decoding="async"';
  }
  return attrs;
}

/* ── the sanitizer ──────────────────────────────────────────────────────── */

/**
 * Rebuilds `html` from an allowlist.
 *
 * Text between tags is preserved verbatim (the source escapes it); any tag not
 * in the allowlist is unwrapped so its text survives, and script-like tags are
 * removed together with their contents. Unbalanced tags are closed at the end,
 * so a truncated response cannot leak markup into the surrounding page.
 */
export function sanitizeArticleHtml(html: string): string {
  if (!html) return "";

  const out: string[] = [];
  const open: string[] = [];
  let dropDepth = 0;
  let dropTag = "";
  let cursor = 0;

  TOKEN_RE.lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = TOKEN_RE.exec(html)) !== null) {
    const [token, rawTag, rawAttrs = ""] = match;

    if (dropDepth === 0 && match.index > cursor) {
      out.push(html.slice(cursor, match.index));
    }
    cursor = match.index + token.length;

    // Comments carry no meaning once mirrored.
    if (rawTag === undefined) continue;

    const tag = rawTag.toLowerCase();
    const closing = token.startsWith("</");

    if (dropDepth > 0) {
      if (tag === dropTag) dropDepth += closing ? -1 : 1;
      continue;
    }

    if (DROP_CONTENT.has(tag)) {
      if (!closing && !token.endsWith("/>")) {
        dropDepth = 1;
        dropTag = tag;
      }
      continue;
    }

    if (!(tag in ALLOWED)) continue; // unwrap: keep the children, drop the tag

    if (closing) {
      const at = open.lastIndexOf(tag);
      if (at === -1) continue; // stray close tag
      // Close anything left open inside it, so nesting stays valid.
      for (let i = open.length - 1; i >= at; i--) out.push(`</${open[i]}>`);
      open.length = at;
      continue;
    }

    const attrs = buildAttributes(tag, rawAttrs);
    // An iframe without a usable source is an empty box; drop it entirely.
    if (tag === "iframe" && !attrs.includes("src=")) continue;
    if (tag === "img" && !attrs.includes("src=")) continue;
    // A link whose href was rejected is just text: unwrap it. The matching
    // close tag finds nothing open and is dropped with it.
    if (tag === "a" && !attrs.includes("href=")) continue;

    out.push(`<${tag}${attrs ? ` ${attrs}` : ""}>`);
    if (!VOID.has(tag) && !token.endsWith("/>")) open.push(tag);
  }

  if (dropDepth === 0 && cursor < html.length) out.push(html.slice(cursor));
  for (let i = open.length - 1; i >= 0; i--) out.push(`</${open[i]}>`);

  return out.join("");
}

/** Plain text of an HTML fragment. Used for TOC labels and meta fallbacks. */
export function stripHtml(html: string): string {
  return decodeEntities(html.replace(/<[^>]*>/g, "")).replace(/\s+/g, " ").trim();
}
