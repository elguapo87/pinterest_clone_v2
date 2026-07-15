import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["@napi-rs/canvas"],

  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ik.imagekit.io",
        port: "",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;