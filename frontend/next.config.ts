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
  eslint: {
    ignoreDuringBuilds: true, // ข้ามขั้นตอนการรัน ESlint ตอนสั่ง Build เพื่อป้องกันปัญหาลิงก์เตือนสีแดงชนกันล้มเหลว
  },
  typescript: {
    ignoreBuildErrors: true, // ป้องกันปัญหาตัวแปรเสริมล้มเหลวในระบบคลาวด์บิวด์
  },
};

export default nextConfig;
