import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://sanchitpandey.com.np"),
  title: "Sanchit Pandey — Full-Stack Developer",
  description:
    "Sanchit Pandey · Full-stack engineer based in Butwal, Nepal. Shipping web platforms, e-commerce, and community products with Next.js, TypeScript, and Postgres.",
  authors: [{ name: "Sanchit Pandey" }],
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
  openGraph: {
    title: "Sanchit Pandey — Full-Stack Developer",
    description:
      "Full-stack engineer based in Butwal, Nepal. A one-person studio that ships software.",
    url: "https://sanchitpandey.com.np",
    siteName: "Sanchit Pandey",
    locale: "en_US",
    type: "website",
  },
  robots: { index: true, follow: true },
};

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
      <body>{children}</body>
    </html>
  );
}
