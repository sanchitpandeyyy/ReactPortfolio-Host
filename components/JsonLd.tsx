/**
 * Renders one JSON-LD block.
 *
 * Escaping "<" matters: a string inside the data (a title containing a closing
 * script tag, say) would otherwise end the script element early and inject
 * markup into the page.
 */
export function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify(data).replace(/</g, "\\u003c");
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  );
}
