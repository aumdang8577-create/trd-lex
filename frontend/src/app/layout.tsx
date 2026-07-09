import type { Metadata } from "next";
import { Noto_Sans_Thai, Sarabun } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/features/Navbar/Navbar";

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

const sarabun = Sarabun({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-sarabun",
  display: "swap",
});
export const metadata: Metadata = {
  title: "TRD Lease Exchange (TRD-LEX) — ตลาดรองสิทธิการเช่าที่ราชพัสดุ",
  description:
    "แพลตฟอร์มตลาดรองเพื่อการเปลี่ยนมือสิทธิการเช่าที่ราชพัสดุ ค้นหา เสนอขาย และจัดการสิทธิ์ได้อย่างโปร่งใสและตรวจสอบได้",
  keywords: ["ที่ราชพัสดุ", "เช่าที่ดิน", "กรมธนารักษ์", "สิทธิการเช่า", "TRD-LEX"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={`${notoSansThai.variable} ${sarabun.variable}`}>
      <body className="min-h-screen bg-trd-surface font-sans">
        <Navbar />
        <main>{children}</main>
      </body>
    </html>
  );
}
