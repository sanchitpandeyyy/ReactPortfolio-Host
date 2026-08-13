import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { getSiteSeo } from "@/lib/content";
import { PERSON, SITE_LOCALE, SITE_NAME, absoluteUrl, siteUrl } from "@/lib/site";

const defaults = {
  title: "Sanchit Pandey · Full-Stack Developer",
  description:
    "Sanchit Pandey · Full-stack engineer based in Butwal, Nepal. Shipping web platforms, e-commerce, and community products with Next.js, TypeScript, and Postgres.",
  keywords: [
    "Sanchit Pandey",
    "Full-Stack Developer",
    "Next.js",
    "TypeScript",
    "Web Developer Nepal",
    "Butwal",
    "CSIT Association of BMC",
    "WordCamp Nepal",
  ],
  ogTitle: "Sanchit Pandey · Full-Stack Developer",
  ogDescription:
    "Full-stack engineer based in Butwal, Nepal. A one-person studio that ships software.",
};

export async function generateMetadata(): Promise<Metadata> {
  let seo = null;
  try {
    seo = await getSiteSeo();
  } catch {
    // DB unavailable (e.g. at build time) — fall back to defaults.
  }

  const title = seo?.title || defaults.title;
  const description = seo?.description || defaults.description;

  return {
    metadataBase: new URL(siteUrl()),
    title: {
      // Subpages set a short title; the site name is appended once, here.
      default: title,
      template: `%s · ${PERSON.name}`,
    },
    description,
    applicationName: SITE_NAME,
    authors: [{ name: PERSON.name, url: absoluteUrl("/") }],
    creator: PERSON.name,
    publisher: PERSON.name,
    keywords: seo?.keywords?.length ? seo.keywords : defaults.keywords,
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: absoluteUrl("/"),
      siteName: SITE_NAME,
      locale: SITE_LOCALE,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#f4f2eb",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin=""
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Geist:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
        {/*
          Reveal animations start at opacity 0 and are switched on by an
          observer. Without JavaScript that would hide the entire page, so the
          effect is disabled outright when scripts do not run.
        */}
        <noscript>
          <style>{`[data-reveal]{opacity:1!important;transform:none!important;filter:none!important}`}</style>
        </noscript>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
