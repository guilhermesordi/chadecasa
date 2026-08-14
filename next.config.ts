import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  serverExternalPackages: ["@prisma/client", "prisma"],
  experimental: {
    serverActions: {
      bodySizeLimit: "8mb",
    },
  },
};

export default nextConfig;
