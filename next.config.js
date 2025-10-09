/** @type {import('next').NextConfig} */

// Allow these parent sites to embed this app in an <iframe>
const FRAME_ANCESTORS =
  process.env.FRAME_ANCESTORS ||
  "https://www.abdurakhmonbek.com https://abdurakhmonbek.com";

const nextConfig = {
  reactStrictMode: true,
  async headers() {
    return [
      // CSP headers for all routes (allows iframe embedding)
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: `frame-ancestors 'self' ${FRAME_ANCESTORS}`,
          },
          {
            key: 'Referrer-Policy',
            value: 'no-referrer-when-downgrade',
          },
        ],
      },
      // CORS headers for API routes
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: process.env.FRONTEND_ORIGIN || '*' },
          { key: 'Access-Control-Allow-Methods', value: 'GET,POST,OPTIONS' },
          { key: 'Access-Control-Allow-Headers', value: 'Content-Type' },
        ],
      },
    ]
  },
}

module.exports = nextConfig
