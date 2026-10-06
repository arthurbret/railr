import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  async redirects() {
    // v1 home lived at /dashboard (installed PWAs still start there).
    return [{ source: "/dashboard", destination: "/", permanent: true }]
  },
}

export default nextConfig
