/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export", // ส่งออกเป็น HTML/CSS/JS แบบ Static เพื่อโฮสต์บน GitHub Pages
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
