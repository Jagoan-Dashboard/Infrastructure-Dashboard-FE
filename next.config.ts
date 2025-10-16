import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "s3-backend-dashboard.jagoansatudata.com",
        port: "",
        pathname: "/jagoanbe/reports/**",
      },
    ],
  },
};

export default nextConfig;
