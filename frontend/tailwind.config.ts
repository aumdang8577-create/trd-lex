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
          primary: "#3B82F6",     /* Electric Azure Blue */
          "primary-light": "#60A5FA",
          "primary-dark": "#1D4ED8",
          secondary: "#F59E0B",   /* Warm Amber */
          "secondary-light": "#FBBF24",
          "secondary-dark": "#D97706",
          midnight: "#070A13",    /* Dark midnight blue background */
          text: "#F9FAFB",        /* Off-white primary text */
          "text-muted": "#9CA3AF", /* Muted gray text */
          surface: "#111827",     /* Slate-900 surface */
          "surface-dark": "#0B0F19",
          border: "#1F2937",      /* Slate-800 border */
        },
        val: {
          v: "#10B981",           /* V : Value - Emerald */
          a: "#3B82F6",           /* A : Appraise - Blue */
          l: "#F59E0B",           /* L : Legacy - Amber */
          u: "#8B5CF6",           /* U : Unity - Violet */
          e: "#EF4444",           /* E : Efficiency - Red */
        },
        status: {
          valid: "#10B981",      /* Emerald */
          pending: "#F59E0B",    /* Amber */
          invalid: "#EF4444",    /* Red */
        },
      },
      fontFamily: {
        sans: ["var(--font-sarabun)", "sans-serif"],
        mono: ["Courier New", "Courier", "monospace"],
      },
      boxShadow: {
        card: "0px 10px 25px -5px rgba(0, 0, 0, 0.3)",
        "card-hover": "0px 20px 35px -5px rgba(0, 0, 0, 0.4)",
        flat: "0px 0px 15px 0px rgba(59, 130, 246, 0.08)", /* Glowing border instead of flat offset */
        "flat-hover": "0px 0px 20px 0px rgba(59, 130, 246, 0.15)",
      },
      backgroundImage: {
        "trd-gradient": "linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)",
        "gold-gradient": "linear-gradient(135deg, #F59E0B 0%, #D97706 100%)",
        "hero-gradient": "radial-gradient(ellipse at top, #111827, #0B0F19)",
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
