import type { Metadata } from "next";
import Link from "next/link";
import { SiteFooter } from "@/components/Footer";
import { SubpageHeader } from "@/components/SubpageHeader";

/**
 * Shown for any URL that does not resolve. It is a real 404 rather than a
 * redirect.
 */
export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <>
      <SubpageHeader />
      <main className="np-main">
        <article className="np-article">
          <header className="np-art-head">
            <div className="np-eyebrow">404</div>
            <h1 className="np-art-title">
              This page isn&apos;t <em>here.</em>
            </h1>
            <p className="bl-standfirst">
              The link may be out of date. Everything else is a click away.
            </p>
          </header>

          <div className="dt-actions">
            <Link href="/" className="endcap-cta">
              Back home <span aria-hidden="true">&rarr;</span>
            </Link>
            <a href="https://sanchit.pro/blog" className="np-back dt-cta-alt">
              Read the writing <span aria-hidden="true">&rarr;</span>
            </a>
          </div>
        </article>
      </main>
      <SiteFooter />
    </>
  );
}
