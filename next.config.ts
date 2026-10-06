import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // Lets a phone on the same Wi-Fi load the dev server (dev only).
  allowedDevOrigins: ["192.168.*.*", "10.*.*.*"],
  async redirects() {
    // v1 home lived at /dashboard (installed PWAs still start there).
    return [{ source: "/dashboard", destination: "/", permanent: true }]
  },
}

export default nextConfig
