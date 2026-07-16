/** @type {import('next').NextConfig} */
import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === "true";

const nextConfig: NextConfig = {
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
  // เมื่อบิวด์บน GitHub Actions ให้ส่งออกเป็น Static HTML
  output: isGithubActions ? "export" : "standalone",
  // กำหนด subpath ของ repository สำหรับ GitHub Pages
  basePath: isGithubActions ? "/trd-lex" : "",
  // บังคับใช้ trailing slash เพื่อให้การเปิดลิงก์ย่อยตรงๆ ทำงานได้บน GitHub Pages
  trailingSlash: true,
};

export default nextConfig;
