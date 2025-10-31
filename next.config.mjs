/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["images.unsplash.com"],
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
