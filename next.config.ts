import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Allow HMR from local network interfaces during development */
  ...(process.env.NODE_ENV === "development" && {
    allowedDevOrigins: [
      "localhost",
      "127.0.0.1",
      "localhost:3000",
      "127.0.0.1:3000",
    ],
  }),
};

export default nextConfig;
