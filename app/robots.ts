import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/site";

/**
 * Crawlers get the whole public site, including CSS, JS and images: blocking
 * those would stop Google rendering the pages it is meant to judge. Only the
 * admin panel and the API surface are off limits, and neither is linked from
 * public HTML.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/"],
    },
    sitemap: absoluteUrl("/sitemap.xml"),
    host: absoluteUrl("/").replace(/^https?:\/\//, "").replace(/\/$/, ""),
  };
}
