import type { Metadata } from "next";
import { Sarabun } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/features/Navbar/Navbar";

// ตั้งค่าฟอนต์ Sarabun สำหรับความน่าเชื่อถือและอ่านง่าย
const sarabun = Sarabun({ 
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-sarabun',
  display: "swap",
});

export const metadata: Metadata = {
  title: "TRD-LEX | แพลตฟอร์มเปลี่ยนมือสิทธิการเช่าที่ราชพัสดุ",
  description: "Official Marketplace สำหรับการโอนสิทธิการเช่าที่ราชพัสดุอย่างโปร่งใสและถูกต้อง",
  keywords: ["ที่ราชพัสดุ", "เช่าที่ดิน", "กรมธนารักษ์", "สิทธิการเช่า", "TRD-LEX"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={sarabun.variable}>
      <body className="font-sans bg-trd-surface text-gray-800 antialiased min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
      </body>
    </html>
  );
}

