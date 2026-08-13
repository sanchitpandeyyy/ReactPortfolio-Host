/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  experimental: {
    serverActions: {
      // Admin image uploads go through server actions.
      bodySizeLimit: "10mb",
    },
  },
  images: {
    /**
     * Only hosts that actually serve this site's imagery: Cloudinary for
     * project uploads and the central blog for article art. A wildcard here
     * would turn the image optimiser into an open proxy for any URL an API
     * response happened to contain.
     */
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "blog.sanchit.pro" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // /notes was the placeholder blog. The articles now come from the
      // central blog and live under /blog, so the old URLs move permanently.
      { source: "/notes", destination: "/blog", permanent: true },
      { source: "/notes/:slug", destination: "/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
