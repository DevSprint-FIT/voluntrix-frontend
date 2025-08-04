import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    domains: [
      'pbs.twimg.com',
      'res.cloudinary.com',
      'encrypted-tbn0.gstatic.com',
      'rackigo7lakesgolf.standardintern.com',
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.payhere.lk https://*.payhere.lk",
              "style-src 'self' 'unsafe-inline'",
              "img-src 'self' data: blob: https:",
              "font-src 'self' data:",
              "connect-src 'self' https://api.payhere.lk https://*.payhere.lk https:",
              "frame-src 'self' https://www.payhere.lk https://*.payhere.lk",
              "object-src 'none'",
              "base-uri 'self'",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
