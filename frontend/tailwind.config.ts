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
          primary: "var(--trd-primary)",     /* Royal Navy */
          "primary-light": "var(--trd-primary-light)",
          "primary-dark": "var(--trd-primary-dark)",
          secondary: "var(--trd-secondary)",   /* Classic Gold */
          "secondary-light": "var(--trd-secondary-light)",
          "secondary-dark": "var(--trd-secondary-dark)",
          midnight: "#0F1A30",    /* Deep Royal Navy background */
          text: "var(--trd-text)",        /* Adaptive text color */
          "text-muted": "var(--trd-text-muted)", /* Adaptive muted text color */
          surface: "var(--trd-surface)",     /* Adaptive surface background */
          "surface-dark": "#070D1A",
          border: "var(--trd-border)",      /* Adaptive border color */
        },
        val: {
          v: "var(--trd-secondary-dark)", /* V : Value - Gold */
          a: "var(--trd-primary)",        /* A : Appraise - Navy */
          l: "var(--trd-secondary)",      /* L : Legacy - Gold */
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
        card: "0px 10px 25px -5px rgba(15, 26, 48, 0.05)",
        "card-hover": "0px 20px 35px -5px rgba(15, 26, 48, 0.1)",
        flat: "0px 0px 15px 0px rgba(212, 175, 55, 0.08)", /* Glowing border instead of flat offset */
        "flat-hover": "0px 0px 20px 0px rgba(212, 175, 55, 0.15)",
      },
      backgroundImage: {
        "trd-gradient": "linear-gradient(135deg, #0F1A30 0%, #070D1A 100%)",
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #AA7C11 100%)",
        "hero-gradient": "radial-gradient(ellipse at top, #1E2E4A, #0F1A30)",
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
