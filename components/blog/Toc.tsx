import type { Heading } from "@/lib/blog/content";

/** In-page navigation for longer articles. Plain anchors, no JavaScript. */
export function Toc({ headings }: { headings: Heading[] }) {
  return (
    <nav className="bl-toc" aria-labelledby="bl-toc-label">
      <h2 className="bl-toc-label" id="bl-toc-label">
        On this page
      </h2>
      <ol className="bl-toc-list">
        {headings.map((heading) => (
          <li
            key={heading.id}
            className={heading.level === 3 ? "bl-toc-sub" : undefined}
          >
            <a href={`#${heading.id}`}>{heading.text}</a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
