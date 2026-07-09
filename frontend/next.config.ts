/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow external images (for listing photos)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
