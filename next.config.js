/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [],
  },
  // Disable Turbopack
  experimental: {
    turbo: false,
  },
}

module.exports = nextConfig 