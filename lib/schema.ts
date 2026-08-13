import { PERSON, PERSON_ID, SITE_NAME, WEBSITE_ID, absoluteUrl } from "./site";

/**
 * JSON-LD builders.
 *
 * One Person entity, one WebSite entity, referenced by @id everywhere else, so
 * the portfolio, the projects and the mirrored articles all resolve to the same
 * author rather than three lookalike people. Every value here is something the
 * site already states in visible content.
 */

type Node = Record<string, unknown>;

export function personNode(): Node {
  return {
    "@type": "Person",
    "@id": PERSON_ID,
    name: PERSON.name,
    url: absoluteUrl("/"),
    jobTitle: PERSON.jobTitle,
    email: `mailto:${PERSON.email}`,
    address: {
      "@type": "PostalAddress",
      addressLocality: PERSON.locality,
      addressRegion: PERSON.region,
      addressCountry: PERSON.country,
    },
    knowsAbout: [...PERSON.knowsAbout],
    sameAs: [...PERSON.sameAs],
  };
}

export function websiteNode(): Node {
  return {
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    url: absoluteUrl("/"),
    name: SITE_NAME,
    inLanguage: "en",
    publisher: { "@id": PERSON_ID },
  };
}

export interface Crumb {
  name: string;
  /** Absolute URL. Omitted on the current page, per schema.org guidance. */
  url?: string;
}

export function breadcrumbNode(items: Crumb[]): Node {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      ...(item.url ? { item: item.url } : {}),
    })),
  };
}

export function webPageNode({
  type = "WebPage",
  url,
  name,
  description,
}: {
  type?: "WebPage" | "ProfilePage" | "ContactPage" | "CollectionPage";
  url: string;
  name: string;
  description?: string;
}): Node {
  return {
    "@type": type,
    "@id": `${url}#webpage`,
    url,
    name,
    ...(description ? { description } : {}),
    isPartOf: { "@id": WEBSITE_ID },
    about: { "@id": PERSON_ID },
    inLanguage: "en",
  };
}

export interface ArticleNodeInput {
  title: string;
  description: string;
  /** The original article URL on the central blog. */
  canonical: string;
  datePublished: string;
  dateModified: string;
  image?: string | null;
  tags?: string[];
  section?: string;
}

/**
 * Schema for a mirrored article.
 *
 * url and mainEntityOfPage both point at blog.sanchit.pro, matching the
 * canonical tag: this page is a copy, and the markup says so rather than
 * claiming the portfolio is the place of publication.
 */
export function blogPostingNode(post: ArticleNodeInput): Node {
  return {
    "@type": "BlogPosting",
    "@id": `${post.canonical}#article`,
    headline: post.title.slice(0, 110),
    description: post.description,
    url: post.canonical,
    mainEntityOfPage: { "@type": "WebPage", "@id": post.canonical },
    datePublished: post.datePublished,
    dateModified: post.dateModified,
    author: { "@id": PERSON_ID },
    publisher: { "@id": PERSON_ID },
    ...(post.image ? { image: [post.image] } : {}),
    ...(post.tags?.length ? { keywords: post.tags.join(", ") } : {}),
    ...(post.section ? { articleSection: post.section } : {}),
    inLanguage: "en",
    isAccessibleForFree: true,
  };
}

export function creativeWorkNode({
  url,
  name,
  description,
  images,
  keywords,
}: {
  url: string;
  name: string;
  description: string;
  images?: string[];
  keywords?: string;
}): Node {
  return {
    "@type": "CreativeWork",
    "@id": `${url}#project`,
    url,
    name,
    description,
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    ...(images?.length ? { image: images } : {}),
    ...(keywords ? { keywords } : {}),
    inLanguage: "en",
  };
}

/** Wraps nodes in a single @graph so one script tag describes the page. */
export function graph(nodes: Node[]): Node {
  return { "@context": "https://schema.org", "@graph": nodes };
}
