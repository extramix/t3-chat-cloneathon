import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  source: "/((?!api/).*)",
  rewrites: async () => {
    return [
      {
        source: "/((?!api/).*)",
        destination: "/static-app-shell",
      },
    ]
  },
  eslint: {
    // ⛔  Lint errors will be printed but the build will continue
    ignoreDuringBuilds: true,
  },

  // 2) Skip TypeScript compile-time errors in `next build`
  typescript: {
    // ⚠️  The emitted JS may still be wrong, you just won’t be blocked
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
