import type { NextConfig } from "next";
import path from "path";

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
  turbopack: {
    root: path.resolve(__dirname, ".."),
  },
};

export default nextConfig;
