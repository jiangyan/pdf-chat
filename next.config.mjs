/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    config.resolve.alias.canvas = false
    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-eval' 'unsafe-inline' unpkg.com",
              "worker-src 'self' blob: unpkg.com",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' blob: data:",
              "connect-src 'self' blob: unpkg.com",
              "frame-src 'self'"
            ].join('; ')
          }
        ],
      }
    ]
  }
};

export default nextConfig;
