const path = require("path");

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone', // ✅ Netlify에서 CSR 및 SSR 지원 (정적 export 대신)
  experimental: {
    appDir: true, // ✅ Next 13+ app directory 사용하는 경우 필요
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
            value: "ALLOWALL", // ✅ iframe 허용을 위한 핵심
          },
        ],
      },
    ];
  },
};

module.exports = nextConfig;
