/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true, // ปิดใช้งานการย่อรูปภาพของ Next.js เนื่องจาก Static Hosting ไม่รอบรับ
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
