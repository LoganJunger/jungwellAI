/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "logo.hubspot.com" },
      { protocol: "https", hostname: "**" }
    ]
  }
};

export default nextConfig;
