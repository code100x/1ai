import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true,
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
