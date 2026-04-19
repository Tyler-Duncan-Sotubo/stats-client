import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  basePath: "/stats",
  async redirects() {
    return [
      {
        source: "/",
        destination: "/stats",
        permanent: false,
        basePath: false, // ← important, bypasses basePath prefix
      },
    ];
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "i.scdn.co",
      },
      {
        protocol: "https",
        hostname: "*.scdn.co",
      },
      {
        protocol: "https",
        hostname: "tooxclusive.com",
      },
    ],
  },
};

export default nextConfig;
