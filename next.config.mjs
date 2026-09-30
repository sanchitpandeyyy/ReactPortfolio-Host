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
     * project uploads and the asset CDN. A wildcard here would turn the image
     * optimiser into an open proxy.
     */
    remotePatterns: [
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "assets.sanchit.pro" },
    ],
    formats: ["image/avif", "image/webp"],
  },
  async redirects() {
    return [
      // All writing lives on sanchit.pro/blog. Old /blog and /notes URLs on
      // this site move there permanently, path for path.
      { source: "/blog", destination: "https://sanchit.pro/blog", permanent: true },
      { source: "/blog/:path*", destination: "https://sanchit.pro/blog/:path*", permanent: true },
      { source: "/notes", destination: "https://sanchit.pro/blog", permanent: true },
      { source: "/notes/:slug", destination: "https://sanchit.pro/blog/:slug", permanent: true },
    ];
  },
};

export default nextConfig;
