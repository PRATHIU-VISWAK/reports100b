/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    // Skip ESLint during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Skip TypeScript errors during builds
    ignoreBuildErrors: true,
  },
}

module.exports = nextConfig