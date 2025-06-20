/** @type {import('next').NextConfig} */

const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/backend/:path*",
        destination: "http://85.215.60.9:3000/:path*",
      },
    ];
  },
};

module.exports = nextConfig;
