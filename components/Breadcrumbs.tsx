import Link from "next/link";

export interface Crumb {
  name: string;
  /** Site-relative path. Omit on the current page. */
  href?: string;
}

/**
 * Semantic breadcrumb trail. The matching BreadcrumbList JSON-LD is emitted by
 * the page, so the markup and the structured data always describe one journey.
 */
export function Breadcrumbs({ items }: { items: Crumb[] }) {
  return (
    <nav className="bl-crumbs" aria-label="Breadcrumb">
      <ol>
        {items.map((item, index) => (
          <li key={item.name}>
            {item.href ? (
              <Link href={item.href}>{item.name}</Link>
            ) : (
              <span aria-current="page">{item.name}</span>
            )}
            {index < items.length - 1 ? (
              <span className="bl-crumb-sep" aria-hidden="true">
                /
              </span>
            ) : null}
          </li>
        ))}
      </ol>
    </nav>
  );
}
