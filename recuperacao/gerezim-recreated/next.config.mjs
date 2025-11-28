/**
 * Next.js config for the recreated GEREZIM project
 */
const nextConfig = {
  reactStrictMode: true,
  // experimental: serverActions are available by default in Next.js 14+ — no explicit flag required.
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' }
    ]
  }
}

export default nextConfig
