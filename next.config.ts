import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // output: "export",
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: { unoptimized: true }, // REQUIRED for next/image with export
};

export default nextConfig;
