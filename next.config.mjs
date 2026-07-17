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
};

export default nextConfig;
