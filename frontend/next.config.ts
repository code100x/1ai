import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "3000",
      }
    ],
  },
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/ask",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
