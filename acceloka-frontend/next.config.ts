import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      {
        source: '/',
        destination: '/tickets',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
