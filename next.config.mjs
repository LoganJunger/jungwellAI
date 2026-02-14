/** @type {import('next').NextConfig} */
const logoHost = process.env.NEXT_PUBLIC_LOGO_API_HOST || "img.logo.dev";

const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: logoHost },
      { protocol: "https", hostname: "**" }
    ]
  }
};

export default nextConfig;
