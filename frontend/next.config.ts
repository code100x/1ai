import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
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
