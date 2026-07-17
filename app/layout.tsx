import type { Metadata, Viewport } from "next";
import "./globals.css";
import { Analytics } from "@/components/Analytics";
import { getSiteSeo } from "@/lib/content";

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
    metadataBase: new URL("https://sanchitpandey.com.np"),
    title,
    description,
    authors: [{ name: "Sanchit Pandey" }],
    keywords: seo?.keywords?.length ? seo.keywords : defaults.keywords,
    openGraph: {
      title: seo?.ogTitle || title,
      description: seo?.ogDescription || description,
      url: "https://sanchitpandey.com.np",
      siteName: "Sanchit Pandey",
      locale: "en_US",
      type: "website",
    },
    robots: { index: true, follow: true },
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
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
