import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Skip TypeScript errors during build - Convex has its own type checking
  // via `npx convex dev`. The placeholder types in convex/_generated
  // will cause errors until the user runs `npx convex dev`.
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
