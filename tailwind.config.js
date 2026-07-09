/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        trd: {
          primary: "#00594C", // เขียวธนารักษ์
          secondary: "#D4AF37", // สีทองทรัพย์สิน
          surface: "#F8F9FA", // พื้นหลังสะอาดตา
          border: "#E0E0E0", // เส้นขอบระเบียบ
        },
        status: {
          valid: "#2E7D32",   // ผ่านการตรวจสอบ
          pending: "#ED6C02", // รอการตรวจสอบ
          invalid: "#D32F2F", // สัญญาไม่ถูกต้อง
        }
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', 'Sarabun', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 89, 76, 0.1), 0 2px 4px -1px rgba(0, 89, 76, 0.06)',
      }
    },
  },
  plugins: [],
};