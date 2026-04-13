import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  poweredByHeader: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-ac9f5d9fc73d402ca8032993e2b2761c.r2.dev",
      },
    ],
  },
};

export default nextConfig;
