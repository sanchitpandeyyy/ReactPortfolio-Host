/**
 * Display helpers for mirrored article metadata.
 *
 * Dates are formatted in UTC with a fixed locale so the server and the client
 * always produce the same string: a locale-dependent date is a hydration bug
 * waiting to happen, and a shifting one is a fake-freshness signal.
 */

const DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export function formatDate(iso: string): string {
  const date = new Date(iso);
  return Number.isFinite(date.getTime()) ? DATE_FORMAT.format(date) : "";
}

/** Machine-readable date for <time datetime> and JSON-LD. */
export function isoDate(iso: string): string {
  const date = new Date(iso);
  return Number.isFinite(date.getTime()) ? date.toISOString() : "";
}

/** True when an article was meaningfully revised after publication. */
export function wasUpdated(publishedAt: string, updatedAt: string): boolean {
  const published = Date.parse(publishedAt);
  const updated = Date.parse(updatedAt);
  if (!Number.isFinite(published) || !Number.isFinite(updated)) return false;
  // A day of slack: a typo fix minutes after publishing is not an update.
  return updated - published > 24 * 60 * 60 * 1000;
}

/** "6 min" from the CMS becomes "6 min read"; "6 min read" stays as it is. */
export function readingLabel(readingTime: string): string {
  const value = readingTime.trim();
  if (!value) return "";
  return /read/i.test(value) ? value : `${value} read`;
}

/** Folder slugs become human labels: "react-native" -> "React Native". */
export function categoryLabel(category: string): string {
  if (!category || category === "uncategorized") return "Writing";
  return category
    .split(/[-_]/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}
