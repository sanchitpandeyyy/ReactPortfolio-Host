import type { Metadata } from "next";
import { BlogIndexView } from "@/components/blog/BlogIndexView";
import { BLOG_DESCRIPTION } from "@/lib/blog/config";
import { absoluteUrl, defaultSocialImage } from "@/lib/site";

/**
 * The blog index is a first-class page of this portfolio, so unlike the
 * mirrored articles it canonicalises to itself.
 *
 * Rendered statically and revalidated on a timer, with the central blog's
 * webhook invalidating it the moment an article is published or withdrawn.
 */
export const revalidate = 300;

const title = "Writing";

export const metadata: Metadata = {
  title,
  description: BLOG_DESCRIPTION,
  alternates: { canonical: absoluteUrl("/blog") },
  openGraph: {
    type: "website",
    title: `${title} · Sanchit Pandey`,
    description: BLOG_DESCRIPTION,
    url: absoluteUrl("/blog"),
    images: [defaultSocialImage()],
  },
  twitter: {
    card: "summary_large_image",
    title: `${title} · Sanchit Pandey`,
    description: BLOG_DESCRIPTION,
    images: [defaultSocialImage().url],
  },
  robots: { index: true, follow: true },
};

export default function BlogIndexPage() {
  return <BlogIndexView page={1} />;
}
