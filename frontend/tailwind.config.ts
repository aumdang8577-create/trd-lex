import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        trd: {
          primary: "#00594C",     // เขียวธนารักษ์
          "primary-light": "#007A68",
          "primary-dark": "#003D34",
          secondary: "#D4AF37",   // สีทองทรัพย์สิน
          "secondary-light": "#E0C464",
          "secondary-dark": "#B8922B",
          surface: "#F8F9FA",     // พื้นหลังสะอาดตา
          "surface-dark": "#1A1A2E",
          border: "#E0E0E0",     // เส้นขอบระเบียบ
        },
        status: {
          valid: "#2E7D32",      // ผ่านการตรวจสอบ
          pending: "#ED6C02",    // รอการตรวจสอบ
          invalid: "#D32F2F",    // สัญญาไม่ถูกต้อง
        },
      },
      fontFamily: {
        sans: ['"Noto Sans Thai"', "Sarabun", "sans-serif"],
      },
      boxShadow: {
        card: "0 4px 6px -1px rgba(0, 89, 76, 0.1), 0 2px 4px -1px rgba(0, 89, 76, 0.06)",
        "card-hover": "0 10px 25px -5px rgba(0, 89, 76, 0.15), 0 8px 10px -6px rgba(0, 89, 76, 0.1)",
        gold: "0 4px 14px 0 rgba(212, 175, 55, 0.3)",
      },
      backgroundImage: {
        "trd-gradient": "linear-gradient(135deg, #00594C 0%, #007A68 50%, #00594C 100%)",
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #E0C464 50%, #D4AF37 100%)",
        "hero-gradient": "linear-gradient(180deg, #00594C 0%, #003D34 100%)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "pulse-gold": "pulseGold 2s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseGold: {
          "0%, 100%": { boxShadow: "0 0 0 0 rgba(212, 175, 55, 0.4)" },
          "50%": { boxShadow: "0 0 0 10px rgba(212, 175, 55, 0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
