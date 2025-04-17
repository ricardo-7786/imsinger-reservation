const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'export', // ✅ Netlify 정적 배포용
  experimental: {
    appDir: true,
  },
  webpack: (config) => {
    config.resolve.alias["@lib"] = path.resolve(__dirname, "lib");
    return config;
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          {
            key: "X-Frame-Options",
            value: "ALLOWALL",
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
