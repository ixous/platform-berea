import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.centrocristianoberea.org",
      },
    ],
  },
};

export default nextConfig;
