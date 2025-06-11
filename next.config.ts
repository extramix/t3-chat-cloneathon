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
};

export default nextConfig;
