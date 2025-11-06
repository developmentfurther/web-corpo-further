/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["ik.imagekit.io"],
      remotePatterns: [
      { protocol: "https", hostname: "**.cdninstagram.com" },
      { protocol: "https", hostname: "www.instagram.com" },
    ],
  },
  i18n: {
    locales: ["es", "en", "pt"],
    defaultLocale: "es",
  },
  experimental: { appDir: false },
  pageExtensions: ["js", "jsx"],
  distDir: ".next"
};

export default nextConfig;
